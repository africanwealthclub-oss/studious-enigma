import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bath,
  BedDouble,
  Ruler,
  MapPin,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getPublicListing, type ListingDetail } from "@/lib/api";
import { ListingInquiryModal } from "@/components/listing-inquiry-modal";

export const Route = createFileRoute("/listings/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replaceAll("-", " ")} | Kimah The Realtor` },
      {
        name: "description",
        content:
          "Full property details, photos, and pricing from Kimah The Realtor, Tiffany Durojaiye, serving Dallas–Fort Worth.",
      },
    ],
  }),
  component: ListingDetailPage,
});

function displayStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function ListingDetailPage() {
  const { slug } = Route.useParams();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    setActiveIndex(0);
    getPublicListing(slug)
      .then((result) => setListing(result.data))
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Unable to load this property",
        ),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  const images = listing?.images ?? [];
  const hasImages = images.length > 0;

  function prevImage() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }
  function nextImage() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold"
        >
          <ArrowLeft className="size-4" />
          Back to listings
        </Link>
      </section>

      {loading && (
        <p className="mx-auto max-w-6xl px-4 py-16 text-sm text-muted-foreground sm:px-6">
          Loading property...
        </p>
      )}

      {!loading && error && (
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </p>
          <Link
            to="/listings"
            className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold"
          >
            View all listings
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}

      {!loading && !error && listing && (
        <>
          {/* Gallery */}
          <section className="mx-auto mt-6 max-w-6xl px-4 sm:mt-8 sm:px-6">
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary sm:aspect-[16/9]">
              {hasImages ? (
                <img
                  src={images[activeIndex].image_url}
                  alt={images[activeIndex].alt_text || listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Photo coming soon
                </div>
              )}

              <span className="absolute left-4 top-4 bg-ink px-3 py-2 text-[10px] tracking-[0.18em] text-white uppercase">
                {displayStatus(listing.status)}
              </span>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-black/60 text-white hover:bg-black/80"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-black/60 text-white hover:bg-black/80"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                  <span className="absolute bottom-3 right-3 bg-black/70 px-2.5 py-1 text-[11px] text-white">
                    {activeIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-16 w-24 shrink-0 overflow-hidden border-2 sm:h-20 sm:w-28 ${
                      index === activeIndex ? "border-gold" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `${listing.title} photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Details */}
          <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 md:grid-cols-[1.6fr_1fr]">
            <div>
              <span className="eyebrow">{displayStatus(listing.status)}</span>

              <h1 className="mt-3 text-3xl sm:text-4xl">{listing.title}</h1>

              <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {listing.address ? `${listing.address}, ` : ""}
                {listing.city}, {listing.state}
              </p>

              <p className="mt-6 font-display text-3xl">
                {listing.price_label ||
                  (listing.price
                    ? `$${Number(listing.price).toLocaleString()}`
                    : "Price on request")}
              </p>

              <div className="mt-6 flex flex-wrap gap-6 border-y border-border py-5 text-sm text-muted-foreground">
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

              <div className="mt-8">
                <p className="eyebrow">About this property</p>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                  {listing.description ||
                    "Contact Tiffany for more property details."}
                </p>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="h-fit border border-border p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Interested in this home?
              </p>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Send a request and Tiffany will follow up personally with
                availability, financing options, and next steps.
              </p>

              <button
                onClick={() => setInquiryOpen(true)}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-xs uppercase tracking-[0.22em] text-primary-foreground"
              >
                Request details
                <ArrowRight className="size-4" />
              </button>

              <a
                href="tel:+13476919080"
                className="mt-4 flex items-center justify-center gap-2 border border-border px-6 py-3.5 text-xs uppercase tracking-[0.22em] hover:border-gold"
              >
                <PhoneCall className="size-4" />
                +1 (347) 691-9080
              </a>
            </div>
          </section>
        </>
      )}

      <SiteFooter />

      {listing && inquiryOpen && (
        <ListingInquiryModal
          listing={listing}
          onClose={() => setInquiryOpen(false)}
        />
      )}
    </div>
  );
}
