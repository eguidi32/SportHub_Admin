export type ReviewTargetType = "TERRAIN" | "COACH";

export type ReviewItem = {
  id: number;
  auteurNom?: string;
  auteurEmail?: string;
  cibleNom?: string;
  cibleType: ReviewTargetType;
  note: number;
  commentaire?: string;
  signale?: boolean;
  createdAt?: string;
};
