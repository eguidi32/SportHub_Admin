"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Trash2, UserCheck, UserX } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { RoleBadge } from "@/components/tables/RoleBadge";
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
import {
  activateUser,
  deactivateUser,
  deleteUser,
  getUsers,
} from "@/services/users.service";
import type { AdminUserItem, UserRole } from "@/types/user";

type StatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | UserRole>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadUsers = async () => {
    setLoading(true);

    try {
      const data = await getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.prenom ?? ""} ${user.nom ?? ""}`.toLowerCase();
      const email = user.email.toLowerCase();
      const query = search.toLowerCase();

      const matchSearch = fullName.includes(query) || email.includes(query);
      const matchRole = roleFilter === "ALL" || user.role === roleFilter;
      const matchStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && user.actif) ||
        (statusFilter === "INACTIVE" && !user.actif);

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedUsers = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, safePage, itemsPerPage]);

  const handleActivate = async (id: number) => {
    try {
      await activateUser(id);
    } catch {
      // La liste sera rechargée depuis l'API au prochain chargement.
    }

    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, actif: true } : user))
    );
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivateUser(id);
    } catch {
      // La liste sera rechargée depuis l'API au prochain chargement.
    }

    setUsers((current) =>
      current.map((user) => (user.id === id ? { ...user, actif: false } : user))
    );
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmed) return;

    try {
      await deleteUser(id);
    } catch {
      // La liste sera rechargée depuis l'API au prochain chargement.
    }

    setUsers((current) => current.filter((user) => user.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les comptes clients, coachs, gestionnaires et administrateurs.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des utilisateurs</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_170px_150px]">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
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
                value={roleFilter}
                onChange={(event) =>
                  {
                    setRoleFilter(event.target.value as "ALL" | UserRole);
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Tous les rôles</option>
                <option value="ADMIN">Admin</option>
                <option value="CLIENT">Client</option>
                <option value="COACH">Coach</option>
                <option value="GESTIONNAIRE">Gestionnaire</option>
              </select>

              <select
                className="h-10 rounded-md border border-border bg-white px-3 text-sm shadow-sm"
                value={statusFilter}
                onChange={(event) =>
                  {
                    setStatusFilter(event.target.value as StatusFilter);
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Tous les statuts</option>
                <option value="ACTIVE">Actif</option>
                <option value="INACTIVE">Inactif</option>
              </select>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Chargement des utilisateurs...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[32%]">Utilisateur</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden xl:table-cell">Date</TableHead>
                      <TableHead className="w-28 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucun utilisateur trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {user.prenom || user.nom
                                  ? `${user.prenom ?? ""} ${user.nom ?? ""}`
                                  : "Nom non renseigné"}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <RoleBadge role={user.role} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge active={user.actif} />
                          </TableCell>
                          <TableCell className="hidden xl:table-cell">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/users/${user.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>

                              {user.actif ? (
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleDeactivate(user.id)}
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleActivate(user.id)}
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                size="icon"
                                variant="destructive"
                                onClick={() => handleDelete(user.id)}
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
                  totalItems={filteredUsers.length}
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
