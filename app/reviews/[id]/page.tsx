"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";

import { DetailItem, DetailSection, DetailShell } from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { getReviewById } from "@/services/reviews.service";
import type { ReviewItem } from "@/types/review";

export default function ReviewDetailPage() {
  const params = useParams<{ id: string }>();
  const [review, setReview] = useState<ReviewItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getReviewById(id)
      .then(setReview)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail avis"
        subtitle="Evaluation selectionnee depuis la supervision admin."
        backHref="/reviews"
        backLabel="Retour aux avis"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement de l&apos;avis...
          </div>
        ) : !review ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Avis introuvable.
          </div>
        ) : (
          <>
            <DetailSection title="Avis">
              <DetailItem
                label="Note"
                value={
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    {review.note}/5
                  </span>
                }
              />
              <DetailItem
                label="Signalement"
                value={
                  review.signale ? (
                    <Badge variant="destructive">Signale</Badge>
                  ) : (
                    <Badge variant="secondary">Normal</Badge>
                  )
                }
              />
              <DetailItem
                label="Date"
                value={
                  review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("fr-FR")
                    : "-"
                }
              />
              <DetailItem label="Commentaire" value={review.commentaire} />
            </DetailSection>

            <DetailSection title="Relations">
              <DetailItem label="Auteur" value={review.auteurNom} />
              <DetailItem label="Email auteur" value={review.auteurEmail} />
              <DetailItem label="Cible" value={review.cibleNom} />
              <DetailItem
                label="Type cible"
                value={review.cibleType === "TERRAIN" ? "Terrain" : "Coach"}
              />
            </DetailSection>
          </>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
