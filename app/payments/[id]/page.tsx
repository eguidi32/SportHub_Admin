"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailItem, DetailSection, DetailShell } from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PaymentStatusBadge } from "@/components/tables/PaymentStatusBadge";
import { getPaymentById } from "@/services/payments.service";
import type { PaymentItem } from "@/types/payment";

const formatPaymentMethod = (method?: PaymentItem["methode"]) => {
  if (method === "WAVE") return "Wave";
  if (method === "ORANGE_MONEY") return "Orange Money";
  if (method === "ESPECE") return "Espece";
  return "-";
};

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getPaymentById(id)
      .then(setPayment)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail paiement"
        subtitle="Transaction selectionnee depuis la supervision admin."
        backHref="/payments"
        backLabel="Retour aux paiements"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement du paiement...
          </div>
        ) : !payment ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Paiement introuvable ou endpoint admin non disponible.
          </div>
        ) : (
          <>
            <DetailSection title="Transaction">
              <DetailItem label="Transaction" value={payment.transactionId} />
              <DetailItem
                label="Statut"
                value={<PaymentStatusBadge status={payment.statut} />}
              />
              <DetailItem
                label="Montant"
                value={`${payment.montant.toLocaleString()} FCFA`}
              />
              <DetailItem
                label="Methode"
                value={formatPaymentMethod(payment.methode)}
              />
              <DetailItem
                label="Type"
                value={
                  payment.type === "RESERVATION_TERRAIN"
                    ? "Reservation terrain"
                    : "Seance coach"
                }
              />
              <DetailItem
                label="Date"
                value={
                  payment.datePaiement
                    ? new Date(payment.datePaiement).toLocaleDateString("fr-FR")
                    : "-"
                }
              />
            </DetailSection>

            <DetailSection title="Contexte">
              <DetailItem label="Client" value={payment.clientNom} />
              <DetailItem label="Email client" value={payment.clientEmail} />
              <DetailItem label="Terrain" value={payment.terrainNom} />
              <DetailItem label="Gestionnaire" value={payment.gestionnaireNom} />
            </DetailSection>
          </>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
