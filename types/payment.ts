export type PaymentStatus =
  | "EN_ATTENTE"
  | "PAYE"
  | "ECHOUE"
  | "ANNULE"
  | "REMBOURSE";

export type PaymentType = "RESERVATION_TERRAIN" | "SEANCE_COACH";

export type PaymentMethod = "WAVE" | "ORANGE_MONEY" | "ESPECE";

export type PaymentItem = {
  id: number;
  transactionId?: string;
  clientNom?: string;
  clientEmail?: string;
  terrainNom?: string;
  gestionnaireNom?: string;
  type: PaymentType;
  montant: number;
  methode?: PaymentMethod;
  statut: PaymentStatus;
  datePaiement?: string;
  createdAt?: string;
};