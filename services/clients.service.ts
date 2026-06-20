import { compact, toBoolean, toNumber, toStringValue } from "@/services/api-normalizers";
import {
  fetchBackendUsers,
  mapBackendUserToAdminUser,
  type BackendUser,
} from "@/services/users.service";
import type { ClientItem } from "@/types/client";

const mapBackendUserToClient = (user: BackendUser): ClientItem | null => {
  const id = toNumber(user.id);
  const email = toStringValue(user.email);

  if (!id || !email) return null;

  return {
    id,
    nom: toStringValue(user.nom),
    prenom: toStringValue(user.prenom),
    email,
    telephone: toStringValue(user.telephone),
    actif: toBoolean(user.actif),
    createdAt: toStringValue(user.createdAt),
  };
};

export const getClients = async (): Promise<ClientItem[]> => {
  try {
    const users = await fetchBackendUsers({ complete: true });

    return compact(
      users
        .filter((user) => mapBackendUserToAdminUser(user)?.role === "CLIENT")
        .map(mapBackendUserToClient)
    );
  } catch {
    return [];
  }
};

export const getClientById = async (
  id: number
): Promise<ClientItem | null> => {
  const clients = await getClients();
  return clients.find((client) => client.id === id) ?? null;
};
