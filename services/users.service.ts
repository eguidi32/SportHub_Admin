import { api } from "@/lib/api";
import {
  compact,
  isRecord,
  toArrayPayload,
  toBoolean,
  toNumber,
  toObjectPayload,
  toStringValue,
} from "@/services/api-normalizers";
import type { AdminUserItem } from "@/types/user";

export type BackendUser = Record<string, unknown>;

const roles: AdminUserItem["role"][] = [
  "ADMIN",
  "CLIENT",
  "COACH",
  "GESTIONNAIRE",
];

const normalizeRole = (role: unknown): AdminUserItem["role"] | undefined => {
  const value = toStringValue(role)?.toUpperCase();
  return roles.find((item) => item === value);
};

const normalizeRoleFromUser = (
  user: BackendUser
): AdminUserItem["role"] | undefined => {
  const directRole =
    normalizeRole(user.role) ||
    normalizeRole(user.type) ||
    normalizeRole(user.userType);

  if (directRole) return directRole;

  if (Array.isArray(user.roles)) {
    const role = user.roles
      .map((item) => (isRecord(item) ? item.name ?? item.role : item))
      .map(normalizeRole)
      .find(Boolean);

    if (role) return role;
  }

  if (Array.isArray(user.authorities)) {
    const role = user.authorities
      .map((item) => (isRecord(item) ? item.authority : item))
      .map((item) => toStringValue(item)?.replace(/^ROLE_/, ""))
      .map(normalizeRole)
      .find(Boolean);

    if (role) return role;
  }

  return undefined;
};

const normalizeActive = (user: BackendUser): boolean | undefined => {
  const booleanValue =
    toBoolean(user.actif) ??
    toBoolean(user.active) ??
    toBoolean(user.enabled);

  if (booleanValue !== undefined) return booleanValue;

  const status =
    toStringValue(user.status)?.toUpperCase() ??
    toStringValue(user.statut)?.toUpperCase();

  if (status === "ACTIF" || status === "ACTIVE" || status === "ENABLED") {
    return true;
  }

  if (
    status === "INACTIF" ||
    status === "INACTIVE" ||
    status === "DISABLED"
  ) {
    return false;
  }

  return undefined;
};

const dedupeBackendUsers = (users: BackendUser[]): BackendUser[] => {
  const usersById = new Map<number, BackendUser>();

  users.forEach((user) => {
    const id = toNumber(user.id);
    if (!id) return;

    usersById.set(id, user);
  });

  return Array.from(usersById.values()).sort(
    (first, second) => (toNumber(first.id) ?? 0) - (toNumber(second.id) ?? 0)
  );
};

const getDashboardTotalUsers = async (): Promise<number | undefined> => {
  try {
    const response = await api.get<unknown>("/api/admin/dashboard");
    const dashboard = toObjectPayload(response.data);
    return toNumber(dashboard?.totalUsers);
  } catch {
    return undefined;
  }
};

const fetchBackendUserById = async (id: number): Promise<BackendUser | null> => {
  try {
    const response = await api.get<unknown>(`/api/admin/users/${id}`);
    return toObjectPayload<BackendUser>(response.data);
  } catch {
    return null;
  }
};

const completeUsersFromKnownIds = async (
  users: BackendUser[],
  totalUsers?: number
): Promise<BackendUser[]> => {
  if (!totalUsers || users.length >= totalUsers) {
    return dedupeBackendUsers(users);
  }

  const knownIds = users
    .map((user) => toNumber(user.id))
    .filter((id): id is number => id !== undefined);
  const maxKnownId = Math.max(0, ...knownIds);
  const maxScanId = Math.min(Math.max(maxKnownId, totalUsers * 3, 30), 120);
  const missingIds = Array.from({ length: maxScanId }, (_, index) => index + 1)
    .filter((id) => !knownIds.includes(id));

  const fetchedUsers: BackendUser[] = [];
  const batchSize = 6;

  for (let index = 0; index < missingIds.length; index += batchSize) {
    const batch = missingIds.slice(index, index + batchSize);
    const results = await Promise.all(batch.map(fetchBackendUserById));
    fetchedUsers.push(...compact(results));

    if (users.length + fetchedUsers.length >= totalUsers) {
      break;
    }
  }

  return dedupeBackendUsers([...users, ...fetchedUsers]);
};

export const fetchBackendUsers = async (options?: {
  complete?: boolean;
}): Promise<BackendUser[]> => {
  const response = await api.get<unknown>("/api/admin/users");
  const users = toArrayPayload<BackendUser>(response.data);

  if (!options?.complete) {
    return dedupeBackendUsers(users);
  }

  const totalUsers = await getDashboardTotalUsers();
  return completeUsersFromKnownIds(users, totalUsers);
};

export const mapBackendUserToAdminUser = (
  user: BackendUser
): AdminUserItem | null => {
  const id = toNumber(user.id);
  const email = toStringValue(user.email);
  const role = normalizeRoleFromUser(user);

  if (!id || !email || !role) return null;

  return {
    id,
    nom: toStringValue(user.nom),
    prenom: toStringValue(user.prenom),
    email,
    role,
    actif: normalizeActive(user),
    createdAt: toStringValue(user.createdAt),
  };
};

export const getUsers = async (): Promise<AdminUserItem[]> => {
  try {
    const users = await fetchBackendUsers({ complete: true });
    return compact(users.map(mapBackendUserToAdminUser));
  } catch {
    return [];
  }
};

export const getUserById = async (
  id: number
): Promise<AdminUserItem | null> => {
  try {
    const user = await fetchBackendUserById(id);
    return user ? mapBackendUserToAdminUser(user) : null;
  } catch {
    return null;
  }
};

export const activateUser = async (id: number) => {
  return api.put(`/api/admin/users/${id}/activate`);
};

export const deactivateUser = async (id: number) => {
  return api.put(`/api/admin/users/${id}/deactivate`);
};

export const deleteUser = async (id: number) => {
  return api.delete(`/api/admin/users/${id}`);
};
