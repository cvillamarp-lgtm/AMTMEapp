"use client";
import { useState } from "react";
import Link from "next/link";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { MenuIcon } from "./icons";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-6 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl tracking-tight text-navy">{BRAND.short}</span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-bluegray md:inline">
            podcast
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="relative py-2 transition-colors hover:text-navy/70">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="/#featured"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-[2px]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            Escuchar ahora
          </a>
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 text-navy md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-navy/10 bg-cream md:hidden">
          <nav className="mx-auto flex max-w-[1320px] flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base font-medium text-navy hover:bg-navy/5"
              >
                {l.label}
              </a>
            ))}
            <a
              href="/#featured"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-cream"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
              Escuchar ahora
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
