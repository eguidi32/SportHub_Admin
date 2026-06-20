"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { DetailItem, DetailSection, DetailShell } from "@/components/details/DetailShell";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { RoleBadge } from "@/components/tables/RoleBadge";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { getUserById } from "@/services/users.service";
import type { AdminUserItem } from "@/types/user";

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<AdminUserItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getUserById(id)
      .then(setUser)
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <AdminLayout>
      <DetailShell
        title="Detail utilisateur"
        subtitle="Informations du compte selectionne."
        backHref="/users"
        backLabel="Retour aux utilisateurs"
      >
        {loading ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Chargement de l&apos;utilisateur...
          </div>
        ) : !user ? (
          <div className="rounded-md border bg-white p-8 text-sm text-muted-foreground">
            Utilisateur introuvable.
          </div>
        ) : (
          <DetailSection title="Compte">
            <DetailItem
              label="Nom complet"
              value={
                user.prenom || user.nom
                  ? `${user.prenom ?? ""} ${user.nom ?? ""}`.trim()
                  : "Nom non renseigne"
              }
            />
            <DetailItem label="Email" value={user.email} />
            <DetailItem label="Role" value={<RoleBadge role={user.role} />} />
            <DetailItem label="Statut" value={<StatusBadge active={user.actif} />} />
            <DetailItem
              label="Date"
              value={
                user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                  : "-"
              }
            />
            <DetailItem label="Identifiant" value={user.id} />
          </DetailSection>
        )}
      </DetailShell>
    </AdminLayout>
  );
}
