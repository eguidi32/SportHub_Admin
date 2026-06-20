"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, Eye, Search } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { BookingStatusBadge } from "@/components/tables/BookingStatusBadge";
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
import { getBookings } from "@/services/bookings.service";
import type { BookingItem, BookingStatus } from "@/types/booking";

type SportFilter = "ALL" | "FOOTBALL" | "BASKETBALL" | "TENNIS";
type DateFilter = "ALL" | "TODAY" | "WEEK" | "MONTH";

function isInDateRange(dateValue: string | undefined, filter: DateFilter) {
  if (filter === "ALL") return true;
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startTarget = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (filter === "TODAY") {
    return startTarget.getTime() === startToday.getTime();
  }

  if (filter === "WEEK") {
    const day = startToday.getDay() || 7;
    const startWeek = new Date(startToday);
    startWeek.setDate(startToday.getDate() - day + 1);
    const endWeek = new Date(startWeek);
    endWeek.setDate(startWeek.getDate() + 7);

    return startTarget >= startWeek && startTarget < endWeek;
  }

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | BookingStatus>("ALL");
  const [sportFilter, setSportFilter] = useState<SportFilter>("ALL");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadBookings = async () => {
    setLoading(true);

    try {
      const data = await getBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.toLowerCase();

      const matchSearch =
        booking.clientNom?.toLowerCase().includes(query) ||
        booking.clientEmail?.toLowerCase().includes(query) ||
        booking.terrainNom?.toLowerCase().includes(query) ||
        booking.typeTerrain?.toLowerCase().includes(query) ||
        booking.gestionnaireNom?.toLowerCase().includes(query) ||
        booking.gestionnaireEmail?.toLowerCase().includes(query);

      const matchStatus =
        statusFilter === "ALL" || booking.statut === statusFilter;
      const matchSport =
        sportFilter === "ALL" || booking.typeTerrain === sportFilter;
      const matchDate = isInDateRange(booking.dateReservation, dateFilter);

      return matchSearch && matchStatus && matchSport && matchDate;
    });
  }, [bookings, search, statusFilter, sportFilter, dateFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBookings = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, safePage, itemsPerPage]);

  const pendingCount = bookings.filter(
    (booking) => booking.statut === "EN_ATTENTE"
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.statut === "CONFIRMEE"
  ).length;

  const totalAmount = bookings.reduce(
    (total, booking) => total + (booking.montant ?? 0),
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Supervision des réservations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez l’ensemble des réservations effectuées sur les terrains.
            Les décisions d’acceptation ou de refus sont gérées par les
            gestionnaires de terrain.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total réservations
                </p>
                <h3 className="mt-2 text-3xl font-bold">{bookings.length}</h3>
              </div>
              <CalendarCheck className="h-8 w-8 text-muted-foreground" />
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
            L’administrateur supervise les réservations. La validation ou le
            refus d’une réservation est réservé au gestionnaire propriétaire du
            terrain.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des réservations</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_170px_160px]">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher client, terrain, gestionnaire..."
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
                    setStatusFilter(event.target.value as "ALL" | BookingStatus);
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

              <select
                className="h-10 rounded-md border border-border bg-white px-3 text-sm shadow-sm"
                value={sportFilter}
                onChange={(event) =>
                  {
                    setSportFilter(event.target.value as SportFilter);
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Tous les sports</option>
                <option value="FOOTBALL">Football</option>
                <option value="BASKETBALL">Basketball</option>
                <option value="TENNIS">Tennis</option>
              </select>

              <select
                className="h-10 rounded-md border border-border bg-white px-3 text-sm shadow-sm"
                value={dateFilter}
                onChange={(event) =>
                  {
                    setDateFilter(event.target.value as DateFilter);
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Toutes les dates</option>
                <option value="TODAY">Aujourd&apos;hui</option>
                <option value="WEEK">Cette semaine</option>
                <option value="MONTH">Ce mois</option>
              </select>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Chargement des réservations...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[20%]">Client</TableHead>
                      <TableHead>Terrain</TableHead>
                      <TableHead className="w-[20%]">Gestionnaire</TableHead>
                      <TableHead className="hidden xl:table-cell">Sport</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="hidden lg:table-cell">Horaire</TableHead>
                      <TableHead className="hidden xl:table-cell">Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredBookings.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={9}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucune réservation trouvée.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {booking.clientNom ?? "Client non renseigné"}
                              </p>
                              {booking.clientEmail && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {booking.clientEmail}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="font-medium">
                            <span className="block truncate">
                              {booking.terrainNom ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {booking.gestionnaireNom ?? "Non renseigné"}
                              </p>
                              {booking.gestionnaireEmail && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {booking.gestionnaireEmail}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            <span className="block truncate">
                              {booking.typeTerrain ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            {booking.dateReservation
                              ? new Date(
                                  booking.dateReservation
                                ).toLocaleDateString("fr-FR")
                              : "-"}
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            {booking.heureDebut && booking.heureFin
                              ? `${booking.heureDebut} - ${booking.heureFin}`
                              : "-"}
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {(booking.montant ?? 0).toLocaleString()} FCFA
                          </TableCell>

                          <TableCell>
                            <BookingStatusBadge status={booking.statut} />
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/bookings/${booking.id}`}>
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
                  totalItems={filteredBookings.length}
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
