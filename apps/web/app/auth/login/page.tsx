"use client";

import { useState } from "react";
import Link from "next/link";
import { API_BASE, apiFetch, setTokens } from "../../../lib/api";

export default function LoginPage() {
  const credentials: Record<string, { email: string; password: string }> = {
    user: { email: "customer@example.com", password: "password123" },
    creator: { email: "provider@example.com", password: "password123" },
    admin: { email: "admin@example.com", password: "password123" },
  };

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState(credentials.user.email);
  const [password, setPassword] = useState(credentials.user.password);
  const [loading, setLoading] = useState(false);

  const onRoleChange = (newRole: string) => {
    setRole(newRole);
    const creds = credentials[newRole];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
    }
  };

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
      const message = e?.message?.includes("Failed to fetch")
        ? `Login failed. Ensure the API is running at ${API_BASE}.`
        : e.message;
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-5 space-y-2 text-center">
        <div className="text-xs tracking-luxe text-brand-muted">ACCESS</div>
        <h1 className="mt-2 font-display text-3xl">Login</h1>
        <p className="text-xs tracking-[0.18em] text-brand-muted">
          Use creator, user, or admin credentials.
        </p>
      </div>

      <div className="mb-4 rounded-3xl border border-brand-line bg-brand-surface/35 p-4 text-xs text-brand-muted">
        <div className="text-[11px] tracking-[0.22em] text-brand-text">SAMPLE LOGINS</div>
        <div className="mt-3 space-y-1">
          <div>Creator: provider@example.com / password123</div>
          <div>User: customer@example.com / password123</div>
          <div>Admin: admin@example.com / password123</div>
        </div>
      </div>

      <div className="mb-4 rounded-3xl border border-brand-line bg-brand-surface/55 p-6 shadow-luxe">
        <label className="text-xs tracking-[0.22em] text-brand-muted">LOGIN AS</label>
        <select
          className="mt-2 w-full rounded-2xl border border-brand-line bg-brand-surface2/40 px-4 py-3 text-sm outline-none focus:border-brand-gold/60"
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          <option value="user">User</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>
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
