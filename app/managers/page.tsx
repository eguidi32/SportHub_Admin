"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Eye, Search, Trash2 } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { StatusBadge } from "@/components/tables/StatusBadge";
import { TablePagination } from "@/components/tables/TablePagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  deleteManager,
  getManagers,
  validateManager,
} from "@/services/managers.service";
import type { ManagerItem } from "@/types/manager";

export default function ManagersPage() {
  const [managers, setManagers] = useState<ManagerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadManagers = async () => {
    setLoading(true);

    try {
      const data = await getManagers();
      setManagers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManagers();
  }, []);

  const filteredManagers = useMemo(() => {
    return managers.filter((manager) => {
      const fullName = `${manager.prenom ?? ""} ${manager.nom ?? ""}`.toLowerCase();
      const email = manager.email.toLowerCase();
      const query = search.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        manager.telephone?.toLowerCase().includes(query)
      );
    });
  }, [managers, search]);

  const totalPages = Math.max(1, Math.ceil(filteredManagers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedManagers = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredManagers.slice(start, start + itemsPerPage);
  }, [filteredManagers, safePage, itemsPerPage]);

  const handleValidate = async (id: number) => {
    try {
      await validateManager(id);
    } catch {
      // La liste sera rechargée depuis l'API au prochain chargement.
    }

    setManagers((current) =>
      current.map((manager) =>
        manager.id === id ? { ...manager, valide: true, actif: true } : manager
      )
    );
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer ce gestionnaire ?"
    );

    if (!confirmed) return;

    try {
      await deleteManager(id);
    } catch {
      // La liste sera rechargée depuis l'API au prochain chargement.
    }

    setManagers((current) => current.filter((manager) => manager.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestionnaires</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Validez et gérez les gestionnaires de terrains ou salles de sport.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total gestionnaires</p>
              <h3 className="mt-2 text-3xl font-bold">{managers.length}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Validés</p>
              <h3 className="mt-2 text-3xl font-bold">
                {managers.filter((manager) => manager.valide).length}
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">En attente</p>
              <h3 className="mt-2 text-3xl font-bold">
                {managers.filter((manager) => !manager.valide).length}
              </h3>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des gestionnaires</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un gestionnaire..."
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
                Chargement des gestionnaires...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[32%]">Gestionnaire</TableHead>
                      <TableHead className="hidden lg:table-cell">Téléphone</TableHead>
                      <TableHead className="hidden xl:table-cell">Terrains</TableHead>
                      <TableHead>Validation</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-28 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredManagers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucun gestionnaire trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedManagers.map((manager) => (
                        <TableRow key={manager.id}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {manager.prenom || manager.nom
                                  ? `${manager.prenom ?? ""} ${manager.nom ?? ""}`
                                  : "Nom non renseigné"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {manager.email}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="hidden lg:table-cell">
                            {manager.telephone ?? "-"}
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {manager.nombreTerrains ?? 0}
                          </TableCell>

                          <TableCell>
                            {manager.valide ? (
                              <Badge>Validé</Badge>
                            ) : (
                              <Badge variant="secondary">En attente</Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            <StatusBadge active={manager.actif} />
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/managers/${manager.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>

                              {!manager.valide && (
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleValidate(manager.id)}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDelete(manager.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
                  totalItems={filteredManagers.length}
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
