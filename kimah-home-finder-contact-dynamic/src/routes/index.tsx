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
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublicPage } from "@/lib/api";
import portraitHero from "@/assets/tiffany-portrait-2.jpg";
import portrait1 from "@/assets/tiffany-portrait-1.jpg";
import portrait4 from "@/assets/tiffany-portrait-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kimah The Realtor | DFW Real Estate with Tiffany Durojaiye" },
      {
        name: "description",
        content:
          "Buy, sell, lease, or invest in Dallas–Fort Worth with Tiffany Durojaiye, a Texas Realtor known for honest guidance and skilled negotiation.",
      },
      { property: "og:title", content: "Kimah The Realtor | DFW Real Estate" },
      {
        property: "og:description",
        content: "Texas Realtor Tiffany Durojaiye helps buyers, sellers, investors, and tenants across DFW.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const services = [
  {
    icon: Home,
    title: "Buying",
    body: "First-time buyers and growing families guided from pre-approval to keys in hand — with honest advice on every home we tour.",
  },
  {
    icon: TrendingUp,
    title: "Selling",
    body: "Strategic pricing, sharp marketing, and negotiation built to earn you top dollar, with a plan tailored to your timeline.",
  },
  {
    icon: KeyRound,
    title: "Leasing",
    body: "Landlords and tenants matched with the right home and the right terms — applications, screening, and paperwork handled.",
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
    body: "Hand-picked homes, buyers, or investment deals — no endless scrolling through mismatches.",
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
    body: "A smooth path to the closing table — and a Realtor who stays in your corner after it.",
  },
];

function Index() {
  const [homeContent, setHomeContent] = useState<Record<string, unknown>>({});

  useEffect(() => {
    getPublicPage("home").then((result) => setHomeContent(result.data)).catch(() => undefined);
  }, []);

  const hero = (homeContent.hero || {}) as { headline?: string; body?: string };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero — portrait of Tiffany with gradient overlay for text */}
      <section className="relative overflow-hidden bg-ink">
        <img
          src={portraitHero}
          alt="Tiffany Durojaiye, Texas Realtor serving Dallas–Fort Worth"
          className="absolute inset-y-0 right-0 h-full w-full scale-110 object-cover object-top md:w-[62%] md:object-[80%_20%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--color-ink) 0%, var(--color-ink) 15%, color-mix(in srgb, var(--color-ink) 85%, transparent) 32%, color-mix(in srgb, var(--color-ink) 60%, transparent) 45%, color-mix(in srgb, var(--color-ink) 35%, transparent) 58%, color-mix(in srgb, var(--color-ink) 12%, transparent) 72%, transparent 88%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[85vh] w-full max-w-6xl items-center px-6 py-24">
          <div className="max-w-xl text-white">
            <p className="eyebrow">Dallas–Fort Worth · Texas</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
              {hero.headline || "Real estate that builds wealth, not just transactions."}
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/80">
              {hero.body || "I’m Tiffany Durojaiye — Kimah The Realtor. From our first conversation through closing and beyond, I protect your best interests every step of the way."}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-gold px-7 py-3.5 text-xs tracking-[0.22em] text-accent-foreground uppercase"
              >
                Start your move <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 border border-white/50 px-7 py-3.5 text-xs tracking-[0.22em] uppercase"
              >
                View listings
              </Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-8">
              {[
                ["Buy • Sell • Lease • Invest", "Full-service representation"],
                ["DFW Metroplex", "& surrounding communities"],
                ["Direct line", "+1 (347) 691-9080"],
              ].map(([top, bottom]) => (
                <div key={top}>
                  <p className="font-display text-xl">{top}</p>
                  <p className="mt-1 text-xs tracking-[0.18em] text-white/60 uppercase">{bottom}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="eyebrow">How I help</p>
        <h2 className="mt-4 max-w-2xl text-4xl">Full-service guidance for every kind of move.</h2>
        <span className="rule-gold mt-6" />
        <div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="bg-background p-8">
              <s.icon className="size-6 text-gold" />
              <h3 className="mt-6 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="surface-ink">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr]">
          <img
            src={portrait1}
            alt="Tiffany Durojaiye, Kimah The Realtor"
            className="w-full object-cover"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">My philosophy</p>
            <blockquote className="mt-6 font-display text-3xl leading-snug sm:text-4xl">
              “My job doesn’t end when the contract is signed.”
            </blockquote>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed opacity-75">
              Honest guidance, proactive communication, skilled negotiation, and hands-on support
              from our first conversation through closing and long after. Real estate is more than a
              transaction; it’s about building wealth, creating opportunities, and helping people
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
                <li key={text} className="flex items-start gap-3 opacity-85">
                  <Icon className="mt-0.5 size-4 shrink-0 text-gold" />
                  {text}
                </li>
              ))}
            </ul>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-2 border border-white/40 px-7 py-3.5 text-xs tracking-[0.22em] uppercase"
            >
              Meet Tiffany <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="eyebrow">The process</p>
        <h2 className="mt-4 max-w-2xl text-4xl">A clear path from first call to closing day.</h2>
        <span className="rule-gold mt-6" />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.step} className="border border-border p-8">
              <div className="flex items-center justify-between">
                <s.icon className="size-6 text-gold" />
                <span className="font-display text-3xl text-muted-foreground/50">{s.step}</span>
              </div>
              <h3 className="mt-6 text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service areas */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow">Where I work</p>
            <h2 className="mt-4 text-4xl">Proudly serving the DFW metroplex.</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              From city condos to family suburbs and investment corridors, I know the neighborhoods,
              the schools, and the numbers  and I’ll help you find your fit.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3">
            {areas.map((a) => (
              <li
                key={a}
                className="flex items-center gap-2 border border-border bg-background px-5 py-3 text-xs tracking-[0.18em] uppercase"
              >
                <MapPin className="size-3.5 text-gold" /> {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_1fr]">
          <img
            src={portrait4}
            alt="Tiffany Durojaiye portrait"
            className="aspect-[4/5] w-full object-cover object-top"
            loading="lazy"
          />
          <div>
            <p className="eyebrow">Ready when you are</p>
            <h2 className="mt-4 text-4xl">Let’s talk about your next move.</h2>
            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Whether you’re searching for your dream home, selling for top dollar, hunting an
              investment property, or leasing  I’ll make the process seamless and stress-free.
            </p>
            <div className="mt-8 border border-border p-8">
              <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
                Call or text
              </p>
              <a href="tel:+13476919080" className="mt-2 block font-display text-3xl">
                +1 (347) 691-9080
              </a>
              <Link
                to="/contact"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
              >
                Send a message
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
