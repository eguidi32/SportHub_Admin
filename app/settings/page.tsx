"use client";

import {
  Bell,
  CreditCard,
  Info,
  Lock,
  Settings,
  ShieldCheck,
} from "lucide-react";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les informations de référence de la plateforme SportHub.
            Aucune configuration backend n’est modifiée depuis cette page.
          </p>
        </div>

        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            Cette page est en lecture seule. Elle documente l’état fonctionnel
            attendu et les points techniques à traiter côté backend.
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Info className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Informations plateforme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-medium">SportHub</span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">
                  Plateforme de réservation sportive
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Sports gérés</span>
                <span className="font-medium">Football, Basketball, Tennis</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Nature</span>
                <Badge variant="outline">Référence</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Rôles et accès</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Administrateur</span>
                <Badge variant="outline">Supervision plateforme</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Gestionnaire</span>
                <Badge variant="outline">Gestion des terrains</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Coach</span>
                <Badge variant="outline">Gestion séances</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Client</span>
                <Badge variant="outline">Réservation</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Paiements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Wave</span>
                <Badge variant="outline">Canal référencé</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Orange Money</span>
                <Badge variant="outline">Canal référencé</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Espèce</span>
                <Badge variant="outline">Canal référencé</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Validation automatique
                </span>
                <Badge variant="secondary">Dépend du backend</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Authentification</span>
                <Badge>JWT</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Routes admin</span>
                <Badge>Protégées</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Rôle requis</span>
                <Badge variant="outline">ADMIN</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">CORS</span>
                <Badge variant="secondary">À vérifier backend</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  Notification réservation
                </span>
                <Badge variant="secondary">Non exposé backend</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  Notification paiement
                </span>
                <Badge variant="secondary">Non exposé backend</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Notification validation gestionnaire
                </span>
                <Badge variant="secondary">Non exposé backend</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <CardTitle>État technique</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Backend</span>
                <Badge variant="outline">Spring Boot</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">WebAdmin</span>
                <Badge variant="outline">Next.js</Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-muted-foreground">Mobile</span>
                <Badge variant="outline">Flutter</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Base de données</span>
                <Badge variant="outline">PostgreSQL</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
