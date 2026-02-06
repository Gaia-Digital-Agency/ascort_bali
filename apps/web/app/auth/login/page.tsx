"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE, apiFetch, setTokens } from "../../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      if (profile.role === "admin") window.location.href = "/admin";
      else if (profile.role === "provider") window.location.href = "/provider";
      else window.location.href = "/dashboard";
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-5 text-center">
        <div className="text-xs tracking-luxe text-brand-muted">ACCESS</div>
        <h1 className="mt-2 font-display text-3xl">Login</h1>
      </div>

      <div className="rounded-3xl border border-brand-line bg-brand-surface/55 p-7 shadow-luxe">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs tracking-[0.22em] text-brand-muted">EMAIL</label>
            <input
              className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none placeholder:text-brand-muted/60 focus:border-brand-gold/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
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

          <button
            disabled={loading}
            className="w-full rounded-full bg-brand-gold py-3 text-xs font-semibold tracking-[0.22em] text-black hover:bg-brand-gold2 disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>

          <div className="pt-2 text-center text-xs tracking-[0.18em] text-brand-muted">
            NO ACCOUNT?{" "}
            <Link className="text-brand-gold hover:text-white" href="/auth/register">
              REGISTER
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
