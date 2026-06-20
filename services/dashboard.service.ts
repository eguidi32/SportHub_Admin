import { api } from "@/lib/api";
import { isRecord, toNumber } from "@/services/api-normalizers";
import type { DashboardStats } from "@/types/dashboard";

const emptyDashboardStats: DashboardStats = {
  totalUsers: 0,
  totalClients: 0,
  totalCoachs: 0,
  totalGestionnaires: 0,
  totalTerrains: 0,
  totalReservations: 0,
  totalSeances: 0,
  totalPaiements: 0,
  revenus: 0,
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.get<unknown>("/api/admin/dashboard");
    const data = isRecord(response.data) ? response.data : {};

    return {
      totalUsers: toNumber(data.totalUsers) ?? 0,
      totalClients: toNumber(data.totalClients) ?? 0,
      totalCoachs: toNumber(data.totalCoachs) ?? 0,
      totalGestionnaires: toNumber(data.totalGestionnaires) ?? 0,
      totalTerrains: toNumber(data.totalTerrains) ?? 0,
      totalReservations: toNumber(data.totalReservations) ?? 0,
      totalSeances: toNumber(data.totalSeances) ?? 0,
      totalPaiements: toNumber(data.totalPaiements) ?? 0,
      revenus: toNumber(data.revenus) ?? 0,
    };
  } catch {
    return emptyDashboardStats;
  }
};
