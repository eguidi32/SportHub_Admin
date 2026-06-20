import { Badge } from "@/components/ui/badge";
import type { CoachSessionStatus } from "@/types/coach-session";

type CoachSessionStatusBadgeProps = {
  status: CoachSessionStatus;
};

export function CoachSessionStatusBadge({
  status,
}: CoachSessionStatusBadgeProps) {
  const labels: Record<CoachSessionStatus, string> = {
    EN_ATTENTE: "En attente",
    CONFIRMEE: "Confirmée",
    REFUSEE: "Refusée",
    ANNULEE: "Annulée",
    TERMINEE: "Terminée",
  };

  if (status === "REFUSEE" || status === "ANNULEE") {
    return <Badge variant="destructive">{labels[status]}</Badge>;
  }

  if (status === "EN_ATTENTE") {
    return (
      <Badge className="bg-amber-50 text-amber-800 ring-1 ring-amber-200">
        {labels[status]}
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      {labels[status]}
    </Badge>
  );
}
