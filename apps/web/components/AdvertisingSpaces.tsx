"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { API_BASE } from "../lib/api";

type AdSpace = {
  slot: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

const fallbackAds: AdSpace[] = [
  {
    slot: "hero-1",
    title: "Hero Advertising Space",
    subtitle: "Primary banner placement",
    image: "/placeholders/hero-1.jpg",
    ctaLabel: "Inquire",
    ctaHref: "/services",
  },
  {
    slot: "hero-2",
    title: "Premium Placement",
    subtitle: "Highlight seasonal campaigns",
    image: "/placeholders/card-2.jpg",
    ctaLabel: "View Packages",
    ctaHref: "/services",
  },
  {
    slot: "hero-3",
    title: "Featured Sponsor",
    subtitle: "Showcase top-tier partners",
    image: "/placeholders/card-3.jpg",
    ctaLabel: "Get Started",
    ctaHref: "/services",
  },
];

const useAds = () => {
  const [ads, setAds] = useState<AdSpace[]>(fallbackAds);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/ads`, { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length) {
          setAds(data.slice(0, 3));
        }
      } catch {
        if (controller.signal.aborted) return;
      }
    })();

    return () => controller.abort();
  }, []);

  return ads;
};

export function HeroAdCards() {
  const ads = useAds();

  return (
    <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-6">
      {ads.map((ad) => (
        <div
          key={ad.slot}
          className="group relative min-h-[190px] overflow-hidden rounded-2xl border border-brand-line bg-brand-surface/70 shadow-luxe"
        >
          <div className="absolute inset-0">
            <Image src={ad.image} alt={ad.title} fill className="object-cover opacity-60" sizes="(min-width: 768px) 20vw, 80vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>
          <div className="relative flex h-full flex-col gap-3 p-5">
            <div className="text-[10px] tracking-[0.22em] text-brand-muted">AD SPACE</div>
            <div className="font-display text-xl leading-tight text-brand-text">{ad.title}</div>
            <div className="text-xs text-brand-muted">{ad.subtitle}</div>
            {ad.ctaLabel ? (
              <Link
                className="mt-auto inline-flex items-center gap-2 text-xs tracking-[0.22em] text-brand-gold hover:text-white"
                href={ad.ctaHref || "/"}
              >
                {ad.ctaLabel}
                <span className="h-px w-6 bg-brand-gold/70" />
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MainAdSpaces() {
  const ads = useAds();

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {ads.map((ad) => (
        <div key={ad.slot} className="group overflow-hidden rounded-3xl border border-brand-line bg-brand-surface/50 shadow-luxe">
          <div className="relative h-64">
            <Image src={ad.image} alt={ad.title} fill className="object-cover transition duration-700 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          </div>
          <div className="p-6">
            <div className="text-xs tracking-luxe text-brand-muted">{ad.subtitle}</div>
            <div className="mt-3 font-display text-2xl">{ad.title}</div>
            {ad.ctaLabel ? (
              <div className="mt-5 flex items-center gap-3 text-xs tracking-[0.22em] text-brand-muted">
                <span className="h-px w-8 bg-brand-gold/70" />
                <Link className="hover:text-brand-text" href={ad.ctaHref || "/"}>
                  {ad.ctaLabel}
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
