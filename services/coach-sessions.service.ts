import { api } from "@/lib/api";
import {
  compact,
  toArrayPayload,
  toNumber,
  toStringValue,
} from "@/services/api-normalizers";
import type {
  CoachSessionItem,
  CoachSessionStatus,
} from "@/types/coach-session";

type BackendCoachSession = Record<string, unknown>;

type PageResponse<T> = {
  content: T[];
};

const sessionStatuses: CoachSessionStatus[] = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "REFUSEE",
  "ANNULEE",
  "TERMINEE",
];

const mapSessionStatus = (status: unknown): CoachSessionStatus => {
  const value = toStringValue(status)?.toUpperCase();
  return sessionStatuses.find((item) => item === value) ?? "EN_ATTENTE";
};

const mapBackendCoachSession = (
  session: BackendCoachSession
): CoachSessionItem | null => {
  const id = toNumber(session.id);
  if (!id) return null;

  return {
    id,
    clientNom: toStringValue(session.clientNom) ?? toStringValue(session.nomClient),
    clientEmail: toStringValue(session.clientEmail),
    coachNom: toStringValue(session.coachNom) ?? toStringValue(session.nomCoach),
    coachEmail: toStringValue(session.coachEmail),
    specialite: toStringValue(session.specialite),
    dateSeance: toStringValue(session.dateSeance),
    heureDebut: toStringValue(session.heureDebut),
    heureFin: toStringValue(session.heureFin),
    montant: toNumber(session.montant),
    statut: mapSessionStatus(session.statut),
    createdAt: toStringValue(session.createdAt),
  };
};

export const getCoachSessions = async (): Promise<CoachSessionItem[]> => {
  try {
    const response = await api.get<
      BackendCoachSession[] | PageResponse<BackendCoachSession>
    >("/api/admin/seances");

    return compact(
      toArrayPayload<BackendCoachSession>(response.data).map(
        mapBackendCoachSession
      )
    );
  } catch {
    return [];
  }
};

export const getCoachSessionById = async (
  id: number
): Promise<CoachSessionItem | null> => {
  const sessions = await getCoachSessions();
  return sessions.find((session) => session.id === id) ?? null;
};
