import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-main.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/listings", label: "Listings" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Kimah The Realtor logo" className="h-36 w-24 object-contain" />
          <span className="hidden sm:block">
            <span className="block font-display text-xl tracking-[0.3em]">KIMAH</span>
            <span className="block text-[0.6rem] tracking-[0.35em] text-muted-foreground">
              THE REALTOR
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground border-gold" }}
              inactiveProps={{ className: "text-muted-foreground border-transparent" }}
              className="border-b pb-1 text-xs tracking-[0.2em] uppercase transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <a
            href="tel:+13476919080"
            className="bg-primary px-5 py-2.5 text-xs tracking-[0.2em] text-primary-foreground uppercase transition-opacity hover:opacity-90"
          >
            Call Now
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-4 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="py-2 text-sm tracking-[0.2em] uppercase"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
