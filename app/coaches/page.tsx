"use client";

import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Eye, Search, Star } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { TablePagination } from "@/components/tables/TablePagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCoaches } from "@/services/coaches.service";
import type { CoachItem } from "@/types/coach";

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<CoachItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadCoaches = async () => {
    setLoading(true);

    try {
      const data = await getCoaches();
      setCoaches(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoaches();
  }, []);

  const filteredCoaches = useMemo(() => {
    return coaches.filter((coach) => {
      const query = search.toLowerCase();
      const fullName = `${coach.prenom ?? ""} ${coach.nom ?? ""}`.toLowerCase();

      return (
        fullName.includes(query) ||
        coach.email.toLowerCase().includes(query) ||
        coach.telephone?.toLowerCase().includes(query) ||
        coach.specialite?.toLowerCase().includes(query)
      );
    });
  }, [coaches, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCoaches.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedCoaches = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredCoaches.slice(start, start + itemsPerPage);
  }, [filteredCoaches, safePage, itemsPerPage]);

  const activeCount = coaches.filter((coach) => coach.actif).length;
  const availableCount = coaches.filter((coach) => coach.disponible).length;

  const totalSessions = coaches.reduce(
    (total, coach) => total + (coach.nombreSeances ?? 0),
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coachs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les coachs sportifs inscrits et leurs activités.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total coachs</p>
                <h3 className="mt-2 text-3xl font-bold">{coaches.length}</h3>
              </div>
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Coachs actifs</p>
              <h3 className="mt-2 text-3xl font-bold">{activeCount}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Disponibles</p>
              <h3 className="mt-2 text-3xl font-bold">{availableCount}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Séances réalisées</p>
              <h3 className="mt-2 text-3xl font-bold">{totalSessions}</h3>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des coachs</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un coach..."
                className="pl-9"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Chargement des coachs...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[28%]">Coach</TableHead>
                      <TableHead className="hidden xl:table-cell">Téléphone</TableHead>
                      <TableHead>Spécialité</TableHead>
                      <TableHead>Tarif</TableHead>
                      <TableHead className="hidden 2xl:table-cell">Séances</TableHead>
                      <TableHead className="hidden xl:table-cell">Note</TableHead>
                      <TableHead className="hidden xl:table-cell">
                        Disponibilité
                      </TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredCoaches.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucun coach trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedCoaches.map((coach) => (
                        <TableRow key={coach.id}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {coach.prenom || coach.nom
                                  ? `${coach.prenom ?? ""} ${coach.nom ?? ""}`
                                  : "Nom non renseigné"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {coach.email}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {coach.telephone ?? "-"}
                          </TableCell>

                          <TableCell>
                            <span className="block truncate">
                              {coach.specialite ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            {(coach.tarifSeance ?? 0).toLocaleString()} FCFA
                          </TableCell>

                          <TableCell className="hidden 2xl:table-cell">
                            {coach.nombreSeances ?? 0}
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span>{coach.noteMoyenne ?? "-"}</span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {coach.disponible ? (
                              <Badge>Disponible</Badge>
                            ) : (
                              <Badge variant="secondary">Indisponible</Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            <StatusBadge active={coach.actif} />
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/coaches/${coach.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
                <TablePagination
                  currentPage={safePage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredCoaches.length}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(value) => {
                    setItemsPerPage(value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
