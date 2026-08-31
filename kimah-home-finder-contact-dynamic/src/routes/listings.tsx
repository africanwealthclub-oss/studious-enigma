import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bath,
  BedDouble,
  Ruler,
  MapPin,
  ArrowRight,
  BellRing,
  Search,
  Calculator,
  CalendarCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { apiRequest, type Listing as ApiListing } from "@/lib/api";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Featured DFW Listings | Kimah The Realtor" },
      {
        name: "description",
        content:
          "Browse featured homes, investment properties, and lease opportunities across the Dallas–Fort Worth metroplex with Tiffany Durojaiye.",
      },
      { property: "og:title", content: "Featured DFW Listings | Kimah The Realtor" },
      {
        property: "og:description",
        content: "Homes for sale, lease, and investment across Dallas–Fort Worth.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/listings" },
    ],
    links: [{ rel: "canonical", href: "/listings" }],
  }),
  component: Listings,
});

type Listing = ApiListing;

function displayStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const perks = [
  {
    icon: BellRing,
    title: "New-listing alerts",
    body: "Get matched homes in your inbox the moment they hit the market — before the crowd.",
  },
  {
    icon: Search,
    title: "Off-market access",
    body: "Opportunities that never reach the portals, surfaced through my local network.",
  },
  {
    icon: Calculator,
    title: "Real numbers first",
    body: "Payment estimates, comps, and rent projections before you ever write an offer.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible tours",
    body: "Evening and weekend showings, in person or virtual, scheduled around your life.",
  },
];

function Listings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ data: Listing[] }>("/public/listings")
      .then((result) => setListings(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load listings"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <p className="eyebrow">Featured properties</p>
        <h1 className="mt-5 text-5xl">Listings</h1>
        <span className="rule-gold mt-6" />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A curated look at homes for sale, lease, and investment across Dallas–Fort Worth. Don’t
          see what you’re after? Off-market options come up weekly — reach out and I’ll send matches
          directly.
        </p>
      </section>

      {/* Listing cards */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-24 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="col-span-full text-sm text-muted-foreground">Loading available properties…</p>}
        {error && <p className="col-span-full border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {!loading && !error && listings.length === 0 && <p className="col-span-full border border-border p-8 text-sm text-muted-foreground">No properties are published right now. Contact Tiffany for off-market opportunities.</p>}
        {listings.map((l) => (
          <article key={l.id} className="group border border-border">
            <div className="flex aspect-[4/3] items-center justify-center bg-secondary">
              {l.image_url ? <img src={l.image_url} alt={l.title} className="h-full w-full object-cover" /> : <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Photo coming soon</span>}
            </div>
            <div className="p-7">
              <span className="eyebrow">{displayStatus(l.status)}</span>
              <h2 className="mt-3 text-2xl leading-snug">{l.title}</h2>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" /> {l.address ? `${l.address}, ` : ""}{l.city}, {l.state}
              </p>
              <p className="mt-4 font-display text-2xl">{l.price_label || (l.price ? `$${Number(l.price).toLocaleString()}` : "Price on request")}</p>
              <div className="mt-5 flex flex-wrap gap-5 border-t border-border pt-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BedDouble className="size-4" /> {l.bedrooms ?? "—"} bd
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="size-4" /> {l.bathrooms ?? "—"} ba
                </span>
                <span className="flex items-center gap-1.5">
                  <Ruler className="size-4" /> {l.square_feet?.toLocaleString() ?? "—"} sqft
                </span>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{l.description || "Contact Tiffany for more property details."}</p>
              <Link
                to="/contact"
                className="mt-6 inline-flex text-xs tracking-[0.22em] text-gold uppercase"
              >
                Request details →
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* Buyer perks */}
      <section className="surface-ink">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow">Working with me</p>
          <h2 className="mt-4 max-w-2xl text-4xl">More than a search portal.</h2>
          <span className="rule-gold mt-6" />
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title} className="bg-ink p-8">
                <p.icon className="size-6 text-gold" />
                <h3 className="mt-6 text-xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selling strip */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow">Thinking of selling?</p>
          <h2 className="mt-4 text-4xl">Know your home’s worth before you list.</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Get a no-obligation market analysis with recent comparable sales, a pricing strategy,
            and a plan for preparation, staging, and launch — built around your timeline.
          </p>
          <ul className="mt-7 space-y-3 text-sm text-muted-foreground">
            {[
              "Comparative market analysis within 24 hours",
              "Prep & staging checklist to maximize your sale price",
              "Professional marketing across portals and social",
            ].map((v) => (
              <li key={v} className="flex items-start gap-3">
                <span className="mt-2 h-px w-5 shrink-0 bg-gold" />
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-border p-10">
          <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Free home valuation
          </p>
          <p className="mt-3 font-display text-3xl">What could your home sell for today?</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Call, text, or send your address and I’ll follow up personally with the numbers.
          </p>
          <a href="tel:+13476919080" className="mt-6 block font-display text-2xl text-gold">
            +1 (347) 691-9080
          </a>
          <Link
            to="/contact"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
          >
            Request my valuation <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-16">
          <div>
            <p className="eyebrow">Don’t see your match?</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              Tell me what you’re looking for — I’ll find it.
            </h2>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
          >
            Start the search <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
