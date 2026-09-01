import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Phone, Mail, Instagram, MessageCircle, LinkIcon } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Tiffany Durojaiye | Kimah The Realtor" },
      {
        name: "description",
        content:
          "Call, text, WhatsApp, or email Tiffany Durojaiye to buy, sell, lease, or invest in Dallas–Fort Worth real estate.",
      },
      { property: "og:title", content: "Contact Kimah The Realtor" },
      {
        property: "og:description",
        content: "Reach Tiffany Durojaiye at +1 (347) 691-9080 for DFW real estate.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const channels = [
  {
    icon: Phone,
    label: "Call or text",
    value: "+1 (347) 691-9080",
    href: "tel:+13476919080",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Message on WhatsApp",
    href: "https://wa.me/13476919080",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@kimahtherealtor.com",
    href: "mailto:hello@kimahtherealtor.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@kimahtherealtor",
    href: "https://www.instagram.com/kimahtherealtor",
  },
  {
    icon: LinkIcon,
    label: "All links",
    value: "linktr.ee/Touringwithmariam",
    href: "https://linktr.ee/Touringwithmariam",
  },
];

function Contact() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await apiRequest("/public/inquiries", {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          interest: String(form.get("intent") || "general").toLowerCase(),
          message: form.get("message"),
        }),
      });
      setSent(true);
      e.currentTarget.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send your message");
    } finally {
      setSubmitting(false);
    }
  }

  const field =
    "mt-2 w-full border border-input bg-background px-4 py-3 text-sm outline-none focus:border-gold";
  const label = "text-xs tracking-[0.2em] text-muted-foreground uppercase";

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 pt-20 pb-10">
        <p className="eyebrow">Let’s connect</p>
        <h1 className="mt-5 text-5xl">Contact</h1>
        <span className="rule-gold mt-6" />
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Serving the Dallas–Fort Worth metroplex and surrounding communities. Tell me about your
          goals and I’ll follow up personally.
        </p>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 md:grid-cols-[1fr_1fr]">
        <div>
          <ul className="divide-y divide-border border-y border-border">
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-5 py-6 transition-colors hover:text-gold"
                >
                  <c.icon className="size-5 text-gold" />
                  <span>
                    <span className={label}>{c.label}</span>
                    <span className="mt-1 block text-lg">{c.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="border border-border p-8">
          <h2 className="text-3xl">Send a message</h2>
          {error && <p className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
          <div className="mt-8 space-y-6">
            <label className="hidden" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <div>
              <label className={label} htmlFor="name">
                Name
              </label>
              <input id="name" name="name" required className={field} />
            </div>
            <div>
              <label className={label} htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className={field} />
            </div>
            <div>
              <label className={label} htmlFor="phone">Phone</label>
              <input id="phone" name="phone" className={field} />
            </div>
            <div>
              <label className={label} htmlFor="intent">
                I’m looking to
              </label>
              <select id="intent" name="intent" className={field} defaultValue="Buy">
                <option>Buy</option>
                <option>Sell</option>
                <option>Lease</option>
                <option>Invest</option>
              </select>
            </div>
            <div>
              <label className={label} htmlFor="message">
                Details
              </label>
              <textarea id="message" name="message" rows={4} className={field} />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary px-7 py-3.5 text-xs tracking-[0.22em] text-primary-foreground uppercase disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send message"}
            </button>
            {sent && (
              <p className="text-sm text-muted-foreground">
                Your message has been received. Tiffany will follow up personally. You do not need to send another email.
              </p>
            )}
          </div>
        </form>
      </section>

      {/* What happens next */}
      <section className="surface-ink">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="eyebrow">What happens next</p>
          <h2 className="mt-4 max-w-2xl text-4xl">From message to move-in, here’s the flow.</h2>
          <span className="rule-gold mt-6" />
          <div className="mt-14 grid gap-px bg-white/10 md:grid-cols-3">
            {[
              [
                "01",
                "I reply personally",
                "Expect a call, text, or email back  usually the same day  to talk through your goals.",
              ],
              [
                "02",
                "We build your plan",
                "Budget, neighborhoods, timeline, and strategy mapped out before any touring begins.",
              ],
              [
                "03",
                "We make your move",
                "Tours, offers, negotiation, and closing  with proactive updates at every step.",
              ],
            ].map(([step, title, body]) => (
              <div key={step} className="bg-ink p-8">
                <span className="font-display text-3xl text-gold">{step}</span>
                <h3 className="mt-4 text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed opacity-70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-24">
        <p className="eyebrow">Common questions</p>
        <h2 className="mt-4 text-4xl">Before you reach out.</h2>
        <span className="rule-gold mt-6" />
        <div className="mt-12 divide-y divide-border border-y border-border">
          {[
            [
              "Which areas do you serve?",
              "The entire Dallas–Fort Worth metroplex and surrounding communities  Dallas, Fort Worth, Arlington, Plano, Frisco, McKinney, and beyond.",
            ],
            [
              "Do you work with first-time buyers?",
              "Absolutely. First-time buyers are some of my favorite clients  I’ll walk you through every step in plain English, from pre-approval to keys.",
            ],
            [
              "Can you help me lease a home or find tenants?",
              "Yes — I work with both tenants searching for a home and landlords who need qualified renters and clean paperwork.",
            ],
            [
              "What does it cost to work with you?",
              "It depends on the transaction. Reach out and I’ll explain exactly how compensation works for your situation  no surprises.",
            ],
          ].map(([q, a]) => (
            <details key={q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg">
                {q}
                <span className="text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
