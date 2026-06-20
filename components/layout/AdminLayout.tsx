"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { isAdminAuthenticated } from "@/services/auth.service";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 text-sm text-muted-foreground">
        Vérification de la session administrateur...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-h-screen flex-col overflow-hidden lg:pl-64">
        <Header />

        <main className="flex-1 overflow-x-hidden p-4 sm:p-5 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
