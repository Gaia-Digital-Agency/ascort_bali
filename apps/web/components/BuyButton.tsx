"use client";

import { useState } from "react";
import { apiFetch } from "../lib/api";

export function BuyButton({ serviceId }: { serviceId: string }) {
  const [loading, setLoading] = useState(false);

  const buy = async () => {
    setLoading(true);
    try {
      const order = await apiFetch("/orders", { method: "POST", body: JSON.stringify({ serviceId }) });
      alert(`Order created: ${order.id}`);
    } catch (e: any) {
      alert(`Failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={buy}
      disabled={loading}
      className="rounded-full bg-brand-gold px-6 py-2.5 text-xs font-semibold tracking-[0.22em] text-black hover:bg-brand-gold2 disabled:opacity-50"
    >
      {loading ? "CREATING..." : "CREATE ORDER"}
    </button>
  );
}
