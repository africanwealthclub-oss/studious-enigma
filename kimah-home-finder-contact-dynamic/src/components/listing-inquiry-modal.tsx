import { useState, type FormEvent, type MouseEvent } from "react";
import { submitInquiry, type Listing } from "@/lib/api";

export function interestForStatus(status: string): string {
  if (status === "for_lease") return "lease";
  if (status === "investment") return "invest";
  return "buy";
}

export function ListingInquiryModal({
  listing,
  onClose,
}: {
  listing: Listing;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function handleOverlayClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const contextLine = `Inquiry about: ${listing.title} - ${listing.city}, ${listing.state} (listing #${listing.id})`;

      const message = note.trim()
        ? `${contextLine}\n\n${note.trim()}`
        : contextLine;

      await submitInquiry({
        name,
        email,
        phone: phone || undefined,
        interest: interestForStatus(listing.status),
        message,
      });

      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send your request",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 sm:items-center"
    >
      <div className="w-full max-w-md border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Request details
            </p>

            <h2 className="mt-1 text-lg leading-snug">{listing.title}</h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-muted-foreground hover:text-gold"
          >
            x
          </button>
        </div>

        <div className="px-5 py-6 sm:px-6">
          {sent ? (
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Thank you - your request about {listing.title} has been
                received. Tiffany will follow up shortly.
              </p>

              <button
                onClick={onClose}
                className="mt-6 w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <p className="border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                  {error}
                </p>
              )}

              <label className="block text-xs uppercase tracking-[0.15em]">
                Name
                <input
                  className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.15em]">
                Email
                <input
                  type="email"
                  className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.15em]">
                Phone
                <input
                  type="tel"
                  className="mt-2 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>

              <label className="block text-xs uppercase tracking-[0.15em]">
                Message
                <textarea
                  className="mt-2 min-h-24 w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold"
                  placeholder="Anything specific you'd like to know?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
