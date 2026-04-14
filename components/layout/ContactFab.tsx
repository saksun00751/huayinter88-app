"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n/context";

export default function ContactFab() {
  const [open, setOpen] = useState(true);
  const { lang } = useLang();

  if (!open) return null;

  return (
    <div className="fixed right-3 bottom-20 sm:bottom-6 z-40">
      <Link
        href={`/${lang}/contact`}
        aria-label="LINE"
        className="block active:scale-95 transition-all"
      >
        <svg width="48" height="48" viewBox="0 0 48 48">
          <path fill="#00B900" d="M24 4C12.97 4 4 11.28 4 20.25c0 8.04 7.12 14.78 16.73 16.05.65.14 1.54.43 1.77.99.2.51.13 1.3.07 1.82l-.28 1.72c-.09.51-.4 1.99 1.74 1.09 2.14-.9 11.55-6.8 15.76-11.65C42.7 27 44 23.79 44 20.25 44 11.28 35.03 4 24 4z"/>
          <path fill="#fff" d="M19.24 15.72h-1.4a.39.39 0 00-.39.39v8.72c0 .21.18.39.39.39h1.4c.21 0 .39-.18.39-.39v-8.72a.39.39 0 00-.39-.39zm9.67 0h-1.4a.39.39 0 00-.39.39v5.18l-4-5.4a.24.24 0 00-.03-.04l-.02-.02-.02-.02h-.01l-.02-.02h-.01l-.02-.01h-.01l-.02-.01h-1.45a.39.39 0 00-.39.39v8.72c0 .21.18.39.39.39h1.4c.22 0 .39-.18.39-.39v-5.18l4 5.4c.03.04.06.07.1.1l.02.01h.01l.02.01h.01l.02.01h.03l.04.01h1.37c.22 0 .39-.18.39-.39v-8.72a.39.39 0 00-.39-.39zm-13.04 7.32h-3.81v-6.93a.39.39 0 00-.39-.39h-1.4a.39.39 0 00-.39.39v8.72c0 .1.04.2.11.27v.01c.07.07.17.11.27.11h5.61c.22 0 .39-.18.39-.39v-1.4a.39.39 0 00-.39-.39zm20.41-5.14c.22 0 .39-.17.39-.39v-1.4a.39.39 0 00-.39-.39h-5.6a.38.38 0 00-.28.11.38.38 0 00-.11.27v8.73c0 .1.04.2.11.27.07.07.17.11.27.11h5.61c.22 0 .39-.17.39-.39v-1.4a.39.39 0 00-.39-.39h-3.82v-1.47h3.82c.22 0 .39-.17.39-.39v-1.4a.39.39 0 00-.39-.39h-3.82v-1.47h3.82z"/>
        </svg>
      </Link>
      <button
        type="button"
        aria-label="close"
        onClick={() => setOpen(false)}
        className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white border border-ap-border text-ap-tertiary flex items-center justify-center shadow hover:text-ap-primary transition-colors"
      >
        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  );
}
