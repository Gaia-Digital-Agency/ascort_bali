"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, clearTokens } from "../../lib/api";

export default function Dashboard() {
  const [me, setMe] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  const roleLabel = (role?: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "provider":
        return "Creator";
      case "customer":
        return "User";
      default:
        return role ?? "";
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const m = await apiFetch("/me");
        if (m.role === "admin") {
          window.location.href = "/admin";
          return;
        }
        if (m.role === "provider") {
          window.location.href = "/provider";
          return;
        }
        setMe(m);
        const o = await apiFetch("/me/orders");
        setOrders(o);
        const f = await apiFetch("/me/favorites");
        setFavorites(f);
      } catch (e: any) {
        // if not logged in, redirect
      }
    })();
  }, []);

  const logout = async () => {
    clearTokens();
    window.location.href = "/";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs tracking-luxe text-brand-muted">ACCOUNT</div>
          <h1 className="mt-2 font-display text-3xl">Dashboard</h1>
          <p className="mt-2 text-sm text-brand-muted">
            {me ? `Signed in as ${me.email} (${roleLabel(me.role)})` : "Sign in to continue."}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            className="rounded-full border border-brand-gold/60 px-5 py-2 text-xs font-semibold tracking-[0.22em] text-brand-text hover:border-brand-gold hover:text-white"
            href="/provider"
          >
            PROVIDER
          </Link>
          <button
            onClick={logout}
            className="rounded-full border border-brand-line px-5 py-2 text-xs font-semibold tracking-[0.22em] text-brand-muted hover:text-brand-text"
          >
            LOGOUT
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-3xl border border-brand-line bg-brand-surface/55 p-7">
          <div className="text-xs tracking-luxe text-brand-muted">ORDERS</div>
          <div className="mt-5 space-y-3">
            {orders.length === 0 ? (
              <div className="text-sm text-brand-muted">No orders yet.</div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="rounded-2xl border border-brand-line bg-brand-surface2/40 p-4">
                  <div className="text-xs tracking-[0.22em] text-brand-muted">STATUS • {o.status}</div>
                  <div className="mt-2 text-sm text-brand-text">Order #{o.id.slice(0, 8)}</div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-brand-line bg-brand-surface/55 p-7">
          <div className="text-xs tracking-luxe text-brand-muted">FAVORITES</div>
          <div className="mt-5 space-y-3">
            {favorites.length === 0 ? (
              <div className="text-sm text-brand-muted">No favorites yet.</div>
            ) : (
              favorites.map((f) => (
                <Link
                  key={f.serviceId}
                  href={`/services/${f.serviceId}`}
                  className="block rounded-2xl border border-brand-line bg-brand-surface2/40 p-4 hover:border-brand-gold/50"
                >
                  <div className="text-xs tracking-[0.22em] text-brand-muted">SERVICE</div>
                  <div className="mt-2 text-sm text-brand-text">View #{f.serviceId.slice(0, 8)}</div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
