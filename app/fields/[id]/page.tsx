"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  DetailItem,
  DetailPhoto,
  DetailSection,
  DetailShell,
} from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { FieldStatusBadge } from "@/components/tables/FieldStatusBadge";
import { getFieldById } from "@/services/fields.service";
import type { FieldItem } from "@/types/field";

export default function FieldDetailPage() {
  const params = useParams<{ id: string }>();
  const [field, setField] = useState<FieldItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getFieldById(id)
      .then(setField)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail terrain"
        subtitle="Terrain selectionne et gestionnaire associe."
        backHref="/fields"
        backLabel="Retour aux terrains"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement du terrain...
          </div>
        ) : !field ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Terrain introuvable.
          </div>
        ) : (
          <>
            <DetailPhoto
              title="Photo du terrain"
              imageUrl={field.imageUrl}
              emptyText="Aucune photo n'est fournie par le backend pour ce terrain."
            />

            <DetailSection title="Terrain">
              <DetailItem label="Nom" value={field.nom} />
              <DetailItem label="Type" value={field.type} />
              <DetailItem
                label="Localisation"
                value={field.localisation ?? field.adresse}
              />
              <DetailItem
                label="Prix / heure"
                value={`${(field.prixHeure ?? field.prix ?? 0).toLocaleString()} FCFA`}
              />
              <DetailItem
                label="Statut"
                value={<FieldStatusBadge status={field.statut} />}
              />
              <DetailItem label="Identifiant" value={field.id} />
            </DetailSection>

            <DetailSection title="Gestionnaire associe">
              <DetailItem
                label="Nom"
                value={field.gestionnaireNom ?? "Gestionnaire non renseigne"}
              />
              <DetailItem label="Email" value={field.gestionnaireEmail} />
            </DetailSection>
          </>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
