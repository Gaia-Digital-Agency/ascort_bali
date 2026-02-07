"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clearTokens } from "../lib/api";

export function AuthNavButton() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setLoggedIn(Boolean(window.sessionStorage.getItem("accessToken")));
    check();
    const onFocus = () => check();
    const onAuthChange = () => check();
    window.addEventListener("focus", onFocus);
    window.addEventListener("auth:change", onAuthChange);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("auth:change", onAuthChange);
    };
  }, []);

  if (!loggedIn) {
    return (
      <Link
        className="rounded-full border border-brand-gold/60 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-brand-text hover:border-brand-gold hover:text-white"
        href="/auth/login"
      >
        LOGIN
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        clearTokens();
        setLoggedIn(false);
        window.location.assign("/");
      }}
      className="rounded-full border border-brand-gold/60 px-4 py-2 text-xs font-semibold tracking-[0.22em] text-brand-text hover:border-brand-gold hover:text-white"
    >
      LOGOUT
    </button>
  );
}
