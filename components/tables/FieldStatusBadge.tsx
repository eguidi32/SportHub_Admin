import { Badge } from "@/components/ui/badge";
import type { FieldStatus } from "@/types/field";

type FieldStatusBadgeProps = {
  status?: FieldStatus;
};

export function FieldStatusBadge({ status }: FieldStatusBadgeProps) {
  if (!status) {
    return (
      <Badge className="bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200">
        Non renseigné
      </Badge>
    );
  }

  if (status === "MAINTENANCE") {
    return (
      <Badge className="bg-amber-50 text-amber-800 ring-1 ring-amber-200">
        Maintenance
      </Badge>
    );
  }

  if (status === "INDISPONIBLE") {
    return <Badge variant="destructive">Indisponible</Badge>;
  }

  return (
    <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      Disponible
    </Badge>
  );
}
