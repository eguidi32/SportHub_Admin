import { api } from "@/lib/api";
import {
  compact,
  isRecord,
  toNumber,
  toPagePayload,
  toStringValue,
} from "@/services/api-normalizers";
import { getManagers } from "@/services/managers.service";
import type { FieldItem } from "@/types/field";
import type { ManagerItem } from "@/types/manager";

type BackendTerrainType = "FOOT" | "BASKET" | "TENNIS" | "FOOTBALL" | "BASKETBALL";

type BackendTerrain = Record<string, unknown>;

type PageResponse<T> = {
  content: T[];
};

const mapTerrainType = (type?: unknown): FieldItem["type"] | undefined => {
  const value = toStringValue(type)?.toUpperCase() as
    | BackendTerrainType
    | undefined;

  if (value === "FOOT") return "FOOTBALL";
  if (value === "BASKET") return "BASKETBALL";
  if (value === "FOOTBALL" || value === "BASKETBALL" || value === "TENNIS") {
    return value;
  }

  return undefined;
};

const mapFieldStatus = (status: unknown): FieldItem["statut"] | undefined => {
  const value = toStringValue(status)?.toUpperCase();

  if (
    value === "DISPONIBLE" ||
    value === "INDISPONIBLE" ||
    value === "MAINTENANCE"
  ) {
    return value;
  }

  return undefined;
};

const getManagerName = (manager?: ManagerItem): string | undefined => {
  if (!manager) return undefined;

  const fullName = `${manager.prenom ?? ""} ${manager.nom ?? ""}`.trim();
  return fullName || manager.email;
};

const mapBackendTerrain = (
  terrain: BackendTerrain,
  managersById: Map<number, ManagerItem>
): FieldItem | null => {
  const id = toNumber(terrain.id);
  const nom = toStringValue(terrain.nom);
  const gestionnaireId = toNumber(terrain.gestionnaireId);
  const nestedManager = isRecord(terrain.gestionnaire)
    ? terrain.gestionnaire
    : undefined;
  const manager = gestionnaireId ? managersById.get(gestionnaireId) : undefined;

  if (!id || !nom) return null;

  return {
    id,
    nom,
    type: mapTerrainType(terrain.type),
    localisation: toStringValue(terrain.localisation),
    adresse:
      toStringValue(terrain.adresse) ?? toStringValue(terrain.localisation),
    prixHeure: toNumber(terrain.prixHeure) ?? toNumber(terrain.prix),
    imageUrl: toStringValue(terrain.imageUrl),
    statut: mapFieldStatus(terrain.statut),
    gestionnaireNom:
      toStringValue(terrain.gestionnaireNom) ??
      toStringValue(nestedManager?.nom) ??
      getManagerName(manager),
    gestionnaireEmail:
      toStringValue(terrain.gestionnaireEmail) ??
      toStringValue(nestedManager?.email) ??
      manager?.email,
    createdAt: toStringValue(terrain.createdAt),
  };
};

export async function getFields(): Promise<FieldItem[]> {
  try {
    const response = await api.get<PageResponse<BackendTerrain> | BackendTerrain[]>(
      "/api/terrains",
      {
        params: { page: 0, size: 200 },
      }
    );
    const managers = await getManagers();
    const managersById = new Map(managers.map((manager) => [manager.id, manager]));

    return compact(
      toPagePayload<BackendTerrain>(response.data).items.map((terrain) =>
        mapBackendTerrain(terrain, managersById)
      )
    );
  } catch {
    return [];
  }
}

export async function getFieldById(id: number): Promise<FieldItem | null> {
  const fields = await getFields();
  return fields.find((field) => field.id === id) ?? null;
}
