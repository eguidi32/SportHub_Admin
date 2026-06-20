export type BookingStatus =
  | "EN_ATTENTE"
  | "CONFIRMEE"
  | "REFUSEE"
  | "ANNULEE"
  | "TERMINEE";

export type BookingItem = {
  id: number;
  clientNom?: string;
  clientEmail?: string;
  terrainNom?: string;
  typeTerrain?: "FOOTBALL" | "BASKETBALL" | "TENNIS";
  gestionnaireNom?: string;
  gestionnaireEmail?: string;
  dateReservation?: string;
  heureDebut?: string;
  heureFin?: string;
  montant?: number;
  statut: BookingStatus;
  createdAt?: string;
};