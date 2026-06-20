"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailItem, DetailSection, DetailShell } from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { BookingStatusBadge } from "@/components/tables/BookingStatusBadge";
import { getBookingById } from "@/services/bookings.service";
import type { BookingItem } from "@/types/booking";

export default function BookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getBookingById(id)
      .then(setBooking)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail reservation"
        subtitle="Reservation selectionnee depuis la supervision admin."
        backHref="/bookings"
        backLabel="Retour aux reservations"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement de la reservation...
          </div>
        ) : !booking ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Reservation introuvable ou endpoint admin non disponible.
          </div>
        ) : (
          <>
            <DetailSection title="Reservation">
              <DetailItem
                label="Statut"
                value={<BookingStatusBadge status={booking.statut} />}
              />
              <DetailItem label="Terrain" value={booking.terrainNom} />
              <DetailItem label="Sport" value={booking.typeTerrain} />
              <DetailItem
                label="Date"
                value={
                  booking.dateReservation
                    ? new Date(booking.dateReservation).toLocaleDateString("fr-FR")
                    : "-"
                }
              />
              <DetailItem
                label="Horaire"
                value={
                  booking.heureDebut && booking.heureFin
                    ? `${booking.heureDebut} - ${booking.heureFin}`
                    : "-"
                }
              />
              <DetailItem
                label="Montant"
                value={`${(booking.montant ?? 0).toLocaleString()} FCFA`}
              />
            </DetailSection>

            <DetailSection title="Participants">
              <DetailItem label="Client" value={booking.clientNom} />
              <DetailItem label="Email client" value={booking.clientEmail} />
              <DetailItem label="Gestionnaire" value={booking.gestionnaireNom} />
              <DetailItem
                label="Email gestionnaire"
                value={booking.gestionnaireEmail}
              />
            </DetailSection>
          </>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
