"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE, apiFetch, clearTokens, setTokens } from "../../lib/api";

type Me = { email: string; role: string };
type AdminStats = { creatorCount: number; userCount: number };
type AdSpace = {
  slot: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

const defaultAds: AdSpace[] = [
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

export default function AdminPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [ads, setAds] = useState<AdSpace[]>(defaultAds);
  const [saving, setSaving] = useState(false);

  const loadAdminData = async () => {
    const [statsData, adsData] = await Promise.all([apiFetch("/admin/stats"), apiFetch("/admin/ads")]);
    setStats(statsData);
    if (Array.isArray(adsData) && adsData.length) {
      setAds(adsData);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const profile = await apiFetch("/me");
        if (profile.role !== "admin") {
          clearTokens();
          setError("This account is not an admin.");
          return;
        }
        setMe(profile);
        await loadAdminData();
      } catch {
        setMe(null);
      }
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Login failed");
      setTokens({ accessToken: json.accessToken, refreshToken: json.refreshToken });

      const profile = await apiFetch("/me");
      if (profile.role !== "admin") {
        clearTokens();
        throw new Error("This account is not an admin.");
      }
      setMe(profile);
      await loadAdminData();
    } catch (err: any) {
      setError(err.message ?? "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const updateAd = (index: number, key: keyof AdSpace, value: string) => {
    setAds((prev) => prev.map((ad, idx) => (idx === index ? { ...ad, [key]: value } : ad)));
  };

  const saveAds = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiFetch("/admin/ads", {
        method: "PUT",
        body: JSON.stringify(
          ads.map((ad) => ({
            ...ad,
            ctaLabel: ad.ctaLabel || null,
            ctaHref: ad.ctaHref || null,
          }))
        ),
      });
    } catch (err: any) {
      setError(err.message ?? "Unable to save ad spaces.");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    clearTokens();
    setMe(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs tracking-luxe text-brand-muted">ADMIN</div>
          <h1 className="mt-2 font-display text-3xl">Control Center</h1>
          <p className="mt-2 text-sm text-brand-muted">
            {me ? `Signed in as ${me.email}` : "Sign in with an admin account."}
          </p>
        </div>
        <Link className="text-xs tracking-[0.22em] text-brand-muted hover:text-brand-text" href="/admin#top">
          BACK HOME
        </Link>
      </div>

      {me ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-brand-line bg-brand-surface/55 p-6 shadow-luxe">
              <div className="text-xs tracking-[0.22em] text-brand-muted">REGISTERED CREATORS</div>
              <div className="mt-4 font-display text-3xl text-brand-text">{stats?.creatorCount ?? "—"}</div>
            </div>
            <div className="rounded-3xl border border-brand-line bg-brand-surface/55 p-6 shadow-luxe">
              <div className="text-xs tracking-[0.22em] text-brand-muted">REGISTERED USERS</div>
              <div className="mt-4 font-display text-3xl text-brand-text">{stats?.userCount ?? "—"}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-brand-line bg-brand-surface/55 p-7 shadow-luxe">
            <div className="text-xs tracking-[0.22em] text-brand-muted">ADVERTISING SPACES</div>
            <div className="mt-6 space-y-5">
              {ads.map((ad, index) => (
                <div key={ad.slot} className="rounded-2xl border border-brand-line bg-brand-surface2/40 p-5">
                  <div className="text-xs tracking-[0.22em] text-brand-muted">SLOT {index + 1}</div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs tracking-[0.22em] text-brand-muted">TITLE</label>
                      <input
                        className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
                        value={ad.title}
                        onChange={(e) => updateAd(index, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.22em] text-brand-muted">SUBTITLE</label>
                      <input
                        className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
                        value={ad.subtitle}
                        onChange={(e) => updateAd(index, "subtitle", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.22em] text-brand-muted">IMAGE</label>
                      <input
                        className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
                        value={ad.image}
                        onChange={(e) => updateAd(index, "image", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.22em] text-brand-muted">CTA LABEL</label>
                      <input
                        className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
                        value={ad.ctaLabel ?? ""}
                        onChange={(e) => updateAd(index, "ctaLabel", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.22em] text-brand-muted">CTA LINK</label>
                      <input
                        className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
                        value={ad.ctaHref ?? ""}
                        onChange={(e) => updateAd(index, "ctaHref", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error ? <div className="mt-4 text-xs text-red-400">{error}</div> : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={saveAds}
                disabled={saving}
                className="rounded-full bg-brand-gold px-6 py-2.5 text-xs font-semibold tracking-[0.22em] text-black hover:bg-brand-gold2 disabled:opacity-50"
              >
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
              <button
                onClick={logout}
                className="rounded-full border border-brand-line px-5 py-2 text-xs font-semibold tracking-[0.22em] text-brand-muted hover:text-brand-text"
              >
                LOGOUT
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-brand-line bg-brand-surface/55 p-7 shadow-luxe">
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs tracking-[0.22em] text-brand-muted">EMAIL</label>
              <input
                className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.22em] text-brand-muted">PASSWORD</label>
              <input
                className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error ? <div className="text-xs text-red-400">{error}</div> : null}

            <button
              disabled={loading}
              className="w-full rounded-full bg-brand-gold py-3 text-xs font-semibold tracking-[0.22em] text-black hover:bg-brand-gold2 disabled:opacity-50"
            >
              {loading ? "SIGNING IN..." : "ADMIN SIGN IN"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
