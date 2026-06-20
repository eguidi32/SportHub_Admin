export type FieldType = "FOOTBALL" | "BASKETBALL" | "TENNIS";

export type FieldStatus = "DISPONIBLE" | "INDISPONIBLE" | "MAINTENANCE";

export type FieldItem = {
  id: number;
  nom: string;
  type?: FieldType;
  localisation?: string;
  adresse?: string;
  prixHeure?: number;
  prix?: number;
  imageUrl?: string;
  statut?: FieldStatus;
  gestionnaireNom?: string;
  gestionnaireEmail?: string;
  createdAt?: string;
};