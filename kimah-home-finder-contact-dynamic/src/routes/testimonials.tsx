import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Quote,
  Star,
  ArrowRight,
  ShieldCheck,
  Clock3,
  HeartHandshake,
} from "lucide-react";
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
          "Read client experiences with Tiffany Durojaiye and discover what clients say about their DFW buying, selling, leasing, and investment journeys.",
      },
      {
        property: "og:title",
        content: "Client Reviews | Kimah The Realtor",
      },
      {
        property: "og:description",
        content:
          "Client experiences with Tiffany Durojaiye, Kimah The Realtor.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/testimonials" },
    ],
    links: [{ rel: "canonical", href: "/testimonials" }],
  }),
  component: Testimonials,
});

const mockTestimonials: Testimonial[] = [
  {
    id: "mock-1",
    client_name: "Jasmine R.",
    client_type: "Home Buyer",
    city: "Frisco",
    body: "Tiffany made buying our first home feel so much less overwhelming. She was patient, responsive, and always explained our options clearly. We felt confident every step of the way.",
    rating: 5,
  },
  {
    id: "mock-2",
    client_name: "Marcus & Danielle T.",
    client_type: "Home Sellers",
    city: "Dallas",
    body: "From pricing our home to negotiating the final offer, Tiffany was completely in our corner. Her communication was excellent and she helped us navigate the entire process with confidence.",
    rating: 5,
  },
  {
    id: "mock-3",
    client_name: "Andre W.",
    client_type: "Investor",
    city: "Fort Worth",
    body: "Tiffany understands that an investment property has to make sense beyond the purchase price. She helped me evaluate the numbers, understand the market, and find an opportunity that fit my goals.",
    rating: 5,
  },
];

const promises = [
  {
    icon: ShieldCheck,
    title: "Honest, always",
    body: "Straight answers and transparent advice  even when it’s not what you expected to hear.",
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
  const [reviews, setReviews] = useState<Testimonial[]>(mockTestimonials);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<{ data: Testimonial[] }>("/public/testimonials")
      .then((result) => {
        if (result.data?.length) {
          setReviews(result.data);
        }
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load testimonials",
        );
      })
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
          Real experiences from buyers, sellers, investors, landlords, and
          tenants across the Dallas–Fort Worth metroplex.
        </p>
      </section>

      {/* Reviews grid */}
      <section className="mx-auto grid max-w-6xl gap-8 px-6 pb-20 md:grid-cols-2 lg:grid-cols-3">
        {loading && (
          <p className="col-span-full text-sm text-muted-foreground">
            Loading client experiences…
          </p>
        )}

        {error && (
          <p className="col-span-full border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </p>
        )}

        {reviews.map((r) => (
          <figure
            key={r.id}
            className="flex h-full flex-col border border-border p-8"
          >
            <Quote className="size-6 text-gold" />

            <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-muted-foreground">
              “{r.body}”
            </blockquote>

            <div className="mt-6 flex gap-1">
              {Array.from({ length: r.rating || 5 }).map((_, s) => (
                <Star
                  key={s}
                  className="size-4 fill-gold text-gold"
                />
              ))}
            </div>

            <figcaption className="mt-4">
              <span className="block text-lg">{r.client_name}</span>

              <span className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {r.client_type || "Client"}
                {r.city ? ` · ${r.city}` : ""}
              </span>
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Service promise */}
      <section className="border-y border-border bg-secondary">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow">The experience</p>

          <h2 className="mt-4 max-w-2xl text-4xl">
            What every client can expect.
          </h2>

          <span className="rule-gold mt-6" />

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {promises.map((p) => (
              <div
                key={p.title}
                className="border border-border bg-background p-8"
              >
                <p.icon className="size-6 text-gold" />

                <h3 className="mt-6 text-2xl">{p.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-6 py-16">
        <div>
          <p className="eyebrow">Your story next</p>

          <h2 className="mt-3 text-3xl sm:text-4xl">
            Ready for a five-star move of your own?
          </h2>
        </div>

        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-primary px-7 py-3.5 text-xs uppercase tracking-[0.22em] text-primary-foreground"
        >
          Get started
          <ArrowRight className="size-4" />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
