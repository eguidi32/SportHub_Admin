"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Eye, Search } from "lucide-react";
import Link from "next/link";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { PaymentStatusBadge } from "@/components/tables/PaymentStatusBadge";
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
import { getPayments } from "@/services/payments.service";
import type { PaymentItem, PaymentMethod, PaymentStatus } from "@/types/payment";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<PaymentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"ALL" | PaymentStatus>("ALL");
    const [methodFilter, setMethodFilter] = useState<"ALL" | PaymentMethod>("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const loadPayments = async () => {
        setLoading(true);

        try {
            const data = await getPayments();
            setPayments(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPayments();
    }, []);

    const filteredPayments = useMemo(() => {
        return payments.filter((payment) => {
            const query = search.toLowerCase();

            const matchSearch =
                payment.transactionId?.toLowerCase().includes(query) ||
                payment.clientNom?.toLowerCase().includes(query) ||
                payment.clientEmail?.toLowerCase().includes(query) ||
                payment.terrainNom?.toLowerCase().includes(query) ||
                payment.gestionnaireNom?.toLowerCase().includes(query);

            const matchStatus =
                statusFilter === "ALL" || payment.statut === statusFilter;
            const matchMethod =
                methodFilter === "ALL" || payment.methode === methodFilter;

            return matchSearch && matchStatus && matchMethod;
        });
    }, [payments, search, statusFilter, methodFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredPayments.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedPayments = useMemo(() => {
        const start = (safePage - 1) * itemsPerPage;
        return filteredPayments.slice(start, start + itemsPerPage);
    }, [filteredPayments, safePage, itemsPerPage]);

    const paidAmount = payments
        .filter((payment) => payment.statut === "PAYE")
        .reduce((total, payment) => total + payment.montant, 0);

    const pendingAmount = payments
        .filter((payment) => payment.statut === "EN_ATTENTE")
        .reduce((total, payment) => total + payment.montant, 0);

    const failedCount = payments.filter(
        (payment) => payment.statut === "ECHOUE"
    ).length;

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Supervision des paiements
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Consultez les transactions liées aux réservations des terrains.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Transactions</p>
                                <h3 className="mt-2 text-3xl font-bold">{payments.length}</h3>
                            </div>
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">Montant payé</p>
                            <h3 className="mt-2 text-2xl font-bold">
                                {paidAmount.toLocaleString()} FCFA
                            </h3>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">En attente</p>
                            <h3 className="mt-2 text-2xl font-bold">
                                {pendingAmount.toLocaleString()} FCFA
                            </h3>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <p className="text-sm text-muted-foreground">Échecs</p>
                            <h3 className="mt-2 text-3xl font-bold">{failedCount}</h3>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="p-4 text-sm text-muted-foreground">
                        L’administrateur supervise les paiements. Les méthodes prises en charge sont
                        Wave, Orange Money et le paiement en espèce. La validation automatique dépendra
                        de l’intégration de paiement côté backend.
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Liste des paiements</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,1fr)_180px_180px]">
                            <div className="relative w-full md:max-w-sm">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Rechercher client, terrain, transaction..."
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
                                onChange={(event) => {
                                    setStatusFilter(event.target.value as "ALL" | PaymentStatus);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="ALL">Tous les statuts</option>
                                <option value="EN_ATTENTE">En attente</option>
                                <option value="PAYE">Payé</option>
                                <option value="ECHOUE">Échoué</option>
                                <option value="ANNULE">Annulé</option>
                                <option value="REMBOURSE">Remboursé</option>
                            </select>

                            <select
                                className="h-10 rounded-md border border-border bg-white px-3 text-sm shadow-sm"
                                value={methodFilter}
                                onChange={(event) => {
                                    setMethodFilter(event.target.value as "ALL" | PaymentMethod);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="ALL">Toutes les méthodes</option>
                                <option value="WAVE">Wave</option>
                                <option value="ORANGE_MONEY">Orange Money</option>
                                <option value="ESPECE">Espèce</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                                Chargement des paiements...
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="hidden xl:table-cell">
                                                Transaction
                                            </TableHead>
                                            <TableHead className="w-[26%]">Client</TableHead>
                                            <TableHead className="hidden 2xl:table-cell">
                                                Terrain
                                            </TableHead>
                                            <TableHead className="hidden xl:table-cell">
                                                Gestionnaire
                                            </TableHead>
                                            <TableHead className="hidden 2xl:table-cell">Type</TableHead>
                                            <TableHead>Montant</TableHead>
                                            <TableHead className="hidden lg:table-cell">Méthode</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="hidden xl:table-cell">Date</TableHead>
                                            <TableHead className="w-20 text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {filteredPayments.length === 0 ? (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={10}
                                                    className="h-32 text-center text-sm text-muted-foreground"
                                                >
                                                    Aucun paiement trouvé.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedPayments.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell className="hidden xl:table-cell font-medium">
                                                        <span className="block truncate">
                                                            {payment.transactionId ?? "-"}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">
                                                                {payment.clientNom ?? "Client non renseigné"}
                                                            </p>
                                                            {payment.clientEmail && (
                                                                <p className="truncate text-xs text-muted-foreground">
                                                                    {payment.clientEmail}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    <TableCell className="hidden 2xl:table-cell">
                                                        <span className="block truncate">
                                                            {payment.terrainNom ?? "-"}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell className="hidden xl:table-cell">
                                                        <span className="block truncate">
                                                        {payment.gestionnaireNom ?? "Non renseigné"}
                                                        </span>
                                                    </TableCell>

                                                    <TableCell className="hidden 2xl:table-cell">
                                                        {payment.type === "RESERVATION_TERRAIN"
                                                            ? "Réservation terrain"
                                                            : "Séance coach"}
                                                    </TableCell>

                                                    <TableCell>
                                                        {payment.montant.toLocaleString()} FCFA
                                                    </TableCell>

                                                    <TableCell className="hidden lg:table-cell">
                                                        {payment.methode === "WAVE"
                                                            ? "Wave"
                                                            : payment.methode === "ORANGE_MONEY"
                                                                ? "Orange Money"
                                                                : payment.methode === "ESPECE"
                                                                    ? "Espèce"
                                                                    : "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        <PaymentStatusBadge status={payment.statut} />
                                                    </TableCell>

                                                    <TableCell className="hidden xl:table-cell">
                                                        {payment.datePaiement
                                                            ? new Date(payment.datePaiement).toLocaleDateString(
                                                                "fr-FR"
                                                            )
                                                            : "-"}
                                                    </TableCell>

                                                    <TableCell>
                                                        <div className="flex justify-end">
                                                            <Button asChild size="icon" variant="ghost">
                                                                <Link href={`/payments/${payment.id}`}>
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
                                    totalItems={filteredPayments.length}
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
