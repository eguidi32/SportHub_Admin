"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, MapPin, Search, Warehouse } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { FieldStatusBadge } from "@/components/tables/FieldStatusBadge";
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
import { getFields } from "@/services/fields.service";
import type { FieldItem, FieldStatus, FieldType } from "@/types/field";

export default function FieldsPage() {
  const [fields, setFields] = useState<FieldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | FieldType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | FieldStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadFields = async () => {
    setLoading(true);

    try {
      const data = await getFields();
      setFields(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, []);

  const filteredFields = useMemo(() => {
    return fields.filter((field) => {
      const query = search.toLowerCase();

      const matchSearch =
        field.nom.toLowerCase().includes(query) ||
        field.localisation?.toLowerCase().includes(query) ||
        field.adresse?.toLowerCase().includes(query);
      const matchType = typeFilter === "ALL" || field.type === typeFilter;

      const matchStatus =
        statusFilter === "ALL" || field.statut === statusFilter;

      return matchSearch && matchType && matchStatus;
    });
  }, [fields, search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredFields.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedFields = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredFields.slice(start, start + itemsPerPage);
  }, [filteredFields, safePage, itemsPerPage]);

  const availableCount = fields.filter(
    (field) => field.statut === "DISPONIBLE"
  ).length;

  const maintenanceCount = fields.filter(
    (field) => field.statut === "MAINTENANCE"
  ).length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Terrains</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les terrains de football, basketball et tennis disponibles sur SportHub.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total terrains</p>
                <h3 className="mt-2 text-3xl font-bold">{fields.length}</h3>
              </div>
              <Warehouse className="h-8 w-8 text-muted-foreground" />
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
              <p className="text-sm text-muted-foreground">En maintenance</p>
              <h3 className="mt-2 text-3xl font-bold">{maintenanceCount}</h3>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des terrains</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_170px_180px]">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou localisation..."
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
                value={typeFilter}
                onChange={(event) =>
                  {
                    setTypeFilter(event.target.value as "ALL" | FieldType);
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Tous les types</option>
                <option value="FOOTBALL">Football</option>
                <option value="BASKETBALL">Basketball</option>
                <option value="TENNIS">Tennis</option>
              </select>

              <select
                className="h-10 rounded-md border border-border bg-white px-3 text-sm shadow-sm"
                value={statusFilter}
                onChange={(event) =>
                  {
                    setStatusFilter(event.target.value as "ALL" | FieldStatus);
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Tous les statuts</option>
                <option value="DISPONIBLE">Disponible</option>
                <option value="INDISPONIBLE">Indisponible</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Chargement des terrains...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[24%]">Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead className="hidden xl:table-cell">
                        Prix / heure
                      </TableHead>
                      <TableHead>
                        Gestionnaire
                      </TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredFields.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucun terrain trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedFields.map((field) => (
                        <TableRow key={field.id}>
                          <TableCell className="font-medium">
                            <span className="block truncate">{field.nom}</span>
                          </TableCell>

                          <TableCell>
                            <span className="block truncate">
                              {field.type ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell>
                            <div className="flex min-w-0 items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">
                                {field.localisation ?? field.adresse ?? "-"}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {(field.prixHeure ?? field.prix ?? 0).toLocaleString()} FCFA
                          </TableCell>

                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {field.gestionnaireNom ??
                                  "Gestionnaire non renseigné"}
                              </p>
                              {field.gestionnaireEmail && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {field.gestionnaireEmail}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <FieldStatusBadge status={field.statut} />
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/fields/${field.id}`}>
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
                  totalItems={filteredFields.length}
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
