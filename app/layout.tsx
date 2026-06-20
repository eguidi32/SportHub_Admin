import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SportHub Admin",
  description: "Interface d'administration SportHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
