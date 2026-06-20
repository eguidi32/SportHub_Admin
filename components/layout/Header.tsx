"use client";

import { LogOut, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAdmin } from "@/services/auth.service";
import { menuItems } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const pageTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/users": "Utilisateurs",
  "/clients": "Clients",
  "/coaches": "Coachs",
  "/managers": "Gestionnaires",
  "/fields": "Terrains",
  "/bookings": "Réservations",
  "/coach-sessions": "Séances coach",
  "/payments": "Paiements",
  "/reviews": "Avis / Évaluations",
  "/settings": "Paramètres",
};

export function Header() {
  const pathname = usePathname();
  const title =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([href]) =>
      pathname.startsWith(`${href}/`)
    )?.[1] ??
    "SportHub Admin";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/95 px-4 shadow-sm shadow-black/5 backdrop-blur lg:h-20 lg:px-6">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Ouvrir le menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 border-r border-sidebar-border bg-sidebar p-0 text-sidebar-foreground"
          >
            <SheetHeader className="border-b border-sidebar-border p-4">
              <SheetTitle className="flex items-center gap-3 text-sidebar-foreground">
                <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-black ring-1 ring-white/10">
                  <Image
                    src="/sporthub-logo.png"
                    alt="Logo SportHub"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </span>
                SportHub Admin
              </SheetTitle>
            </SheetHeader>

            <nav className="space-y-1.5 px-3 py-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

                return (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SheetClose>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground lg:text-lg">
            {title}
          </h2>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Bienvenue dans l’espace administrateur.
          </p>
        </div>
      </div>

      <Button variant="outline" size="sm" onClick={logoutAdmin}>
        <LogOut className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Déconnexion</span>
      </Button>
    </header>
  );
}
