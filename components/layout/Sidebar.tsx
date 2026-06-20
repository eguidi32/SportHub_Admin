"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  Dumbbell,
  Home,
  MessageSquare,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
  Warehouse,
} from "lucide-react";

import { cn } from "@/lib/utils";

export const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Utilisateurs", href: "/users", icon: Users },
  { label: "Clients", href: "/clients", icon: UserCog },
  { label: "Coachs", href: "/coaches", icon: Dumbbell },
  { label: "Gestionnaires", href: "/managers", icon: ShieldCheck },
  { label: "Terrains", href: "/fields", icon: Warehouse },
  { label: "Réservations", href: "/bookings", icon: CalendarCheck },
  { label: "Séances coach", href: "/coach-sessions", icon: BarChart3 },
  { label: "Paiements", href: "/payments", icon: CreditCard },
  { label: "Avis", href: "/reviews", icon: MessageSquare },
  { label: "Paramètres", href: "/settings", icon: Settings },
];

type SidebarNavProps = {
  onNavigate?: () => void;
};

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1.5 px-3 py-4">
      {menuItems.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                : "text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            )}
          >
            <span
              className={cn(
                "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-white/90 opacity-0 transition",
                isActive && "opacity-100"
              )}
            />
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex lg:flex-col">
      <div className="flex h-20 shrink-0 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
            <Image
              src="/sporthub-logo.png"
              alt="Logo SportHub"
              width={44}
              height={44}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div className="min-w-0">
            <h1 className="whitespace-nowrap text-lg font-bold tracking-tight">
              SportHub Admin
            </h1>
            <p className="mt-0.5 whitespace-nowrap text-xs text-sidebar-foreground/55">
              Gestion de la plateforme
            </p>
          </div>
        </div>
      </div>

      <SidebarNav />

      <div className="border-t border-sidebar-border px-4 py-4 text-xs text-sidebar-foreground/50">
        Administration SportHub
      </div>
    </aside>
  );
}
