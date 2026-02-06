"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export function FavoriteButton({ serviceId }: { serviceId: string }) {
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await apiFetch(`/me/favorites/${serviceId}`, { method: "POST" });
      alert("Saved to favorites");
    } catch (e: any) {
      alert(`Failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={save}
      disabled={loading}
      className="rounded-full border border-brand-gold/60 px-6 py-2.5 text-xs font-semibold tracking-[0.22em] text-brand-text hover:border-brand-gold hover:text-white disabled:opacity-50"
    >
      {loading ? "SAVING..." : "FAVORITE"}
    </button>
  );
}
