import { Badge } from "@/components/ui/badge";
import type { PaymentStatus } from "@/types/payment";

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const labels: Record<PaymentStatus, string> = {
    EN_ATTENTE: "En attente",
    PAYE: "Payé",
    ECHOUE: "Échoué",
    ANNULE: "Annulé",
    REMBOURSE: "Remboursé",
  };

  if (status === "PAYE") {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        {labels[status]}
      </Badge>
    );
  }

  if (status === "ECHOUE" || status === "ANNULE") {
    return <Badge variant="destructive">{labels[status]}</Badge>;
  }

  return (
    <Badge className="bg-amber-50 text-amber-800 ring-1 ring-amber-200">
      {labels[status]}
    </Badge>
  );
}
