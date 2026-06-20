export type UserRole = "CLIENT" | "COACH" | "GESTIONNAIRE" | "ADMIN";

export type UserStatus = "ACTIF" | "INACTIF";

export type AdminUserItem = {
  id: number;
  nom?: string;
  prenom?: string;
  email: string;
  role: UserRole;
  actif?: boolean;
  createdAt?: string;
};