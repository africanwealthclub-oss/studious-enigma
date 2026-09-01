import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  createListing,
  deleteListing,
  getAdminListings,
  getAdminTestimonials,
  getAdminPage,
  saveAdminPage,
  getAdminInquiries,
  updateInquiry,
  type Inquiry,
  getCurrentUser,
  login,
  logout,
  updateListing,
  updateTestimonial,
  type AdminUser,
  type Listing,
  type Testimonial,
  getListingImages,
  uploadListingImage,
  deleteListingImage,
  reorderListingImages,
  type ListingImage,
} from "@/lib/api";

export const Route = createFileRoute("/admin")({ component: AdminDashboard });

type Tab = "overview" | "listings" | "testimonials" | "pages" | "inquiries";

const inputClass = "w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";

/* ---------- Icons (inline, no dependency) ---------- */
function Icon({ path, className = "h-5 w-5" }: { path: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={path} />
    </svg>
  );
}
const icons = {
  overview: "M4 13h6V4H4v9Zm0 7h6v-5H4v5Zm10 0h6V11h-6v9Zm0-16v5h6V4h-6Z",
  listings: "M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5Z",
  testimonials: "M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10Z",
  pages: "M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm9 0v5h5M8 13h8M8 17h5",
  inquiries: "M4 4h16v12H7l-3 3V4Z",
  signOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  view: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13",
  plus: "M12 5v14M5 12h14",
};

function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [listings, setListings] = useState<Listing[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => undefined).finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    getAdminListings().then((r) => setListings(r.data)).catch(() => undefined);
    getAdminTestimonials().then((r) => setTestimonials(r.data)).catch(() => undefined);
    getAdminInquiries().then((r) => setInquiries(r.data)).catch(() => undefined);
  }, [user, tab]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading admin…
      </div>
    );
  }
  if (!user) return <Login onSuccess={setUser} />;

  async function signOut() {
    await logout();
    setUser(null);
  }

  const navItems: { key: Tab; label: string; icon: string; count?: number }[] = [
    { key: "overview", label: "Overview", icon: icons.overview },
    { key: "listings", label: "Listings", icon: icons.listings, count: listings.length },
    { key: "testimonials", label: "Testimonials", icon: icons.testimonials, count: testimonials.filter((t) => t.status === "pending").length || undefined },
    { key: "pages", label: "Pages", icon: icons.pages },
    { key: "inquiries", label: "Inquiries", icon: icons.inquiries, count: inquiries.filter((i) => i.status === "new").length || undefined },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-background">
        <div className="border-b border-border px-6 py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kimah The Realtor</p>
          <p className="mt-1 text-lg leading-tight">Admin</p>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); setError(""); setMessage(""); }}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                tab === item.key ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon path={item.icon} className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.count ? (
                <span className={`px-1.5 py-0.5 text-[11px] leading-none ${tab === item.key ? "bg-primary-foreground/20" : "bg-gold/20 text-gold"}`}>
                  {item.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-gold">
            <Icon path={icons.view} className="h-[18px] w-[18px]" /> View website
          </a>
          <button onClick={signOut} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-gold">
            <Icon path={icons.signOut} className="h-[18px] w-[18px]" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-background px-8 py-5">
          <h1 className="text-2xl capitalize">{tab}</h1>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </header>

        <main className="px-8 py-8">
          {error && <div className="mb-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
          {message && <div className="mb-6 border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}

          {tab === "overview" && (
            <Overview onNavigate={setTab} listings={listings} testimonials={testimonials} inquiries={inquiries} />
          )}
          {tab === "listings" && <Listings onError={setError} onMessage={setMessage} />}
          {tab === "testimonials" && <Testimonials onError={setError} onMessage={setMessage} />}
          {tab === "pages" && <PageEditor onError={setError} onMessage={setMessage} />}
          {tab === "inquiries" && <Inquiries onError={setError} onMessage={setMessage} />}
        </main>
      </div>
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: (user: AdminUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError("");
    try { onSuccess(await login(email, password)); }
    catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in"); }
    finally { setBusy(false); }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-6">
      <form onSubmit={submit} className="w-full max-w-md border border-border bg-background p-8 shadow-sm">
        <p className="eyebrow">Private area</p>
        <h1 className="mt-3 text-4xl">Admin sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">Use the owner account created on Trusthost.</p>
        {error && <p className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="mt-7 block text-xs uppercase tracking-[0.2em]">Email
          <input className={`${inputClass} mt-2`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mt-5 block text-xs uppercase tracking-[0.2em]">Password
          <input className={`${inputClass} mt-2`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button disabled={busy} className="mt-7 w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function StatTile({ label, value, onClick }: { label: string; value: number | string; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={!onClick} className="border border-border bg-background p-6 text-left transition-colors hover:border-gold disabled:hover:border-border">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-4xl">{value}</p>
    </button>
  );
}

function Overview({
  onNavigate, listings, testimonials, inquiries,
}: {
  onNavigate: (tab: Tab) => void;
  listings: Listing[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
}) {
  const activeListings = listings.filter((l) => l.status !== "draft").length;
  const pendingTestimonials = testimonials.filter((t) => t.status === "pending").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  return (
    <section>
      <h2 className="text-4xl">Manage your website content.</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <StatTile label="Active listings" value={activeListings} onClick={() => onNavigate("listings")} />
        <StatTile label="Testimonials awaiting review" value={pendingTestimonials} onClick={() => onNavigate("testimonials")} />
        <StatTile label="New inquiries" value={newInquiries} onClick={() => onNavigate("inquiries")} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">Recent inquiries</h3>
            <button onClick={() => onNavigate("inquiries")} className="text-xs uppercase tracking-[0.15em] text-gold">View all</button>
          </div>
          <div className="mt-5 divide-y divide-border">
            {inquiries.slice(0, 4).map((i) => (
              <div key={i.id} className="flex items-center justify-between py-3 text-sm">
                <span>{i.name}</span>
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{i.status}</span>
              </div>
            ))}
            {inquiries.length === 0 && <p className="py-3 text-sm text-muted-foreground">No inquiries yet.</p>}
          </div>
        </div>

        <div className="border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">Latest listings</h3>
            <button onClick={() => onNavigate("listings")} className="text-xs uppercase tracking-[0.15em] text-gold">View all</button>
          </div>
          <div className="mt-5 divide-y divide-border">
            {listings.slice(0, 4).map((l) => (
              <div key={l.id} className="flex items-center justify-between py-3 text-sm">
                <span>{l.title}</span>
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{l.status.replaceAll("_", " ")}</span>
              </div>
            ))}
            {listings.length === 0 && <p className="py-3 text-sm text-muted-foreground">No listings yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function Inquiries({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() { try { setItems((await getAdminInquiries()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load inquiries"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function changeStatus(id: number, status: Inquiry["status"]) { try { await updateInquiry(id, { status }); onMessage("Inquiry status updated."); await load(); } catch (e) { onError(e instanceof Error ? e.message : "Unable to update inquiry"); } }
  return (
    <section>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">Messages submitted through the public contact form appear here.</p>
      <div className="space-y-5">
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? (
          <div className="border border-border bg-background p-6 text-sm text-muted-foreground">No inquiries yet.</div>
        ) : items.map((item) => (
          <article key={item.id} className="border border-border bg-background p-6">
            <div className="flex flex-wrap justify-between gap-4">
              <div>
                <h3 className="text-xl">{item.name}</h3>
                <a href={`mailto:${item.email}`} className="text-sm text-gold">{item.email}</a>
                {item.phone && <span className="ml-3 text-sm text-muted-foreground">{item.phone}</span>}
              </div>
              <select className="border border-input bg-background px-3 py-2 text-xs uppercase tracking-[0.12em]" value={item.status} onChange={(e) => changeStatus(item.id, e.target.value as Inquiry["status"])}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam</option>
              </select>
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.interest} · {new Date(item.created_at).toLocaleString()}</p>
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{item.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PageEditor({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [pageKey, setPageKey] = useState("home");
  const [sectionKey, setSectionKey] = useState("hero");
  const [content, setContent] = useState('{\n  "headline": "",\n  "body": ""\n}');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const result = await getAdminPage(pageKey);
      const section = result.data.find((item) => item.section_key === sectionKey);
      setContent(section ? JSON.stringify(JSON.parse(section.content_json), null, 2) : '{\n  "headline": "",\n  "body": ""\n}');
    } catch (err) { onError(err instanceof Error ? err.message : "Unable to load page content"); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [pageKey, sectionKey]);
  async function save(e: FormEvent) {
    e.preventDefault();
    try { await saveAdminPage(pageKey, sectionKey, JSON.parse(content)); onMessage("Page content saved."); }
    catch (err) { onError(err instanceof Error ? err.message : "Content must be valid JSON"); }
  }
  return (
    <section>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Edit structured content stored in MySQL. The homepage currently reads the <code>home / hero</code> section and falls back to the existing copy when it is empty.
      </p>
      <form onSubmit={save} className="mt-8 max-w-3xl border border-border bg-background p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-xs uppercase tracking-[0.15em]">Page
            <select className={`${inputClass} mt-2`} value={pageKey} onChange={(e) => setPageKey(e.target.value)}>
              <option value="home">Home</option>
              <option value="about">About</option>
              <option value="contact">Contact</option>
            </select>
          </label>
          <label className="text-xs uppercase tracking-[0.15em]">Section key
            <input className={`${inputClass} mt-2`} value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} />
          </label>
        </div>
        <label className="mt-5 block text-xs uppercase tracking-[0.15em]">Content JSON
          <textarea className={`${inputClass} mt-2 min-h-64 font-mono text-xs`} value={content} onChange={(e) => setContent(e.target.value)} disabled={loading} />
        </label>
        <button className="mt-5 bg-gold px-5 py-3 text-xs uppercase tracking-[0.2em]">Save page content</button>
      </form>
    </section>
  );
}

/* ---------- Listings + image manager ---------- */

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function Listings({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Listing[]>([]);
  const [form, setForm] = useState<Partial<Listing>>({ status: "draft", state: "TX" });
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [slugTouched, setSlugTouched] = useState(false);

  async function load() { try { setItems((await getAdminListings()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load listings"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);

  function change(key: string, value: string) {
    setForm((old) => {
      const next: Record<string, unknown> = { ...old, [key]: value };
      // Keep the slug in sync with the title until the user edits it directly,
      // and never touch it once editing an existing listing (slug is locked then).
      if (key === "title" && !editing && !slugTouched) {
        next.slug = slugify(value);
      }
      return next as Partial<Listing>;
    });
    if (key === "slug") setSlugTouched(true);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    try {
      if (editing) { await updateListing(editing, form); onMessage("Listing updated."); }
      else {
        const created = await createListing(form);
        onMessage("Listing created. Add photos below.");
        setEditing((created as { id: number }).id);
        await load();
        return;
      }
      await load();
    } catch (err) { onError(err instanceof Error ? err.message : "Unable to save listing"); }
  }

  async function remove(id: number) {
    if (!confirm("Delete this listing?")) return;
    try { await deleteListing(id); onMessage("Listing deleted."); if (editing === id) { setEditing(null); setForm({ status: "draft", state: "TX" }); } await load(); }
    catch (e) { onError(e instanceof Error ? e.message : "Unable to delete listing"); }
  }

  function startNew() { setEditing(null); setForm({ status: "draft", state: "TX" }); setSlugTouched(false); }
  function startEdit(item: Listing) { setEditing(item.id); setForm(item); setSlugTouched(true); }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">Add homes for sale, lease, or investment, and manage their photos.</p>
        <button onClick={startNew} className="flex items-center gap-2 bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground">
          <Icon path={icons.plus} className="h-4 w-4" /> New listing
        </button>
      </div>

      <form onSubmit={save} className="mt-8 grid gap-4 border border-border bg-background p-6 md:grid-cols-2">
        <label className="text-xs uppercase tracking-[0.15em]">Title
          <input className={`${inputClass} mt-2`} value={form.title || ""} onChange={(e) => change("title", e.target.value)} required />
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Slug
          <input
            className={`${inputClass} mt-2 ${editing ? "text-muted-foreground" : ""}`}
            value={form.slug || ""}
            onChange={(e) => change("slug", slugify(e.target.value))}
            placeholder="generated from title"
            required
            disabled={!!editing}
          />
          <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground">
            {editing ? "Locked after creation." : "Auto-filled from the title — edit if you want a different URL."}
          </span>
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">City
          <input className={`${inputClass} mt-2`} value={form.city || ""} onChange={(e) => change("city", e.target.value)} required />
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Address
          <input className={`${inputClass} mt-2`} value={form.address || ""} onChange={(e) => change("address", e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Status
          <select className={`${inputClass} mt-2`} value={form.status || "draft"} onChange={(e) => change("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="for_sale">For sale</option>
            <option value="for_lease">For lease</option>
            <option value="investment">Investment</option>
          </select>
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Price label
          <input className={`${inputClass} mt-2`} placeholder="$450,000" value={form.price_label || ""} onChange={(e) => change("price_label", e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Price (numeric)
          <input type="number" min="0" step="1000" className={`${inputClass} mt-2`} placeholder="450000" value={form.price ?? ""} onChange={(e) => change("price", e.target.value)} />
          <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground">Used for sorting/filtering. The price label above is what visitors see.</span>
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Bedrooms
          <input type="number" min="0" step="1" className={`${inputClass} mt-2`} value={form.bedrooms ?? ""} onChange={(e) => change("bedrooms", e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Bathrooms
          <input type="number" min="0" step="0.5" className={`${inputClass} mt-2`} value={form.bathrooms ?? ""} onChange={(e) => change("bathrooms", e.target.value)} />
        </label>
        <label className="text-xs uppercase tracking-[0.15em]">Square feet
          <input type="number" min="0" step="1" className={`${inputClass} mt-2`} value={form.square_feet ?? ""} onChange={(e) => change("square_feet", e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em]">
          <input type="checkbox" checked={!!form.is_featured} onChange={(e) => setForm((old) => ({ ...old, is_featured: e.target.checked ? 1 : 0 }))} />
          Featured listing
        </label>
        <label className="text-xs uppercase tracking-[0.15em] md:col-span-2">Description
          <textarea className={`${inputClass} mt-2 min-h-24`} value={form.description || ""} onChange={(e) => change("description", e.target.value)} />
        </label>
        <div className="md:col-span-2">
          <button className="bg-gold px-5 py-3 text-xs uppercase tracking-[0.2em]">{editing ? "Update listing" : "Create listing"}</button>
          {editing && <button type="button" onClick={startNew} className="ml-3 border border-border px-5 py-3 text-xs uppercase tracking-[0.2em]">Cancel</button>}
        </div>
      </form>

      {editing && (
        <div className="mt-6">
          <ImageManager listingId={editing} onError={onError} />
        </div>
      )}

      <div className="mt-8 overflow-x-auto border border-border bg-background">
        {loading ? <p className="p-6 text-sm text-muted-foreground">Loading…</p> : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <tr><th className="p-4">Property</th><th className="p-4">Location</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0">
                  <td className="p-4">{item.title}<span className="block text-xs text-muted-foreground">{item.price_label || "Price on request"}</span></td>
                  <td className="p-4">{item.city}, {item.state}</td>
                  <td className="p-4 capitalize">{item.status.replaceAll("_", " ")}</td>
                  <td className="p-4">
                    <button onClick={() => startEdit(item)} className="mr-3 text-gold">Edit</button>
                    <button onClick={() => remove(item.id)} className="text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

function ImageManager({ listingId, onError }: { listingId: number; onError: (s: string) => void }) {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    try { setImages((await getListingImages(listingId)).data); }
    catch (e) { onError(e instanceof Error ? e.message : "Unable to load images"); }
  }
  useEffect(() => { load(); }, [listingId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        await uploadListingImage(listingId, file);
      }
      await load();
    } catch (e) { onError(e instanceof Error ? e.message : "Unable to upload image"); }
    finally { setUploading(false); }
  }

  async function remove(imageId: number) {
    try { await deleteListingImage(imageId); setImages((prev) => prev.filter((img) => img.id !== imageId)); }
    catch (e) { onError(e instanceof Error ? e.message : "Unable to delete image"); }
  }

  function onDragStart(id: number) {
    return (e: React.DragEvent) => e.dataTransfer.setData("text/plain", String(id));
  }
  async function onDrop(targetId: number) {
    return async (e: React.DragEvent) => {
      e.preventDefault();
      const draggedId = Number(e.dataTransfer.getData("text/plain"));
      if (draggedId === targetId) return;
      const current = [...images];
      const fromIndex = current.findIndex((i) => i.id === draggedId);
      const toIndex = current.findIndex((i) => i.id === targetId);
      if (fromIndex === -1 || toIndex === -1) return;
      const [moved] = current.splice(fromIndex, 1);
      current.splice(toIndex, 0, moved);
      setImages(current);
      try { await reorderListingImages(listingId, current.map((i) => i.id)); }
      catch (e) { onError(e instanceof Error ? e.message : "Unable to reorder images"); }
    };
  }

  return (
    <div className="border border-border bg-background p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Photos</h3>
        <span className="text-xs text-muted-foreground">Drag to reorder · first photo is the cover image</span>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInput.current?.click()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 border border-dashed px-6 py-8 text-center transition-colors ${
          dragOver ? "border-gold bg-gold/5" : "border-border hover:border-gold"
        }`}
      >
        <Icon path={icons.upload} className="h-6 w-6 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{uploading ? "Uploading…" : "Drop photos here, or click to browse"}</p>
        <p className="text-xs text-muted-foreground">JPG, PNG, or WEBP — up to 8MB each</p>
        <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>

      {images.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={onDragStart(img.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(img.id).then((fn) => fn(e))}
              className="group relative aspect-[4/3] cursor-grab border border-border bg-secondary/30"
            >
              <img src={img.image_url} alt="" className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute left-2 top-2 bg-gold px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-black">Cover</span>
              )}
              <button
                onClick={() => remove(img.id)}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete photo"
              >
                <Icon path={icons.trash} className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Testimonials({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() { try { setItems((await getAdminTestimonials()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load testimonials"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function moderate(id: number, status: Testimonial["status"]) { try { await updateTestimonial(id, { status, consent_to_publish: 1 }); onMessage(`Testimonial ${status}.`); await load(); } catch (e) { onError(e instanceof Error ? e.message : "Unable to update testimonial"); } }
  return (
    <section>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">Approve reviews here before they appear on the public testimonials page.</p>
      <div className="space-y-5">
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? (
          <div className="border border-border bg-background p-6 text-sm text-muted-foreground">No testimonials submitted yet.</div>
        ) : items.map((item) => (
          <article key={item.id} className="border border-border bg-background p-6">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h3 className="text-xl">{item.client_name}</h3>
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.client_type || "Client"}{item.city ? ` · ${item.city}` : ""}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.15em] text-gold">{item.status}</span>
            </div>
            <blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground">{item.body}</blockquote>
            <div className="mt-5 flex gap-3">
              <button onClick={() => moderate(item.id, "approved")} className="bg-gold px-4 py-2 text-xs uppercase tracking-[0.15em]">Approve</button>
              <button onClick={() => moderate(item.id, "rejected")} className="border border-border px-4 py-2 text-xs uppercase tracking-[0.15em]">Reject</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
