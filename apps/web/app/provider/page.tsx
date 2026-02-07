"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";

export default function ProviderPanel() {
  const [profile, setProfile] = useState<any>(null);
  const [title, setTitle] = useState("New Service");
  const [description, setDescription] = useState("Describe your service...");
  const [price, setPrice] = useState(100);
  const [duration, setDuration] = useState(60);
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [galleryImageUrls, setGalleryImageUrls] = useState(["", "", "", ""]);

  useEffect(() => {
    (async () => {
      try {
        const p = await apiFetch("/me/provider");
        setProfile(p);
      } catch (e: any) {
        alert("Provider login required.");
        window.location.href = "/auth/login";
      }
    })();
  }, []);

  const saveProfile = async () => {
    try {
      await apiFetch("/me/provider", { method: "PUT", body: JSON.stringify(profile) });
      alert("Profile saved");
    } catch (e: any) {
      alert(e.message);
    }
  };

  const createService = async () => {
    try {
      const s = await apiFetch("/services", {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
          mainImageUrl: mainImageUrl.trim() || null,
          galleryImages: galleryImageUrls.map((url) => url.trim()).filter(Boolean),
          basePrice: price,
          durationMinutes: duration,
        }),
      });
      alert(`Created service: ${s.id}`);
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs tracking-luxe text-brand-muted">PROVIDER</div>
          <h1 className="mt-2 font-display text-3xl">Panel</h1>
          <p className="mt-2 text-sm text-brand-muted">Edit profile and publish services.</p>
        </div>
        <Link className="text-xs tracking-[0.22em] text-brand-muted hover:text-brand-text" href="/provider#top">
          BACK HOME
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-brand-line bg-brand-surface/55 p-7">
          <div className="text-xs tracking-luxe text-brand-muted">PROFILE</div>

          <div className="mt-5 space-y-4">
            <Field label="DISPLAY NAME">
              <input
                className="w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                value={profile?.displayName ?? ""}
                onChange={(e) => setProfile({ ...(profile ?? {}), displayName: e.target.value })}
              />
            </Field>

            <Field label="BIO">
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                value={profile?.bio ?? ""}
                onChange={(e) => setProfile({ ...(profile ?? {}), bio: e.target.value })}
              />
            </Field>

            <button
              onClick={saveProfile}
              className="rounded-full bg-brand-gold px-6 py-2.5 text-xs font-semibold tracking-[0.22em] text-black hover:bg-brand-gold2"
            >
              SAVE PROFILE
            </button>
          </div>
        </section>

        <section className="rounded-3xl border border-brand-line bg-brand-surface/55 p-7">
          <div className="text-xs tracking-luxe text-brand-muted">NEW SERVICE</div>

          <div className="mt-5 space-y-4">
            <Field label="TITLE">
              <input
                className="w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Field>

            <Field label="DESCRIPTION">
              <textarea
                className="min-h-[120px] w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>

            <Field label="MAIN IMAGE URL">
              <input
                className="w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                value={mainImageUrl}
                onChange={(e) => setMainImageUrl(e.target.value)}
                placeholder="https://..."
              />
            </Field>

            <Field label="GALLERY IMAGE URLS (UP TO 4)">
              <div className="space-y-3">
                {galleryImageUrls.map((url, index) => (
                  <input
                    key={index}
                    className="w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                    value={url}
                    onChange={(e) => {
                      const next = [...galleryImageUrls];
                      next[index] = e.target.value;
                      setGalleryImageUrls(next);
                    }}
                    placeholder={`https://... (${index + 1})`}
                  />
                ))}
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="PRICE">
                <input
                  className="w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </Field>
              <Field label="DURATION (MIN)">
                <input
                  className="w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                />
              </Field>
            </div>

            <button
              onClick={createService}
              className="rounded-full border border-brand-gold/60 px-6 py-2.5 text-xs font-semibold tracking-[0.22em] text-brand-text hover:border-brand-gold hover:text-white"
            >
              PUBLISH
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs tracking-[0.22em] text-brand-muted">{label}</div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
