"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  CreditCard,
  Dumbbell,
  ShieldCheck,
  Users,
  Warehouse,
} from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { getDashboardStats } from "@/services/dashboard.service";
import type { DashboardStats } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Chargement du dashboard...
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Vue globale de la plateforme SportHub.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Utilisateurs"
            value={stats?.totalUsers ?? 0}
            description="Tous les comptes"
            icon={Users}
          />

          <StatCard
            title="Clients"
            value={stats?.totalClients ?? 0}
            description="Utilisateurs clients"
            icon={Users}
          />

          <StatCard
            title="Coachs"
            value={stats?.totalCoachs ?? 0}
            description="Coachs sportifs"
            icon={Dumbbell}
          />

          <StatCard
            title="Gestionnaires"
            value={stats?.totalGestionnaires ?? 0}
            description="Gestionnaires de terrains"
            icon={ShieldCheck}
          />

          <StatCard
            title="Terrains"
            value={stats?.totalTerrains ?? 0}
            description="Espaces disponibles"
            icon={Warehouse}
          />

          <StatCard
            title="Réservations"
            value={stats?.totalReservations ?? 0}
            description="Réservations terrain"
            icon={CalendarCheck}
          />

          <StatCard
            title="Séances coach"
            value={stats?.totalSeances ?? 0}
            description="Demandes de séances"
            icon={Dumbbell}
          />

          <StatCard
            title="Revenus"
            value={`${(stats?.revenus ?? 0).toLocaleString()} FCFA`}
            description="Estimation globale"
            icon={CreditCard}
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <div className="rounded-lg border p-4">
                  Nouvelle réservation terrain en attente.
                </div>
                <div className="rounded-lg border p-4">
                  Un gestionnaire attend une validation.
                </div>
                <div className="rounded-lg border p-4">
                  Paiement PayDunya reçu pour une réservation.
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes techniques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Ce dashboard utilise la route{" "}
                <span className="font-medium text-foreground">
                  /api/admin/dashboard
                </span>{" "}
                si le backend est disponible.
              </p>
              <p>
                Les valeurs affichées proviennent de l’API admin. Si le backend
                ne répond pas, les compteurs restent à zéro.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
