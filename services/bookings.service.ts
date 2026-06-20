import { api } from "@/lib/api";
import {
  compact,
  toArrayPayload,
  toNumber,
  toStringValue,
} from "@/services/api-normalizers";
import type { BookingItem, BookingStatus } from "@/types/booking";

type BackendBooking = Record<string, unknown>;

type PageResponse<T> = {
  content: T[];
};

const bookingStatuses: BookingStatus[] = [
  "EN_ATTENTE",
  "CONFIRMEE",
  "REFUSEE",
  "ANNULEE",
  "TERMINEE",
];

const mapBookingStatus = (status: unknown): BookingStatus => {
  const value = toStringValue(status)?.toUpperCase();
  return bookingStatuses.find((item) => item === value) ?? "EN_ATTENTE";
};

const mapTerrainType = (type: unknown): BookingItem["typeTerrain"] => {
  const value = toStringValue(type)?.toUpperCase();
  if (value === "FOOT") return "FOOTBALL";
  if (value === "BASKET") return "BASKETBALL";
  if (value === "FOOTBALL" || value === "BASKETBALL" || value === "TENNIS") {
    return value;
  }

  return undefined;
};

const mapBackendBooking = (booking: BackendBooking): BookingItem | null => {
  const id = toNumber(booking.id);
  if (!id) return null;

  return {
    id,
    clientNom: toStringValue(booking.clientNom) ?? toStringValue(booking.nomClient),
    clientEmail: toStringValue(booking.clientEmail),
    terrainNom:
      toStringValue(booking.terrainNom) ?? toStringValue(booking.nomTerrain),
    typeTerrain: mapTerrainType(booking.typeTerrain),
    gestionnaireNom: toStringValue(booking.gestionnaireNom),
    gestionnaireEmail: toStringValue(booking.gestionnaireEmail),
    dateReservation: toStringValue(booking.dateReservation),
    heureDebut: toStringValue(booking.heureDebut),
    heureFin: toStringValue(booking.heureFin),
    montant: toNumber(booking.montant) ?? toNumber(booking.montantTotal),
    statut: mapBookingStatus(booking.statut),
    createdAt: toStringValue(booking.createdAt),
  };
};

export const getBookings = async (): Promise<BookingItem[]> => {
  try {
    const response = await api.get<BackendBooking[] | PageResponse<BackendBooking>>(
      "/api/admin/reservations"
    );

    return compact(
      toArrayPayload<BackendBooking>(response.data).map(mapBackendBooking)
    );
  } catch {
    return [];
  }
};

export const getBookingById = async (
  id: number
): Promise<BookingItem | null> => {
  const bookings = await getBookings();
  return bookings.find((booking) => booking.id === id) ?? null;
};
