import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
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
} from "@/lib/api";

export const Route = createFileRoute("/admin")({ component: AdminDashboard });

type Tab = "overview" | "listings" | "testimonials" | "pages" | "inquiries";

const inputClass = "w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";

function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => undefined).finally(() => setChecking(false));
  }, []);

  if (checking) return <div className="flex min-h-screen items-center justify-center">Loading admin…</div>;
  if (!user) return <Login onSuccess={setUser} />;

  async function signOut() {
    await logout();
    setUser(null);
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div><p className="eyebrow">Kimah The Realtor</p><h1 className="mt-1 text-2xl">Admin dashboard</h1></div>
          <div className="flex items-center gap-4 text-sm"><span className="text-muted-foreground">{user.email}</span><button onClick={signOut} className="border border-border px-4 py-2 hover:border-gold">Sign out</button></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit border border-border bg-background p-3">
          {(["overview", "listings", "testimonials", "pages", "inquiries"] as Tab[]).map((item) => <button key={item} onClick={() => { setTab(item); setError(""); setMessage(""); }} className={`block w-full px-4 py-3 text-left text-sm capitalize ${tab === item ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>{item}</button>)}
          <a href="/" className="mt-4 block border-t border-border px-4 pt-4 text-sm text-muted-foreground hover:text-gold">View website →</a>
        </aside>
        <main>
          {error && <div className="mb-5 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
          {message && <div className="mb-5 border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}
          {tab === "overview" && <Overview onNavigate={setTab} />}
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
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: FormEvent) { e.preventDefault(); setBusy(true); setError(""); try { onSuccess(await login(email, password)); } catch (err) { setError(err instanceof Error ? err.message : "Unable to sign in"); } finally { setBusy(false); } }
  return <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-6"><form onSubmit={submit} className="w-full max-w-md border border-border bg-background p-8 shadow-sm"><p className="eyebrow">Private area</p><h1 className="mt-3 text-4xl">Admin sign in</h1><p className="mt-3 text-sm text-muted-foreground">Use the owner account created on Trusthost.</p>{error && <p className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}<label className="mt-7 block text-xs uppercase tracking-[0.2em]">Email<input className={`${inputClass} mt-2`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label><label className="mt-5 block text-xs uppercase tracking-[0.2em]">Password<input className={`${inputClass} mt-2`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label><button disabled={busy} className="mt-7 w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button></form></div>;
}

function Overview({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  return <section><p className="eyebrow">Overview</p><h2 className="mt-3 text-4xl">Manage your website content.</h2><div className="mt-8 grid gap-5 md:grid-cols-3"><button onClick={() => onNavigate("listings")} className="border border-border bg-background p-6 text-left hover:border-gold"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Content</p><h3 className="mt-3 text-2xl">Listings</h3><p className="mt-2 text-sm text-muted-foreground">Add homes for sale, lease, or investment.</p></button><button onClick={() => onNavigate("testimonials")} className="border border-border bg-background p-6 text-left hover:border-gold"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Moderation</p><h3 className="mt-3 text-2xl">Testimonials</h3><p className="mt-2 text-sm text-muted-foreground">Approve client reviews before they appear publicly.</p></button><div className="border border-border bg-background p-6"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Next phase</p><h3 className="mt-3 text-2xl">Pages & settings</h3><p className="mt-2 text-sm text-muted-foreground">Connect home, about, contact, and site settings after the core content flow.</p></div></div></section>;
}

function Inquiries({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  async function load() { try { setItems((await getAdminInquiries()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load inquiries"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function changeStatus(id: number, status: Inquiry["status"]) { try { await updateInquiry(id, { status }); onMessage("Inquiry status updated."); await load(); } catch (e) { onError(e instanceof Error ? e.message : "Unable to update inquiry"); } }
  return <section><p className="eyebrow">Leads</p><h2 className="mt-3 text-4xl">Inquiries</h2><p className="mt-4 max-w-2xl text-sm text-muted-foreground">Messages submitted through the public contact form appear here.</p><div className="mt-8 space-y-5">{loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? <div className="border border-border bg-background p-6 text-sm text-muted-foreground">No inquiries yet.</div> : items.map((item) => <article key={item.id} className="border border-border bg-background p-6"><div className="flex flex-wrap justify-between gap-4"><div><h3 className="text-xl">{item.name}</h3><a href={`mailto:${item.email}`} className="text-sm text-gold">{item.email}</a>{item.phone && <span className="ml-3 text-sm text-muted-foreground">{item.phone}</span>}</div><select className="border border-input bg-background px-3 py-2 text-xs uppercase tracking-[0.12em]" value={item.status} onChange={(e) => changeStatus(item.id, e.target.value as Inquiry["status"])}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option><option value="spam">Spam</option></select></div><p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.interest} · {new Date(item.created_at).toLocaleString()}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{item.message}</p></article>)}</div></section>;
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
  return <section><p className="eyebrow">Content management</p><h2 className="mt-3 text-4xl">Dynamic pages</h2><p className="mt-4 max-w-2xl text-sm text-muted-foreground">Edit structured content stored in MySQL. The homepage currently reads the <code>home / hero</code> section and falls back to the existing copy when it is empty.</p><form onSubmit={save} className="mt-8 max-w-3xl border border-border bg-background p-6"><div className="grid gap-4 md:grid-cols-2"><label className="text-xs uppercase tracking-[0.15em]">Page<select className={`${inputClass} mt-2`} value={pageKey} onChange={(e) => setPageKey(e.target.value)}><option value="home">Home</option><option value="about">About</option><option value="contact">Contact</option></select></label><label className="text-xs uppercase tracking-[0.15em]">Section key<input className={`${inputClass} mt-2`} value={sectionKey} onChange={(e) => setSectionKey(e.target.value)} /></label></div><label className="mt-5 block text-xs uppercase tracking-[0.15em]">Content JSON<textarea className={`${inputClass} mt-2 min-h-64 font-mono text-xs`} value={content} onChange={(e) => setContent(e.target.value)} disabled={loading} /></label><button className="mt-5 bg-gold px-5 py-3 text-xs uppercase tracking-[0.2em]">Save page content</button></form></section>;
}

function Listings({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Listing[]>([]); const [form, setForm] = useState<Partial<Listing>>({ status: "draft", state: "TX" }); const [editing, setEditing] = useState<number | null>(null); const [loading, setLoading] = useState(true);
  async function load() { try { setItems((await getAdminListings()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load listings"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  function change(key: string, value: string) { setForm((old) => ({ ...old, [key]: value })); }
  async function save(e: FormEvent) { e.preventDefault(); try { if (editing) await updateListing(editing, form); else await createListing(form); setForm({ status: "draft", state: "TX" }); setEditing(null); onMessage("Listing saved."); await load(); } catch (err) { onError(err instanceof Error ? err.message : "Unable to save listing"); } }
  async function remove(id: number) { if (!confirm("Delete this listing?")) return; try { await deleteListing(id); onMessage("Listing deleted."); await load(); } catch (e) { onError(e instanceof Error ? e.message : "Unable to delete listing"); } }
  return <section><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Content</p><h2 className="mt-3 text-4xl">Listings</h2></div><button onClick={() => { setEditing(null); setForm({ status: "draft", state: "TX" }); }} className="bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground">New listing</button></div><form onSubmit={save} className="mt-8 grid gap-4 border border-border bg-background p-6 md:grid-cols-2"><label className="text-xs uppercase tracking-[0.15em]">Title<input className={`${inputClass} mt-2`} value={form.title || ""} onChange={(e) => change("title", e.target.value)} required /></label><label className="text-xs uppercase tracking-[0.15em]">Slug<input className={`${inputClass} mt-2`} value={form.slug || ""} onChange={(e) => change("slug", e.target.value)} required={!editing} disabled={!!editing} /></label><label className="text-xs uppercase tracking-[0.15em]">City<input className={`${inputClass} mt-2`} value={form.city || ""} onChange={(e) => change("city", e.target.value)} required /></label><label className="text-xs uppercase tracking-[0.15em]">Address<input className={`${inputClass} mt-2`} value={form.address || ""} onChange={(e) => change("address", e.target.value)} /></label><label className="text-xs uppercase tracking-[0.15em]">Status<select className={`${inputClass} mt-2`} value={form.status || "draft"} onChange={(e) => change("status", e.target.value)}><option value="draft">Draft</option><option value="for_sale">For sale</option><option value="for_lease">For lease</option><option value="investment">Investment</option></select></label><label className="text-xs uppercase tracking-[0.15em]">Price label<input className={`${inputClass} mt-2`} placeholder="$450,000" value={form.price_label || ""} onChange={(e) => change("price_label", e.target.value)} /></label><label className="text-xs uppercase tracking-[0.15em] md:col-span-2">Description<textarea className={`${inputClass} mt-2 min-h-24`} value={form.description || ""} onChange={(e) => change("description", e.target.value)} /></label><div className="md:col-span-2"><button className="bg-gold px-5 py-3 text-xs uppercase tracking-[0.2em]">{editing ? "Update listing" : "Create listing"}</button>{editing && <button type="button" onClick={() => { setEditing(null); setForm({ status: "draft", state: "TX" }); }} className="ml-3 border border-border px-5 py-3 text-xs uppercase tracking-[0.2em]">Cancel</button>}</div></form><div className="mt-8 overflow-x-auto border border-border bg-background">{loading ? <p className="p-6 text-sm text-muted-foreground">Loading…</p> : <table className="w-full text-left text-sm"><thead className="border-b border-border text-xs uppercase tracking-[0.15em] text-muted-foreground"><tr><th className="p-4">Property</th><th className="p-4">Location</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b border-border last:border-0"><td className="p-4">{item.title}<span className="block text-xs text-muted-foreground">{item.price_label || "Price on request"}</span></td><td className="p-4">{item.city}, {item.state}</td><td className="p-4 capitalize">{item.status.replaceAll("_", " ")}</td><td className="p-4"><button onClick={() => { setEditing(item.id); setForm(item); }} className="mr-3 text-gold">Edit</button><button onClick={() => remove(item.id)} className="text-red-700">Delete</button></td></tr>)}</tbody></table>}</div></section>;
}

function Testimonials({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Testimonial[]>([]); const [loading, setLoading] = useState(true);
  async function load() { try { setItems((await getAdminTestimonials()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load testimonials"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function moderate(id: number, status: Testimonial["status"]) { try { await updateTestimonial(id, { status, consent_to_publish: 1 }); onMessage(`Testimonial ${status}.`); await load(); } catch (e) { onError(e instanceof Error ? e.message : "Unable to update testimonial"); } }
  return <section><p className="eyebrow">Moderation</p><h2 className="mt-3 text-4xl">Testimonials</h2><p className="mt-4 max-w-2xl text-sm text-muted-foreground">Approve reviews here before they appear on the public testimonials page.</p><div className="mt-8 space-y-5">{loading ? <p className="text-sm text-muted-foreground">Loading…</p> : items.length === 0 ? <div className="border border-border bg-background p-6 text-sm text-muted-foreground">No testimonials submitted yet.</div> : items.map((item) => <article key={item.id} className="border border-border bg-background p-6"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="text-xl">{item.client_name}</h3><p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.client_type || "Client"}{item.city ? ` · ${item.city}` : ""}</p></div><span className="text-xs uppercase tracking-[0.15em] text-gold">{item.status}</span></div><blockquote className="mt-5 text-sm leading-relaxed text-muted-foreground">{item.body}</blockquote><div className="mt-5 flex gap-3"><button onClick={() => moderate(item.id, "approved")} className="bg-gold px-4 py-2 text-xs uppercase tracking-[0.15em]">Approve</button><button onClick={() => moderate(item.id, "rejected")} className="border border-border px-4 py-2 text-xs uppercase tracking-[0.15em]">Reject</button></div></article>)}</div></section>;
}
