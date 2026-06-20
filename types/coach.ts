export type CoachItem = {
  id: number;
  nom?: string;
  prenom?: string;
  email: string;
  telephone?: string;
  specialite?: string;
  experience?: number;
  tarifSeance?: number;
  imageUrl?: string;
  disponible?: boolean;
  actif?: boolean;
  nombreSeances?: number;
  noteMoyenne?: number;
  createdAt?: string;
};
