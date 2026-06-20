import { api } from "@/lib/api";
import {
  compact,
  toArrayPayload,
  toNumber,
  toStringValue,
} from "@/services/api-normalizers";
import type { PaymentItem, PaymentMethod, PaymentStatus } from "@/types/payment";

type BackendPayment = Record<string, unknown>;

type PageResponse<T> = {
  content: T[];
};

const methods: PaymentMethod[] = ["WAVE", "ORANGE_MONEY", "ESPECE"];

const mapPaymentMethod = (method: unknown): PaymentMethod | undefined => {
  const value = toStringValue(method)?.toUpperCase();
  return methods.find((item) => item === value);
};

const mapPaymentStatus = (status: unknown): PaymentStatus => {
  const value = toStringValue(status)?.toUpperCase();

  if (value === "SUCCES" || value === "PAYE") return "PAYE";
  if (value === "ECHEC" || value === "ECHOUE") return "ECHOUE";
  if (value === "ANNULE" || value === "REMBOURSE") return value;

  return "EN_ATTENTE";
};

const mapPaymentType = (type: unknown): PaymentItem["type"] => {
  const value = toStringValue(type)?.toUpperCase();
  return value === "SEANCE_COACH" ? "SEANCE_COACH" : "RESERVATION_TERRAIN";
};

const mapBackendPayment = (payment: BackendPayment): PaymentItem | null => {
  const id = toNumber(payment.id);
  if (!id) return null;

  return {
    id,
    transactionId: toStringValue(payment.transactionId),
    clientNom: toStringValue(payment.clientNom),
    clientEmail: toStringValue(payment.clientEmail),
    terrainNom: toStringValue(payment.terrainNom),
    gestionnaireNom: toStringValue(payment.gestionnaireNom),
    type: mapPaymentType(payment.type),
    montant: toNumber(payment.montant) ?? 0,
    methode: mapPaymentMethod(payment.methode),
    statut: mapPaymentStatus(payment.statut),
    datePaiement: toStringValue(payment.datePaiement),
    createdAt: toStringValue(payment.createdAt),
  };
};

export const getPayments = async (): Promise<PaymentItem[]> => {
  try {
    const response = await api.get<BackendPayment[] | PageResponse<BackendPayment>>(
      "/api/admin/paiements"
    );

    return compact(
      toArrayPayload<BackendPayment>(response.data).map(mapBackendPayment)
    );
  } catch {
    return [];
  }
};

export const getPaymentById = async (
  id: number
): Promise<PaymentItem | null> => {
  const payments = await getPayments();
  return payments.find((payment) => payment.id === id) ?? null;
};
