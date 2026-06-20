import { api } from "@/lib/api";
import axios from "axios";
import type { AdminUser, AuthResponse, LoginPayload } from "@/types/auth";

const getTokenFromResponse = (data: AuthResponse): string | null => {
  return data.token || data.jwt || data.accessToken || null;
};

const getUserFromResponse = (data: AuthResponse): AdminUser => {
  return {
    id: data.user?.id || data.userId,
    nom: data.user?.nom || data.nom,
    prenom: data.user?.prenom || data.prenom,
    email: data.user?.email || data.email || "",
    role: data.user?.role || data.role || "",
  };
};

const saveAdminSession = (token: string, user: AdminUser) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("sporthub_admin_token", token);
  localStorage.setItem("sporthub_admin_user", JSON.stringify(user));
};

const getLoginErrorMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return "Impossible de se connecter. Vérifiez vos identifiants.";
  }

  const status = error.response?.status;

  if (status === 401 || status === 403) {
    return "Email ou mot de passe incorrect.";
  }

  if (status && status >= 500) {
    return "Erreur serveur côté backend. Réessayez dans un instant.";
  }

  if (!error.response) {
    return "Backend inaccessible ou CORS non autorisé.";
  }

  return "Impossible de se connecter. Vérifiez vos identifiants.";
};

export const loginAdmin = async (payload: LoginPayload) => {
  try {
    const response = await api.post<AuthResponse>("/api/auth/login", {
      email: payload.email,
      motDePasse: payload.password,
    });

    const token = getTokenFromResponse(response.data);
    const user = getUserFromResponse(response.data);

    if (!token) {
      throw new Error("Aucun token reçu depuis le backend.");
    }

    if (user.role !== "ADMIN") {
      throw new Error("Accès refusé. Ce compte n'est pas un administrateur.");
    }

    saveAdminSession(token, user);

    return {
      token,
      user,
    };
  } catch (error) {
    if (error instanceof Error && !axios.isAxiosError(error)) {
      throw error;
    }

    throw new Error(getLoginErrorMessage(error));
  }
};

export const logoutAdmin = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("sporthub_admin_token");
    localStorage.removeItem("sporthub_admin_user");
    window.location.href = "/login";
  }
};

export const getStoredAdmin = (): AdminUser | null => {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("sporthub_admin_user");

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AdminUser;
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("sporthub_admin_token");
  const user = getStoredAdmin();

  return Boolean(token && user?.role === "ADMIN");
};
