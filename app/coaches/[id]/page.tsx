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
import { StatusBadge } from "@/components/tables/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { getCoachById } from "@/services/coaches.service";
import type { CoachItem } from "@/types/coach";

export default function CoachDetailPage() {
  const params = useParams<{ id: string }>();
  const [coach, setCoach] = useState<CoachItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getCoachById(id)
      .then(setCoach)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail coach"
        subtitle="Profil du coach et informations de supervision."
        backHref="/coaches"
        backLabel="Retour aux coachs"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement du coach...
          </div>
        ) : !coach ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Coach introuvable.
          </div>
        ) : (
          <>
            <DetailPhoto
              title="Photo de profil"
              imageUrl={coach.imageUrl}
              emptyText="Aucune photo de profil n'est fournie par le backend pour ce coach."
            />

            <DetailSection title="Coach">
              <DetailItem
                label="Nom complet"
                value={
                  coach.prenom || coach.nom
                    ? `${coach.prenom ?? ""} ${coach.nom ?? ""}`.trim()
                    : "Nom non renseigne"
                }
              />
              <DetailItem label="Email" value={coach.email} />
              <DetailItem label="Telephone" value={coach.telephone} />
              <DetailItem label="Specialite" value={coach.specialite} />
              <DetailItem
                label="Tarif"
                value={`${(coach.tarifSeance ?? 0).toLocaleString()} FCFA`}
              />
              <DetailItem label="Experience" value={coach.experience} />
              <DetailItem label="Note moyenne" value={coach.noteMoyenne ?? "-"} />
              <DetailItem
                label="Disponibilite"
                value={
                  coach.disponible ? (
                    <Badge>Disponible</Badge>
                  ) : (
                    <Badge variant="secondary">Indisponible</Badge>
                  )
                }
              />
              <DetailItem label="Statut" value={<StatusBadge active={coach.actif} />} />
            </DetailSection>
          </>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
