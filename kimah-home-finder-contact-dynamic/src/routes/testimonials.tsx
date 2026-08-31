import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Quote, Star, ArrowRight, ShieldCheck, Clock3, HeartHandshake } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { apiRequest, type Testimonial } from "@/lib/api";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Reviews | Kimah The Realtor" },
      {
        name: "description",
        content:
          "Read client experiences with Tiffany Durojaiye and leave your own review of your DFW buying, selling, or leasing journey.",
      },
      { property: "og:title", content: "Client Reviews | Kimah The Realtor" },
      {
        property: "og:description",
        content: "Client experiences with Tiffany Durojaiye, Kimah The Realtor.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});


const promises = [
  {
    icon: ShieldCheck,
    title: "Honest, always",
    body: "Straight answers and transparent advice — even when it’s not what you expected to hear.",
  },
  {
    icon: Clock3,
    title: "Responsive, always",
    body: "Calls returned, texts answered, and updates before you have to ask for them.",
  },
  {
    icon: HeartHandshake,
    title: "In your corner, always",
    body: "From first tour to closing day and beyond, your best interests come first.",
  },
];

function Testimonials() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ data: Testimonial[] }>("/public/testimonials")
      .then((result) => setReviews(result.data))
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load testimonials"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Intro */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <p className="eyebrow">Client experiences</p>
        <h1 className="mt-5 text-5xl">Testimonials</h1>
        <span className="rule-gold mt-6" />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Real words from buyers, sellers, investors, landlords, and tenants across the Dallas–Fort
          Worth metroplex. Every review below comes from a client I’ve personally worked with.
        </p>
      </section>

      {/* Reviews grid */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {loading && <p className="col-span-full text-sm text-muted-foreground">Loading client experiences…</p>}
        {error && <p className="col-span-full border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {!loading && !error && reviews.length === 0 && <p className="col-span-full border border-border p-8 text-sm text-muted-foreground">Client reviews will appear here after they are approved.</p>}
        {reviews.map((r) => (
          <figure key={r.id} className="border border-border p-8">
            <Quote className="size-6 text-gold" />
            <blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground">
              {r.body}
            </blockquote>
            <div className="mt-6 flex gap-1">
              {Array.from({ length: r.rating || 5 }).map((_, s) => (
                <Star key={s} className="size-4 fill-gold text-gold" />
              ))}
            </div>
            <figcaption className="mt-4">
              <span className="block text-lg">{r.client_name}</span>
              <span className="block text-xs tracking-[0.2em] text-muted-foreground uppercase">
                {r.client_type || "Client"}{r.city ? ` · ${r.city}` : ""}
              </span>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Service promise */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow">The experience</p>
          <h2 className="mt-4 max-w-2xl text-4xl">What every client can expect.</h2>
          <span className="rule-gold mt-6" />
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {promises.map((p) => (
              <div key={p.title} className="border border-border bg-background p-8">
                <p.icon className="size-6 text-gold" />
                <h3 className="mt-6 text-2xl">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leave a review */}
      <section className="surface-ink">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="eyebrow">Worked with me?</p>
          <h2 className="mt-4 text-4xl">Leave a review</h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed opacity-75">
            Share this page with clients — it’s the link to send. Reviews are submitted by email and
            featured here once approved. A few sentences about your experience is perfect.
          </p>
          <a
            href="mailto:hello@kimahtherealtor.com?subject=My%20review%20for%20Kimah%20The%20Realtor&body=Your%20name%3A%0AType%20of%20transaction%20(buy%2Fsell%2Flease%2Finvest)%3A%0AYour%20review%3A%0A"
            className="mt-9 inline-flex items-center gap-2 bg-gold px-8 py-4 text-xs tracking-[0.22em] text-accent-foreground uppercase"
          >
            Submit your review <ArrowRight className="size-4" />
          </a>
          <p className="mt-6 text-xs tracking-[0.2em] uppercase opacity-50">
            kimahtherealtor.com/testimonials
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-16">
        <div>
          <p className="eyebrow">Your story next</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">Ready for a five-star move of your own?</h2>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase"
        >
          Get started <ArrowRight className="size-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
