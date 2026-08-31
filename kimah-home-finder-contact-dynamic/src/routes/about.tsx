import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Home, TrendingUp, KeyRound, Handshake } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import logo from "@/assets/logo-main.png";
import portrait2 from "@/assets/tiffany-portrait-2.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Tiffany Durojaiye | Kimah The Realtor" },
      {
        name: "description",
        content:
          "Meet Tiffany Durojaiye, a Texas Realtor serving Dallas–Fort Worth buyers, sellers, investors, landlords, and tenants with honest, hands-on service.",
      },
      { property: "og:title", content: "About Tiffany Durojaiye | Kimah The Realtor" },
      {
        property: "og:description",
        content: "The story, philosophy, and service standard behind Kimah The Realtor.",
      },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  ["Honest guidance", "Straight answers, even when they aren’t the easy ones."],
  ["Proactive communication", "You’ll never wonder what’s happening with your deal."],
  ["Skilled negotiation", "Terms and dollars defended like they’re my own."],
  ["Support beyond closing", "A Realtor for this move and every one after it."],
];

const clients = [
  {
    icon: Home,
    title: "First-time buyers",
    body: "Patient, plain-English guidance from pre-approval to keys, no question is too small.",
  },
  {
    icon: TrendingUp,
    title: "Sellers & growing families",
    body: "Pricing strategy, staging advice, and marketing built to move your home for top dollar.",
  },
  {
    icon: Handshake,
    title: "Investors",
    body: "Deal analysis, rent projections, and off-market opportunities across the metroplex.",
  },
  {
    icon: KeyRound,
    title: "Landlords & tenants",
    body: "Leasing handled end-to-end: listings, screening, applications, and clean paperwork.",
  },
];

function About() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Intro / story */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16">
        <p className="eyebrow">Meet your Realtor</p>
        <h1 className="mt-5 max-w-3xl font-display text-5xl leading-tight sm:text-6xl">
          Tiffany Durojaiye
        </h1>
        <span className="rule-gold mt-6" />
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 text-[0.95rem] leading-relaxed text-muted-foreground">
          <p className="text-lg leading-relaxed text-foreground">
            Buying, selling, leasing, or investing in real estate is one of life’s biggest
            decisions, and you deserve a Realtor who is committed to protecting your best interests
            every step of the way.
          </p>
          <p>
            I’m Tiffany Durojaiye, a Texas Realtor serving the Dallas–Fort Worth metroplex and
            surrounding communities. I help first-time homebuyers, growing families, investors,
            landlords, and tenants achieve their real estate goals with confidence.
          </p>
          <p>
            My philosophy is simple: my job doesn’t end when the contract is signed. I believe in
            going above and beyond by providing honest guidance, proactive communication, skilled
            negotiation, and hands-on support from our first conversation through closing and
            beyond.
          </p>
          <p>
            Whether you’re searching for your dream home, selling for top dollar, looking for an
            investment property, or leasing a home, I’m committed to making the process as seamless
            and stress-free as possible.
          </p>
          <p>
            Real estate is more than a transaction. It’s about building wealth, creating
            opportunities, and helping people find a place to call home. My goal is to provide every
            client with exceptional service, transparency, and an experience that earns their trust
            for years to come.
          </p>
          <p className="text-foreground">
            If you’re ready to make your next move, I’d be honored to help you every step of the
            way.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
          >
            Work with me <ArrowRight className="size-4" />
          </Link>
        </div>

        <aside>
          <img
            src={portrait2}
            alt="Tiffany Durojaiye, Texas Realtor"
            className="w-full object-cover"
          />
          <div className="mt-6 flex items-center gap-4 border border-border p-6">
            <img
              src={logo}
              alt="Kimah The Realtor logo"
              className="h-16 w-16 object-contain"
              loading="lazy"
            />
            <p className="text-xs tracking-[0.25em] text-muted-foreground uppercase">
              Serving DFW &amp; surrounding areas
            </p>
          </div>
        </aside>
      </section>

      {/* Values */}
      <section className="surface-ink">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow">What I stand for</p>
          <h2 className="mt-4 max-w-2xl text-4xl">The standard behind every deal.</h2>
          <span className="rule-gold mt-6" />
          <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(([title, body]) => (
              <div key={title} className="bg-ink p-8">
                <h3 className="text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who I help */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="eyebrow">Who I help</p>
        <h2 className="mt-4 max-w-2xl text-4xl">Every client, every stage of the journey.</h2>
        <span className="rule-gold mt-6" />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((c) => (
            <div key={c.title} className="border border-border p-8">
              <c.icon className="size-6 text-gold" />
              <h3 className="mt-6 text-2xl">{c.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

    {/* CTA */}
<section className="border-t border-border bg-secondary">
  <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-16">
    <div>
      <p className="eyebrow">Let’s work together</p>
      <h2 className="mt-3 text-3xl sm:text-4xl">
        Your next move starts with a conversation.
      </h2>
    </div>

    <div className="flex flex-wrap gap-4">
      <a
        href="tel:+13476919080"
        className="inline-flex items-center gap-2 border border-foreground/30 px-7 py-3.5 text-xs tracking-[0.22em] uppercase"
      >
        +1 (347) 691-9080
      </a>

      <Link
        to="/contact"
        className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
      >
        Send a message <ArrowRight className="size-4" />
      </Link>
    </div>
  </div>
</section>


      <SiteFooter />
    </div>
  );
}
      
