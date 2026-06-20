import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/user";

type RoleBadgeProps = {
  role: UserRole;
};

export function RoleBadge({ role }: RoleBadgeProps) {
  const label: Record<UserRole, string> = {
    ADMIN: "Admin",
    CLIENT: "Client",
    COACH: "Coach",
    GESTIONNAIRE: "Gestionnaire",
  };

  const colors: Record<UserRole, string> = {
    ADMIN: "border-orange-200 bg-orange-50 text-orange-700",
    CLIENT: "border-zinc-200 bg-white text-zinc-700",
    COACH: "border-black/10 bg-zinc-900 text-white",
    GESTIONNAIRE: "border-amber-200 bg-amber-50 text-amber-800",
  };

  return (
    <Badge variant="outline" className={cn("font-semibold", colors[role])}>
      {label[role]}
    </Badge>
  );
}
