import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "../components/AnalyticsBeacon";
import { FooterStatus } from "../components/FooterStatus";
import { Inter, Playfair_Display } from "next/font/google";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const fontDisplay = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "AscortBali",
  description: "Service marketplace scaffold",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body>
        <AnalyticsBeacon />

        <header className="sticky top-0 z-10 border-b border-brand-line bg-brand-bg/70 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="group flex items-baseline gap-3">
              <span className="font-display text-lg tracking-[0.22em]">ASCORTBALI</span>
              <span className="hidden text-xs tracking-luxe text-brand-muted md:block">
                premium marketplace
              </span>
              <span className="ml-1 h-[1px] w-10 bg-brand-gold/70 opacity-70 transition group-hover:opacity-100" />
            </Link>

            <nav className="flex gap-5 text-xs tracking-[0.22em] text-brand-muted">
              <Link className="hover:text-brand-text" href="/provider">CREATORS</Link>
              <Link className="hover:text-brand-text" href="/dashboard">USERS</Link>
              <Link className="hover:text-brand-text" href="/admin">ADMIN</Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

        <footer className="border-t border-brand-line">
          <FooterStatus />
        </footer>
      </body>
    </html>
  );
}
