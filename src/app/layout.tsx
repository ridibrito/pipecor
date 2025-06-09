import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "pipecor",
  description: "CRM para corretoras de planos de saúde",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Deixamos o <html> limpo
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      {/* E aplicamos a supressão diretamente na tag <body> */}
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}