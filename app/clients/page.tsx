"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Users } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/tables/StatusBadge";
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
import { getClients } from "@/services/clients.service";
import type { ClientItem } from "@/types/client";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadClients = async () => {
    setLoading(true);

    try {
      const data = await getClients();
      setClients(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const query = search.toLowerCase();
      const fullName = `${client.prenom ?? ""} ${client.nom ?? ""}`.toLowerCase();

      return (
        fullName.includes(query) ||
        client.email.toLowerCase().includes(query) ||
        client.telephone?.toLowerCase().includes(query)
      );
    });
  }, [clients, search]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedClients = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, safePage, itemsPerPage]);

  const activeCount = clients.filter((client) => client.actif).length;

  const totalReservations = clients.reduce(
    (total, client) => total + (client.nombreReservations ?? 0),
    0
  );

  const totalSpent = clients.reduce(
    (total, client) => total + (client.montantDepense ?? 0),
    0
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les clients inscrits et leur activité sur SportHub.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total clients</p>
                <h3 className="mt-2 text-3xl font-bold">{clients.length}</h3>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Clients actifs</p>
              <h3 className="mt-2 text-3xl font-bold">{activeCount}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Réservations</p>
              <h3 className="mt-2 text-3xl font-bold">{totalReservations}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Dépenses totales</p>
              <h3 className="mt-2 text-2xl font-bold">
                {totalSpent.toLocaleString()} FCFA
              </h3>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des clients</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
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
                Chargement des clients...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[32%]">Client</TableHead>
                      <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                      <TableHead>Réservations</TableHead>
                      <TableHead className="hidden xl:table-cell">Dépenses</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucun client trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedClients.map((client) => (
                        <TableRow key={client.id}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {client.prenom || client.nom
                                  ? `${client.prenom ?? ""} ${client.nom ?? ""}`
                                  : "Nom non renseigné"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {client.email}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            {client.telephone ?? "-"}
                          </TableCell>

                          <TableCell>{client.nombreReservations ?? 0}</TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {(client.montantDepense ?? 0).toLocaleString()} FCFA
                          </TableCell>

                          <TableCell>
                            <StatusBadge active={client.actif} />
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/clients/${client.id}`}>
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
                  totalItems={filteredClients.length}
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
