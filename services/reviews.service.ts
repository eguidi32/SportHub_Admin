import { api } from "@/lib/api";
import {
  compact,
  toArrayPayload,
  toBoolean,
  toNumber,
  toStringValue,
} from "@/services/api-normalizers";
import type { ReviewItem } from "@/types/review";

type BackendReview = Record<string, unknown>;
type BackendTarget = Record<string, unknown>;

const mapBackendReview = (
  review: BackendReview,
  cibleType: ReviewItem["cibleType"]
): ReviewItem | null => {
  const id = toNumber(review.id);
  const note = toNumber(review.note);

  if (!id) return null;

  return {
    id,
    auteurNom:
      toStringValue(review.auteurNom) ?? toStringValue(review.nomClient),
    auteurEmail: toStringValue(review.auteurEmail),
    cibleNom:
      toStringValue(review.cibleNom) ??
      (cibleType === "COACH"
        ? toStringValue(review.nomCoach)
        : toStringValue(review.nomTerrain)),
    cibleType,
    note: note ?? 0,
    commentaire: toStringValue(review.commentaire),
    signale: toBoolean(review.signale),
    createdAt: toStringValue(review.createdAt),
  };
};

const getTargetIds = async (url: string): Promise<number[]> => {
  const response = await api.get<unknown>(url, {
    params: { page: 0, size: 200 },
  });

  return compact(
    toArrayPayload<BackendTarget>(response.data).map((target) =>
      toNumber(target.id)
    )
  );
};

const getTargetReviews = async (
  url: string,
  cibleType: ReviewItem["cibleType"]
): Promise<ReviewItem[]> => {
  try {
    const response = await api.get<unknown>(url);

    return compact(
      toArrayPayload<BackendReview>(response.data).map((review) =>
        mapBackendReview(review, cibleType)
      )
    );
  } catch {
    return [];
  }
};

export const getReviews = async (): Promise<ReviewItem[]> => {
  try {
    const [terrainIds, coachIds] = await Promise.all([
      getTargetIds("/api/terrains"),
      getTargetIds("/api/coachs"),
    ]);

    const reviewResponses = await Promise.all([
      ...terrainIds.map((id) =>
        getTargetReviews(`/api/evaluations/terrain/${id}`, "TERRAIN")
      ),
      ...coachIds.map((id) =>
        getTargetReviews(`/api/evaluations/coach/${id}`, "COACH")
      ),
    ]);

    const reviewsByKey = new Map<string, ReviewItem>();

    reviewResponses.flat().forEach((review) => {
      reviewsByKey.set(`${review.cibleType}-${review.id}`, review);
    });

    return Array.from(reviewsByKey.values());
  } catch {
    return [];
  }
};

export const getReviewById = async (
  id: number
): Promise<ReviewItem | null> => {
  const reviews = await getReviews();
  return reviews.find((review) => review.id === id) ?? null;
};
