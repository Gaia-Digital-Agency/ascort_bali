import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { AnalyticsBeacon } from "../components/AnalyticsBeacon";
import { AuthNavButton } from "../components/AuthNavButton";
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

            <AuthNavButton />
          </div>
        </header>

        <main id="top" className="mx-auto max-w-6xl px-4 py-10">
          {children}
          <div className="mt-12 flex justify-center">
            <a
              href="#top"
              className="rounded-full border border-brand-gold/60 px-6 py-2 text-xs font-semibold tracking-[0.22em] text-brand-text hover:border-brand-gold hover:text-white"
            >
              BACK TO TOP
            </a>
          </div>
        </main>

        <footer className="border-t border-brand-line">
          <FooterStatus />
        </footer>
      </body>
    </html>
  );
}
