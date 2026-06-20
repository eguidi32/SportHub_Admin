"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailItem, DetailSection, DetailShell } from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { getManagerById } from "@/services/managers.service";
import type { ManagerItem } from "@/types/manager";

export default function ManagerDetailPage() {
  const params = useParams<{ id: string }>();
  const [manager, setManager] = useState<ManagerItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getManagerById(id)
      .then(setManager)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail gestionnaire"
        subtitle="Compte gestionnaire et etat de validation."
        backHref="/managers"
        backLabel="Retour aux gestionnaires"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement du gestionnaire...
          </div>
        ) : !manager ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Gestionnaire introuvable.
          </div>
        ) : (
          <DetailSection title="Gestionnaire">
            <DetailItem
              label="Nom complet"
              value={
                manager.prenom || manager.nom
                  ? `${manager.prenom ?? ""} ${manager.nom ?? ""}`.trim()
                  : "Nom non renseigne"
              }
            />
            <DetailItem label="Email" value={manager.email} />
            <DetailItem label="Telephone" value={manager.telephone} />
            <DetailItem
              label="Validation"
              value={
                manager.valide ? (
                  <Badge>Valide</Badge>
                ) : (
                  <Badge variant="secondary">En attente</Badge>
                )
              }
            />
            <DetailItem label="Statut" value={<StatusBadge active={manager.actif} />} />
            <DetailItem
              label="Terrains associes"
              value={manager.nombreTerrains ?? 0}
            />
          </DetailSection>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
