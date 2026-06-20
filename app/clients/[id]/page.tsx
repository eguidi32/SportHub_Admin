"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailItem, DetailSection, DetailShell } from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { getClientById } from "@/services/clients.service";
import type { ClientItem } from "@/types/client";

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>();
  const [client, setClient] = useState<ClientItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getClientById(id)
      .then(setClient)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail client"
        subtitle="Profil et activite du client selectionne."
        backHref="/clients"
        backLabel="Retour aux clients"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement du client...
          </div>
        ) : !client ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Client introuvable.
          </div>
        ) : (
          <DetailSection title="Client">
            <DetailItem
              label="Nom complet"
              value={
                client.prenom || client.nom
                  ? `${client.prenom ?? ""} ${client.nom ?? ""}`.trim()
                  : "Nom non renseigne"
              }
            />
            <DetailItem label="Email" value={client.email} />
            <DetailItem label="Telephone" value={client.telephone} />
            <DetailItem label="Statut" value={<StatusBadge active={client.actif} />} />
            <DetailItem
              label="Reservations"
              value={client.nombreReservations ?? 0}
            />
            <DetailItem
              label="Depenses"
              value={`${(client.montantDepense ?? 0).toLocaleString()} FCFA`}
            />
          </DetailSection>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
