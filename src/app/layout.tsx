import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Échecs",
  description: "Jeu d'échecs local à deux joueurs",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <nav
          className="flex gap-4 border-b border-zinc-200 px-6 py-3 text-sm font-medium dark:border-zinc-700"
          data-testid="main-nav"
        >
          <Link href="/" className="hover:underline">
            Partie locale
          </Link>
          <Link href="/ouvertures" className="hover:underline">
            Ouvertures
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
