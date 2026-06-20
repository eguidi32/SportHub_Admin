export type CoachSessionStatus =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "REFUSEE"
  | "ANNULEE"
  | "TERMINEE";

export type CoachSessionItem = {
  id: number;
  clientNom?: string;
  clientEmail?: string;
  coachNom?: string;
  coachEmail?: string;
  specialite?: string;
  dateSeance?: string;
  heureDebut?: string;
  heureFin?: string;
  montant?: number;
  statut: CoachSessionStatus;
  createdAt?: string;
};