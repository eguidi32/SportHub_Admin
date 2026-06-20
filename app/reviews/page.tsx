"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, MessageSquare, Search, Star } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
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
import { getReviews } from "@/services/reviews.service";
import type { ReviewItem, ReviewTargetType } from "@/types/review";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [targetFilter, setTargetFilter] = useState<"ALL" | ReviewTargetType>(
    "ALL"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const loadReviews = async () => {
    setLoading(true);

    try {
      const data = await getReviews();
      setReviews(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    return reviews.filter((review) => {
      const query = search.toLowerCase();

      const matchSearch =
        review.auteurNom?.toLowerCase().includes(query) ||
        review.auteurEmail?.toLowerCase().includes(query) ||
        review.cibleNom?.toLowerCase().includes(query) ||
        review.commentaire?.toLowerCase().includes(query);

      const matchTarget =
        targetFilter === "ALL" || review.cibleType === targetFilter;

      return matchSearch && matchTarget;
    });
  }, [reviews, search, targetFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedReviews = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, safePage, itemsPerPage]);

  const reportedCount = reviews.filter((review) => review.signale).length;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.note, 0) /
        reviews.length
      : 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Avis / Évaluations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Consultez les évaluations laissées par les clients sur les terrains
            et les coachs.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-muted-foreground">Total avis</p>
                <h3 className="mt-2 text-3xl font-bold">{reviews.length}</h3>
              </div>
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Note moyenne</p>
              <h3 className="mt-2 flex items-center gap-2 text-3xl font-bold">
                {averageRating.toFixed(1)}
                <Star className="h-6 w-6" />
              </h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Avis signalés</p>
              <h3 className="mt-2 text-3xl font-bold">{reportedCount}</h3>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Source backend
              </p>
              <h3 className="mt-2 text-lg font-bold">Par terrain / coach</h3>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4 text-sm text-muted-foreground">
            Cette page utilise les endpoints existants du backend :
            évaluations par terrain et évaluations par coach. Seuls les retours
            API disponibles sont affichés.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des avis</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher auteur, cible, commentaire..."
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
                value={targetFilter}
                onChange={(event) =>
                  {
                    setTargetFilter(event.target.value as "ALL" | ReviewTargetType);
                    setCurrentPage(1);
                  }
                }
              >
                <option value="ALL">Toutes les cibles</option>
                <option value="TERRAIN">Terrains</option>
                <option value="COACH">Coachs</option>
              </select>
            </div>

            {loading ? (
              <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                Chargement des avis...
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[24%]">Auteur</TableHead>
                      <TableHead>Cible</TableHead>
                      <TableHead className="hidden xl:table-cell">Type</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Signalement</TableHead>
                      <TableHead className="hidden xl:table-cell">Date</TableHead>
                      <TableHead className="w-20 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredReviews.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="h-32 text-center text-sm text-muted-foreground"
                        >
                          Aucun avis trouvé.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedReviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="truncate font-medium">
                                {review.auteurNom ?? "Auteur non renseigné"}
                              </p>
                              {review.auteurEmail && (
                                <p className="truncate text-xs text-muted-foreground">
                                  {review.auteurEmail}
                                </p>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="font-medium">
                            <span className="block truncate">
                              {review.cibleNom ?? "-"}
                            </span>
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            <Badge variant="outline">
                              {review.cibleType === "TERRAIN"
                                ? "Terrain"
                                : "Coach"}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span>{review.note}/5</span>
                            </div>
                          </TableCell>

                          <TableCell>
                            <p className="truncate">
                              {review.commentaire ?? "-"}
                            </p>
                          </TableCell>

                          <TableCell className="hidden xl:table-cell">
                            {review.signale ? (
                              <Badge variant="destructive">Signalé</Badge>
                            ) : (
                              <Badge variant="secondary">Normal</Badge>
                            )}
                          </TableCell>

                          <TableCell>
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </TableCell>

                          <TableCell>
                            <div className="flex justify-end">
                              <Button asChild size="icon" variant="ghost">
                                <Link href={`/reviews/${review.id}`}>
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
                  totalItems={filteredReviews.length}
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
