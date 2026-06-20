export type ClientItem = {
  id: number;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  actif?: boolean;
  nombreReservations?: number;
  montantDepense?: number;
  createdAt?: string;
};