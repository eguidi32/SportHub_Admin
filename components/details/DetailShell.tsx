import { ArrowLeft, ExternalLink, ImageIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DetailShellProps = {
  title: string;
  subtitle?: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
};

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

type DetailItemProps = {
  label: string;
  value?: ReactNode;
};

type DetailPhotoProps = {
  title: string;
  imageUrl?: string;
  emptyText: string;
};

export function DetailShell({
  title,
  subtitle,
  backHref,
  backLabel,
  children,
}: DetailShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link href={backHref}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {backLabel}
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

export function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}

export function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="min-w-0 rounded-md border bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 break-words text-sm font-medium text-foreground">
        {value ?? "-"}
      </div>
    </div>
  );
}

export function DetailPhoto({ title, imageUrl, emptyText }: DetailPhotoProps) {
  const safeImageUrl = imageUrl?.replaceAll('"', "%22");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {safeImageUrl ? (
          <>
            <div
              className="min-h-72 rounded-md border bg-zinc-100 bg-cover bg-center shadow-sm"
              style={{ backgroundImage: `url("${safeImageUrl}")` }}
              aria-label={title}
            />
            <Button asChild variant="outline" size="sm">
              <a href={imageUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Ouvrir la photo
              </a>
            </Button>
          </>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-md border border-dashed bg-zinc-50 px-4 text-center text-sm text-muted-foreground">
            <ImageIcon className="mb-3 h-8 w-8" />
            {emptyText}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
