import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
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
import { apiRequest, submitInquiry, type Listing as ApiListing } from "@/lib/api";

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

function interestForStatus(status: string): string {
  if (status === "for_lease") return "lease";
  if (status === "investment") return "invest";
  return "buy";
}

const perks = [
  {
    icon: BellRing,
    title: "New-listing alerts",
    body: "Get matched homes in your inbox the moment they hit the market - before the crowd.",
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
  const [inquiryListing, setInquiryListing] = useState<Listing | null>(null);

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
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 sm:pt-20 pb-10">
        <p className="eyebrow">Featured properties</p>
        <h1 className="mt-5 text-4xl sm:text-5xl">Listings</h1>
        <span className="rule-gold mt-6" />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A curated look at homes for sale, lease, and investment across Dallas–Fort Worth. Don't
          see what you're after? Off-market options come up weekly - reach out and I'll send matches
          directly.
        </p>
      </section>

      {/* Listing cards */}
      <section className="mx-auto grid max-w-6xl gap-6 sm:gap-8 px-4 sm:px-6 pb-20 sm:pb-24 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="col-span-full text-sm text-muted-foreground">Loading available properties...</p>}
        {error && <p className="col-span-full border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {!loading && !error && listings.length === 0 && <p className="col-span-full border border-border p-8 text-sm text-muted-foreground">No properties are published right now. Contact Tiffany for off-market opportunities.</p>}
        {listings.map((l) => (
          <article key={l.id} className="group border border-border">
            <div className="flex aspect-[4/3] items-center justify-center bg-secondary">
              {l.image_url ? <img src={l.image_url} alt={l.title} className="h-full w-full object-cover" /> : <span className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Photo coming soon</span>}
            </div>
            <div className="p-5 sm:p-7">
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
              <button
                onClick={() => setInquiryListing(l)}
                className="mt-6 inline-flex text-xs tracking-[0.22em] text-gold uppercase"
              >
                Request details -&gt;
              </button>
            </div>
          </article>
        ))}
      </section>

      {/* Buyer perks */}
      <section className="surface-ink">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-24">
          <p className="eyebrow">Working with me</p>
          <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">More than a search portal.</h2>
          <span className="rule-gold mt-6" />
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title} className="bg-ink p-6 sm:p-8">
                <p.icon className="size-6 text-gold" />
                <h3 className="mt-6 text-xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selling strip */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 sm:gap-12 px-4 sm:px-6 py-16 sm:py-24 md:grid-cols-2">
        <div>
          <p className="eyebrow">Thinking of selling?</p>
          <h2 className="mt-4 text-3xl sm:text-4xl">Know your home's worth before you list.</h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Get a no-obligation market analysis with recent comparable sales, a pricing strategy,
            and a plan for preparation, staging, and launch - built around your timeline.
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
        <div className="border border-border p-6 sm:p-10">
          <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
            Free home valuation
          </p>
          <p className="mt-3 font-display text-3xl">What could your home sell for today?</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Call, text, or send your address and I'll follow up personally with the numbers.
          </p>
          <a href="tel:+13476919080" className="mt-6 block font-display text-2xl text-gold">
            +1 (347) 691-9080
          </a>
          
            href="/contact"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
          >
            Request my valuation <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-secondary">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-4 sm:px-6 py-14 sm:py-16">
          <div>
            <p className="eyebrow">Don't see your match?</p>
            <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl">
              Tell me what you're looking for - I'll find it.
            </h2>
          </div>
          
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
          >
            Start the search <ArrowRight className="size-4" />
          </a>
        </div>
      </section>

      <SiteFooter />

      {inquiryListing && (
        <ListingInquiryModal listing={inquiryListing} onClose={() => setInquiryListing(null)} />
      )}
    </div>
  );
}

function ListingInquiryModal({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const contextLine = `Inquiry about: ${listing.title} - ${listing.city}, ${listing.state} (listing #${listing.id})`;
      const message = note.trim() ? `${contextLine}\n\n${note.trim()}` : contextLine;
      await submitInquiry({
        name,
        email,
        phone: phone || undefined,
        interest: interestForStatus(listing.status),
        message,
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 sm:items-center">
      <div className="w-full max-w-md border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 sm:px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Request details</p>
            <h2 className="mt-1 text-lg leading-snug">{listing.title}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-muted-foreground hover:text-gold">x</button>
        </div>

        <div className="px-5 sm:px-6 py-6">
          {sent ? (
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Thank you - your request about {listing.title} has been received. Tiffany will follow up shortly.
              </p>
              <button onClick={onClose} className="mt-6 w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && <p className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
              <label className="block text-xs uppercase tracking-[0.15em]">Name
                <input
                  className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.15em]">Email
                <input
                  type="email"
                  className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.15em]">Phone
                <input
                  type="tel"
                  className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="block text-xs uppercase tracking-[0.15em]">Message
                <textarea
                  className="mt-2 w-full min-h-24 border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  placeholder="Anything specific you'd like to know?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <button disabled={submitting} className="w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">
                {submitting ? "Sending..." : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
