export type LoginPayload = {
  email: string;
  password: string;
};

export type AdminUser = {
  id?: number;
  nom?: string;
  prenom?: string;
  email: string;
  role: string;
};

export type AuthResponse = {
  token?: string;
  jwt?: string;
  accessToken?: string;
  userId?: number;
  role?: string;
  email?: string;
  nom?: string;
  prenom?: string;
  user?: AdminUser;
};
