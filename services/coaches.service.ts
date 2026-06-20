import { api } from "@/lib/api";
import {
  compact,
  toPagePayload,
  toBoolean,
  toNumber,
  toStringValue,
} from "@/services/api-normalizers";
import {
  fetchBackendUsers,
  mapBackendUserToAdminUser,
} from "@/services/users.service";
import type { CoachItem } from "@/types/coach";

type PageResponse<T> = {
  content: T[];
};

type BackendCoach = Record<string, unknown>;
type BackendUser = Record<string, unknown>;

const parseExperience = (
  experience?: unknown
): number | undefined => {
  const numericValue = toNumber(experience);
  if (numericValue !== undefined) return numericValue;

  if (typeof experience !== "string") return undefined;

  const value = Number.parseInt(experience, 10);
  return Number.isNaN(value) ? undefined : value;
};

const mapBackendCoach = (
  coach: BackendCoach,
  usersById: Map<number, BackendUser>
): CoachItem | null => {
  const id = toNumber(coach.id);
  const email = toStringValue(coach.email);

  if (!id || !email) return null;

  const user = usersById.get(id);

  return {
    id,
    nom: toStringValue(coach.nom),
    prenom: toStringValue(coach.prenom),
    email,
    telephone: toStringValue(coach.telephone),
    specialite:
      toStringValue(coach.specialite) ||
      toStringValue(coach.description) ||
      toStringValue(coach.adresseSalle),
    experience: parseExperience(coach.experience),
    tarifSeance: toNumber(coach.tarifSeance) ?? toNumber(coach.tarif),
    imageUrl: toStringValue(coach.imageUrl),
    actif: toBoolean(coach.actif) ?? toBoolean(user?.actif),
    disponible: toBoolean(coach.disponible),
    nombreSeances: toNumber(coach.nombreSeances),
    noteMoyenne: toNumber(coach.noteMoyenne),
    createdAt: toStringValue(coach.createdAt),
  };
};

export const getCoaches = async (): Promise<CoachItem[]> => {
  try {
    const coachesResponse = await api.get<PageResponse<BackendCoach> | BackendCoach[]>(
      "/api/coachs",
      {
        params: { page: 0, size: 200 },
      }
    );

    let backendUsers: BackendUser[] = [];

    try {
      backendUsers = await fetchBackendUsers({ complete: true });
    } catch {
      backendUsers = [];
    }

    const usersById = new Map(
      backendUsers
        .filter((user) => mapBackendUserToAdminUser(user)?.role === "COACH")
        .map((user) => [toNumber(user.id), user] as const)
        .filter((entry): entry is [number, BackendUser] => entry[0] !== undefined)
    );
    const hasUserRoleReference = backendUsers.length > 0;

    return compact(
      toPagePayload<BackendCoach>(coachesResponse.data).items
        .filter((coach) => {
          const id = toNumber(coach.id);
          return !hasUserRoleReference || Boolean(id && usersById.has(id));
        })
        .map((coach) => mapBackendCoach(coach, usersById))
    );
  } catch {
    return [];
  }
};

export const getCoachById = async (
  id: number
): Promise<CoachItem | null> => {
  const coaches = await getCoaches();
  return coaches.find((coach) => coach.id === id) ?? null;
};
