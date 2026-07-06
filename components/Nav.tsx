"use client";

// Composant client (pas un simple Server Component) uniquement parce qu'on a besoin
// d'un état local pour le menu mobile (useState). Le reste de la nav n'a aucune
// interactivité et pourrait rester serveur si on enlevait le menu burger.
import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/projects", label: "Projets" },
  { href: "/services", label: "Services" },
  { href: "/monitoring", label: "Monitoring" },
];

// URL externe : le blog vit sur le NAS (WordPress/Joomla), pas dans ce repo Next.js.
const BLOG_URL = "https://blog.hernandes.cloud";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-mono text-lg font-semibold text-brand">
          hernandes.cloud
        </Link>

        {/* Nav desktop */}
        <ul className="hidden items-center gap-6 text-sm font-medium sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="transition-colors hover:text-brand">
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors hover:text-brand"
            >
              Blog
              <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          <span className="block h-0.5 w-6 bg-foreground" />
          <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
          <span className="mt-1.5 block h-0.5 w-6 bg-foreground" />
        </button>
      </div>

      {/* Nav mobile dépliée */}
      {open && (
        <ul className="flex flex-col gap-1 border-t border-border px-6 py-4 text-sm font-medium sm:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block py-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={BLOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2"
            >
              Blog ↗
            </a>
          </li>
        </ul>
      )}
    </header>
  );
}
