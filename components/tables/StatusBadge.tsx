import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  active?: boolean;
};

export function StatusBadge({ active }: StatusBadgeProps) {
  if (active) {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
        Actif
      </Badge>
    );
  }

  return (
    <Badge className="bg-zinc-100 text-zinc-600 ring-1 ring-zinc-200">
      Inactif
    </Badge>
  );
}
