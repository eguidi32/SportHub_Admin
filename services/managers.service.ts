import { api } from "@/lib/api";
import {
  compact,
  toArrayPayload,
  toBoolean,
  toNumber,
  toStringValue,
} from "@/services/api-normalizers";
import type { ManagerItem } from "@/types/manager";

type BackendManager = Record<string, unknown>;

const mapBackendManager = (manager: BackendManager): ManagerItem | null => {
  const id = toNumber(manager.id);
  const email = toStringValue(manager.email);
  const terrains = Array.isArray(manager.terrains) ? manager.terrains : undefined;

  if (!id || !email) return null;

  return {
    id,
    nom: toStringValue(manager.nom),
    prenom: toStringValue(manager.prenom),
    email,
    telephone: toStringValue(manager.telephone),
    actif: toBoolean(manager.actif),
    valide: toBoolean(manager.valide),
    nombreTerrains: terrains?.length,
    createdAt: toStringValue(manager.createdAt),
  };
};

export const getManagers = async (): Promise<ManagerItem[]> => {
  try {
    const response = await api.get<unknown>("/api/admin/gestionnaires");
    return compact(
      toArrayPayload<BackendManager>(response.data).map(mapBackendManager)
    );
  } catch {
    return [];
  }
};

export const getManagerById = async (
  id: number
): Promise<ManagerItem | null> => {
  const managers = await getManagers();
  return managers.find((manager) => manager.id === id) ?? null;
};

export const validateManager = async (id: number) => {
  return api.put(`/api/admin/gestionnaires/${id}/valider`);
};

export const deleteManager = async (id: number) => {
  return api.delete(`/api/admin/gestionnaires/${id}`);
};
