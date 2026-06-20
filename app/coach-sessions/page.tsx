"use client";

import { useEffect, useMemo, useState } from "react";
import { Dumbbell, Eye, Search } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { CoachSessionStatusBadge } from "@/components/tables/CoachSessionStatusBadge";
import { TablePagination } from "@/components/tables/TablePagination";
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
import { getCoachSessions } from "@/services/coach-sessions.service";
import type {
  CoachSessionItem,
  CoachSessionStatus,
} from "@/types/coach-session";

export default function CoachSessionsPage() {
  const [sessions, setSessions] = useState<CoachSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | CoachSessionStatus
  >("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadSessions = async () => {
    setLoading(true);

    try {
      const data = await getCoachSessions();
      setSessions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const query = search.toLowerCase();

      const matchSearch =
        session.clientNom?.toLowerCase().includes(query) ||
        session.clientEmail?.toLowerCase().includes(query) ||
        session.coachNom?.toLowerCase().includes(query) ||
        session.coachEmail?.toLowerCase().includes(query) ||
        session.specialite?.toLowerCase().includes(query);

      const matchStatus =
        statusFilter === "ALL" || session.statut === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [sessions, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSessions = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredSessions.slice(start, start + itemsPerPage);
  }, [filteredSessions, safePage, itemsPerPage]);

  const pendingCount = sessions.filter(
    (session) => session.statut === "EN_ATTENTE"
  ).length;

  const confirmedCount = sessions.filter(
    (session) => session.statut === "CONFIRMEE"
  ).length;

  const totalAmount = sessions.reduce(
    (total, session) => total + (session.montant ?? 0),
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Supervision des séances coach
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les demandes de séances entre les clients et les coachs.
            Les décisions d’acceptation ou de refus sont gérées par les coachs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total séances</p>
                <h3 className="mt-2 text-3xl font-bold">{sessions.length}</h3>
              </div>
              <Dumbbell className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">En attente</p>
              <h3 className="mt-2 text-3xl font-bold">{pendingCount}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Confirmées</p>
              <h3 className="mt-2 text-3xl font-bold">{confirmedCount}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Montant total</p>
              <h3 className="mt-2 text-2xl font-bold">
                {totalAmount.toLocaleString()} FCFA
              </h3>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            L’administrateur supervise les séances coach. La validation ou le
            refus d’une séance est réservé au coach concerné.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des séances coach</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher client, coach, spécialité..."
                  className="pl-9"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <select
                className="h-10 rounded-md border border-border bg-white px-3 text-sm shadow-sm"
                value={statusFilter}
                onChange={(event) =>
                  {
                    setStatusFilter(
                      event.target.value as "ALL" | CoachSessionStatus
                    );
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Tous les statuts</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="CONFIRMEE">Confirmée</option>
                <option value="REFUSEE">Refusée</option>
                <option value="ANNULEE">Annulée</option>
                <option value="TERMINEE">Terminée</option>
              </select>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Chargement des séances coach...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[24%]">Client</TableHead>
                      <TableHead className="w-[24%]">Coach</TableHead>
                      <TableHead className="hidden xl:table-cell">
                        Spécialité
                      </TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Horaire</TableHead>
                      <TableHead className="hidden xl:table-cell">Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredSessions.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucune séance coach trouvée.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedSessions.map((session) => (
                        <TableRow key={session.id}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {session.clientNom ?? "Client non renseigné"}
                              </p>
                              {session.clientEmail && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {session.clientEmail}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {session.coachNom ?? "Coach non renseigné"}
                              </p>
                              {session.coachEmail && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {session.coachEmail}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            <span className="block truncate">
                              {session.specialite ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            {session.dateSeance
                              ? new Date(session.dateSeance).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            {session.heureDebut && session.heureFin
                              ? `${session.heureDebut} - ${session.heureFin}`
                              : "-"}
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {(session.montant ?? 0).toLocaleString()} FCFA
                          </TableCell>

                          <TableCell>
                            <CoachSessionStatusBadge status={session.statut} />
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/coach-sessions/${session.id}`}>
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
                  totalItems={filteredSessions.length}
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
