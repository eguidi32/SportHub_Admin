"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailItem, DetailSection, DetailShell } from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { CoachSessionStatusBadge } from "@/components/tables/CoachSessionStatusBadge";
import { getCoachSessionById } from "@/services/coach-sessions.service";
import type { CoachSessionItem } from "@/types/coach-session";

export default function CoachSessionDetailPage() {
  const params = useParams<{ id: string }>();
  const [session, setSession] = useState<CoachSessionItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getCoachSessionById(id)
      .then(setSession)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail seance coach"
        subtitle="Demande de seance selectionnee depuis la supervision admin."
        backHref="/coach-sessions"
        backLabel="Retour aux seances"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement de la seance...
          </div>
        ) : !session ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Seance introuvable ou endpoint admin non disponible.
          </div>
        ) : (
          <>
            <DetailSection title="Seance">
              <DetailItem
                label="Statut"
                value={<CoachSessionStatusBadge status={session.statut} />}
              />
              <DetailItem label="Specialite" value={session.specialite} />
              <DetailItem
                label="Date"
                value={
                  session.dateSeance
                    ? new Date(session.dateSeance).toLocaleDateString("fr-FR")
                    : "-"
                }
              />
              <DetailItem
                label="Horaire"
                value={
                  session.heureDebut && session.heureFin
                    ? `${session.heureDebut} - ${session.heureFin}`
                    : "-"
                }
              />
              <DetailItem
                label="Montant"
                value={`${(session.montant ?? 0).toLocaleString()} FCFA`}
              />
            </DetailSection>

            <DetailSection title="Participants">
              <DetailItem label="Client" value={session.clientNom} />
              <DetailItem label="Email client" value={session.clientEmail} />
              <DetailItem label="Coach" value={session.coachNom} />
              <DetailItem label="Email coach" value={session.coachEmail} />
            </DetailSection>
          </>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
