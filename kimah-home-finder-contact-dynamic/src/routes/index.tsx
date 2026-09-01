import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Home,
  KeyRound,
  TrendingUp,
  Handshake,
  MapPin,
  PhoneCall,
  Search,
  FileSignature,
  KeySquare,
  ShieldCheck,
  MessageCircle,
  HeartHandshake,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  getPublicPage,
  apiRequest,
  type Listing as ApiListing,
} from "@/lib/api";
import portraitHero from "@/assets/tiffany-portrait-2.jpg";
import portrait1 from "@/assets/tiffany-portrait-1.jpg";
import portrait4 from "@/assets/tiffany-portrait-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Kimah The Realtor | DFW Real Estate with Tiffany Durojaiye",
      },
      {
        name: "description",
        content:
          "Buy, sell, lease, or invest in Dallas–Fort Worth with Tiffany Durojaiye, a Texas Realtor known for honest guidance and skilled negotiation.",
      },
      {
        property: "og:title",
        content: "Kimah The Realtor | DFW Real Estate",
      },
      {
        property: "og:description",
        content:
          "Texas Realtor Tiffany Durojaiye helps buyers, sellers, investors, and tenants across DFW.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: "/",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

type Listing = ApiListing;

const services = [
  {
    icon: Home,
    title: "Buying",
    body: "First-time buyers and growing families guided from pre-approval to keys in hand  with honest advice on every home we tour.",
  },
  {
    icon: TrendingUp,
    title: "Selling",
    body: "Strategic pricing, sharp marketing, and negotiation built to earn you top dollar, with a plan tailored to your timeline.",
  },
  {
    icon: KeyRound,
    title: "Leasing",
    body: "Landlords and tenants matched with the right home and the right terms  applications, screening, and paperwork handled.",
  },
  {
    icon: Handshake,
    title: "Investing",
    body: "Cash-flow and appreciation plays across the DFW metroplex and beyond, analyzed with real numbers before you commit.",
  },
];

const areas = [
  "Dallas",
  "Fort Worth",
  "Arlington",
  "Plano",
  "Frisco",
  "McKinney",
  "Irving",
  "Grand Prairie",
  "Mansfield",
  "Denton",
];

const steps = [
  {
    icon: PhoneCall,
    step: "01",
    title: "Discovery call",
    body: "We talk through your goals, timeline, and budget so every next step is built around you.",
  },
  {
    icon: Search,
    step: "02",
    title: "Curated search",
    body: "Hand-picked homes, buyers, or investment deals  no endless scrolling through mismatches.",
  },
  {
    icon: FileSignature,
    step: "03",
    title: "Negotiation & contract",
    body: "Terms and dollars defended like they’re my own, with clear communication at every turn.",
  },
  {
    icon: KeySquare,
    step: "04",
    title: "Closing & beyond",
    body: "A smooth path to the closing table  and a Realtor who stays in your corner after it.",
  },
];

function displayStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function Index() {
  const [homeContent, setHomeContent] = useState<Record<string, unknown>>(
    {},
  );

  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(true);

  useEffect(() => {
    getPublicPage("home")
      .then((result) => setHomeContent(result.data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    apiRequest<{ data: Listing[] }>("/public/listings")
      .then((result) => {
        setListings(result.data);
      })
      .catch(() => undefined)
      .finally(() => {
        setListingsLoading(false);
      });
  }, []);

  const hero = (homeContent.hero || {}) as {
    headline?: string;
    body?: string;
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink">
        {/* Desktop portrait */}
        <img
          src={portraitHero}
          alt="Tiffany Durojaiye, Texas Realtor serving Dallas–Fort Worth"
          className="absolute right-0 top-0 hidden h-full w-[62%] object-cover object-[80%_20%] md:block"
        />

        {/* Desktop gradient */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, var(--color-ink) 0%, var(--color-ink) 15%, color-mix(in srgb, var(--color-ink) 85%, transparent) 32%, color-mix(in srgb, var(--color-ink) 60%, transparent) 45%, color-mix(in srgb, var(--color-ink) 35%, transparent) 58%, color-mix(in srgb, var(--color-ink) 12%, transparent) 72%, transparent 88%)",
          }}
        />

        {/* Mobile portrait */}
        <div className="relative md:hidden">
          <div className="relative h-[58vh] min-h-[430px] max-h-[600px] overflow-hidden">
            <img
              src={portraitHero}
              alt="Tiffany Durojaiye, Texas Realtor serving Dallas–Fort Worth"
              className="h-full w-full object-cover object-top"
            />

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, color-mix(in srgb, var(--color-ink) 20%, transparent) 60%, var(--color-ink) 100%)",
              }}
            />
          </div>
        </div>

        {/* Hero content */}
        <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20 md:flex md:min-h-[85vh] md:items-center md:py-24">
          <div className="max-w-xl text-white">
            <p className="eyebrow">Dallas–Fort Worth · Texas</p>

            <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:mt-5 sm:text-5xl md:text-6xl lg:text-7xl">
              {hero.headline ||
                "Real estate that builds wealth, not just transactions."}
            </h1>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/80 sm:mt-6 sm:text-base">
              {hero.body ||
                "I’m Tiffany Durojaiye — Kimah The Realtor. From our first conversation through closing and beyond, I protect your best interests every step of the way."}
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/contact"
                className="inline-flex w-full items-center justify-center gap-2 bg-gold px-7 py-3.5 text-xs tracking-[0.22em] text-accent-foreground uppercase sm:w-auto"
              >
                Start your move
                <ArrowRight className="size-4" />
              </Link>

              <Link
                to="/listings"
                className="inline-flex w-full items-center justify-center gap-2 border border-white/50 px-7 py-3.5 text-xs tracking-[0.22em] uppercase sm:w-auto"
              >
                View listings
              </Link>
            </div>

            {/* Hero information */}
            <div className="mt-9 grid grid-cols-1 gap-5 border-t border-white/15 pt-7 sm:mt-12 sm:grid-cols-3 sm:gap-8 sm:pt-8">
              <div>
                <p className="font-display text-lg sm:text-xl">
                  Buy • Sell • Lease • Invest
                </p>
                <p className="mt-1 text-[10px] tracking-[0.16em] text-white/60 uppercase sm:text-xs">
                  Full-service representation
                </p>
              </div>

              <div>
                <p className="font-display text-lg sm:text-xl">
                  DFW Metroplex
                </p>
                <p className="mt-1 text-[10px] tracking-[0.16em] text-white/60 uppercase sm:text-xs">
                  & surrounding communities
                </p>
              </div>

              <div>
                <p className="font-display text-lg sm:text-xl">
                  Direct line
                </p>
                <p className="mt-1 text-[10px] tracking-[0.16em] text-white/60 uppercase sm:text-xs">
                  +1 (347) 691-9080
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">How I help</p>

        <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
          Full-service guidance for every kind of move.
        </h2>

        <span className="rule-gold mt-6" />

        <div className="mt-10 grid gap-px bg-border sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="bg-background p-6 sm:p-8">
              <s.icon className="size-6 text-gold" />

              <h3 className="mt-6 text-2xl">{s.title}</h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Featured properties</p>

              <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
                A look at what’s available across DFW.
              </h2>

              <span className="rule-gold mt-6" />
            </div>

            <Link
              to="/listings"
              className="inline-flex items-center gap-2 self-start text-xs tracking-[0.22em] text-gold uppercase sm:self-auto"
            >
              View all listings
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {!listingsLoading && listings.length > 0 && (
            <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
              {listings.slice(0, 3).map((listing) => (
                <article
                  key={listing.id}
                  className="group border border-border bg-background"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                    {listing.image_url && (
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    <span className="absolute left-4 top-4 bg-ink px-3 py-2 text-[10px] tracking-[0.18em] text-white uppercase">
                      {displayStatus(listing.status)}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl leading-snug sm:text-2xl">
                      {listing.title}
                    </h3>

                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4 shrink-0" />

                      <span>
                        {listing.address ? `${listing.address}, ` : ""}
                        {listing.city}, {listing.state}
                      </span>
                    </p>

                    <p className="mt-4 font-display text-2xl">
                      {listing.price_label ||
                        (listing.price
                          ? `$${Number(listing.price).toLocaleString()}`
                          : "Price on request")}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <BedDouble className="size-4" />
                        {listing.bedrooms ?? "—"} bd
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Bath className="size-4" />
                        {listing.bathrooms ?? "—"} ba
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Ruler className="size-4" />
                        {listing.square_feet?.toLocaleString() ?? "—"} sqft
                      </span>
                    </div>

                    <Link
                      to="/listings"
                      className="mt-6 inline-flex items-center gap-2 text-xs tracking-[0.2em] text-gold uppercase"
                    >
                      View property
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Philosophy */}
      <section className="surface-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:gap-14 sm:px-6 sm:py-24 md:grid-cols-[0.9fr_1.1fr]">
          <img
            src={portrait1}
            alt="Tiffany Durojaiye, Kimah The Realtor"
            className="w-full object-cover"
            loading="lazy"
          />

          <div>
            <p className="eyebrow">My philosophy</p>

            <blockquote className="mt-5 font-display text-3xl leading-snug sm:mt-6 sm:text-4xl">
              “My job doesn’t end when the contract is signed.”
            </blockquote>

            <p className="mt-6 max-w-2xl text-sm leading-relaxed opacity-75">
              Honest guidance, proactive communication, skilled negotiation,
              and hands-on support from our first conversation through closing
              and long after. Real estate is more than a transaction; it’s
              about building wealth, creating opportunities, and helping people
              find a place to call home.
            </p>

            <ul className="mt-8 space-y-4 text-sm">
              {[
                {
                  icon: ShieldCheck,
                  text: "Honest guidance — straight answers, even when they aren’t the easy ones",
                },
                {
                  icon: MessageCircle,
                  text: "Proactive communication — you’ll never wonder what’s happening",
                },
                {
                  icon: Handshake,
                  text: "Skilled negotiation — your interests defended at the table",
                },
                {
                  icon: HeartHandshake,
                  text: "Support beyond closing — a Realtor for this move and every one after",
                },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 opacity-85"
                >
                  <Icon className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/about"
              className="mt-9 inline-flex items-center gap-2 border border-white/40 px-7 py-3.5 text-xs tracking-[0.22em] uppercase sm:mt-10"
            >
              Meet Tiffany
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">The process</p>

        <h2 className="mt-4 max-w-2xl text-3xl sm:text-4xl">
          A clear path from first call to closing day.
        </h2>

        <span className="rule-gold mt-6" />

        <div className="mt-10 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="border border-border p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <s.icon className="size-6 text-gold" />

                <span className="font-display text-3xl text-muted-foreground/50">
                  {s.step}
                </span>
              </div>

              <h3 className="mt-6 text-2xl">{s.title}</h3>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Areas */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:gap-12 sm:px-6 sm:py-20 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Where I work</p>

            <h2 className="mt-4 text-3xl sm:text-4xl">
              Proudly serving the DFW metroplex.
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              From city condos to family suburbs and investment corridors, I
              know the neighborhoods, the schools, and the numbers  and I’ll
              help you find your fit.
            </p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {areas.map((a) => (
              <li
                key={a}
                className="flex items-center gap-2 border border-border bg-background px-4 py-3 text-xs tracking-[0.18em] uppercase sm:px-5"
              >
                <MapPin className="size-3.5 text-gold" />
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-10 sm:gap-12 md:grid-cols-2">
          <img
            src={portrait4}
            alt="Tiffany Durojaiye portrait"
            className="aspect-[4/5] w-full object-cover object-top"
            loading="lazy"
          />

          <div>
            <p className="eyebrow">Ready when you are</p>

            <h2 className="mt-4 text-3xl sm:text-4xl">
              Let’s talk about your next move.
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Whether you’re searching for your dream home, selling for top
              dollar, hunting an investment property, or leasing  I’ll make
              the process seamless and stress-free.
            </p>

            <div className="mt-7 border border-border p-6 sm:mt-8 sm:p-8">
              <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                Call or text
              </p>

              <a
                href="tel:+13476919080"
                className="mt-2 block font-display text-2xl sm:text-3xl"
              >
                +1 (347) 691-9080
              </a>

              <Link
                to="/contact"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
              >
                Send a message
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
