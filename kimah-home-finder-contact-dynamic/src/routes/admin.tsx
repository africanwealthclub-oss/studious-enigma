import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  createListing,
  deleteListing,
  getAdminListings,
  getAdminInquiries,
  updateInquiry,
  type Inquiry,
  getCurrentUser,
  login,
  logout,
  changeAdminPassword,
  updateListing,
  type AdminUser,
  type Listing,
  getListingImages,
  uploadListingImage,
  deleteListingImage,
  reorderListingImages,
  type ListingImage,
} from "@/lib/api";

export const Route = createFileRoute("/admin")({ component: AdminDashboard });

type Tab = "overview" | "listings" | "inquiries" | "account";

const inputClass = "w-full border border-input bg-background px-3 py-2 text-sm outline-none focus:border-gold";

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
  inquiries: "M4 4h16v12H7l-3 3V4Z",
  signOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  view: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13",
  plus: "M12 5v14M5 12h14",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
  star: "M12 3l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.3l6-.8L12 3Z",
  lock: "M6 11V8a6 6 0 1 1 12 0v3M5 11h14v9H5v-9Zm7 4v2",
};

type NavItem = { key: Tab; label: string; icon: string; count?: number };

function NavList({ navItems, tab, onSelect }: { navItems: NavItem[]; tab: Tab; onSelect: (t: Tab) => void }) {
  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {navItems.map((item) => (
        <button
          key={item.key}
          onClick={() => onSelect(item.key)}
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
  );
}

function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    getCurrentUser().then(setUser).catch(() => undefined).finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    getAdminListings().then((r) => setListings(r.data)).catch(() => undefined);
    getAdminInquiries().then((r) => setInquiries(r.data)).catch(() => undefined);
  }, [user, tab]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading admin...
      </div>
    );
  }
  if (!user) return <Login onSuccess={setUser} />;

  async function signOut() {
    await logout();
    setUser(null);
  }

  function selectTab(t: Tab) {
    setTab(t);
    setError("");
    setMessage("");
    setNavOpen(false);
  }

  const navItems: NavItem[] = [
    { key: "overview", label: "Overview", icon: icons.overview },
    { key: "listings", label: "Listings", icon: icons.listings, count: listings.length },
    { key: "inquiries", label: "Inquiries", icon: icons.inquiries, count: inquiries.filter((i) => i.status === "new").length || undefined },
    { key: "account", label: "Account", icon: icons.lock },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border bg-background px-4 py-3 md:hidden">
        <button onClick={() => setNavOpen(true)} aria-label="Open menu" className="p-2 -ml-2">
          <Icon path={icons.menu} className="h-5 w-5" />
        </button>
        <span className="text-sm capitalize">{tab}</span>
        <span className="w-9" />
      </div>

      {/* Mobile drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setNavOpen(false)} />
          <aside className="relative z-10 flex h-full w-72 max-w-[85vw] flex-col bg-background">
            <div className="flex items-center justify-between border-b border-border px-6 py-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kimah The Realtor</p>
                <p className="mt-1 text-lg leading-tight">Admin</p>
              </div>
              <button onClick={() => setNavOpen(false)} aria-label="Close menu" className="p-1">
                <Icon path={icons.close} className="h-5 w-5" />
              </button>
            </div>
            <NavList navItems={navItems} tab={tab} onSelect={selectTab} />
            <div className="border-t border-border p-3">
              <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-gold">
                <Icon path={icons.view} className="h-[18px] w-[18px]" /> View website
              </a>
              <button onClick={signOut} className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-gold">
                <Icon path={icons.signOut} className="h-[18px] w-[18px]" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-background">
        <div className="border-b border-border px-6 py-6">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Kimah The Realtor</p>
          <p className="mt-1 text-lg leading-tight">Admin</p>
        </div>
        <NavList navItems={navItems} tab={tab} onSelect={selectTab} />
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
      <div className="flex-1 pt-14 md:pt-0">
        <header className="hidden md:flex items-center justify-between border-b border-border bg-background px-8 py-5">
          <h1 className="text-2xl capitalize">{tab}</h1>
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">
          {error && <div className="mb-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
          {message && <div className="mb-6 border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800">{message}</div>}

          {tab === "overview" && (
            <Overview onNavigate={selectTab} listings={listings} inquiries={inquiries} />
          )}
          {tab === "listings" && <Listings onError={setError} onMessage={setMessage} />}
          {tab === "inquiries" && <Inquiries onError={setError} onMessage={setMessage} />}
          {tab === "account" && <Account user={user} onError={setError} onMessage={setMessage} />}
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
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4 sm:px-6">
      <form onSubmit={submit} className="w-full max-w-md border border-border bg-background p-6 sm:p-8 shadow-sm">
        <p className="eyebrow">Private area</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">Admin sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">Use the owner account created on Trusthost.</p>
        {error && <p className="mt-5 border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <label className="mt-7 block text-xs uppercase tracking-[0.2em]">Email
          <input className={`${inputClass} mt-2`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="mt-5 block text-xs uppercase tracking-[0.2em]">Password
          <input className={`${inputClass} mt-2`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button disabled={busy} className="mt-7 w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function StatTile({ label, value, onClick }: { label: string; value: number | string; onClick?: () => void }) {
  return (
    <button onClick={onClick} disabled={!onClick} className="border border-border bg-background p-5 sm:p-6 text-left transition-colors hover:border-gold disabled:hover:border-border">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="mt-3 text-3xl sm:text-4xl">{value}</p>
    </button>
  );
}

function Overview({
  onNavigate, listings, inquiries,
}: {
  onNavigate: (tab: Tab) => void;
  listings: Listing[];
  inquiries: Inquiry[];
}) {
  const activeListings = listings.filter((l) => l.status !== "draft").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  return (
    <section>
      <h2 className="text-3xl sm:text-4xl">Manage your website content.</h2>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <StatTile label="Active listings" value={activeListings} onClick={() => onNavigate("listings")} />
        <StatTile label="New inquiries" value={newInquiries} onClick={() => onNavigate("inquiries")} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="border border-border bg-background p-5 sm:p-6">
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

        <div className="border border-border bg-background p-5 sm:p-6">
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

function Account({
  user, onError, onMessage,
}: {
  user: AdminUser;
  onError: (s: string) => void;
  onMessage: (s: string) => void;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (newPassword.length < 8) {
      setFormError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("New password and confirmation don't match.");
      return;
    }

    setSaving(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      onMessage("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Unable to update password");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2 className="text-3xl sm:text-4xl">Account</h2>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Signed in as <span className="text-foreground">{user.email}</span>.
      </p>

      <div className="mt-8 max-w-md border border-border bg-background p-5 sm:p-6">
        <h3 className="text-lg">Change password</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          You'll stay signed in on this device after changing it.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {formError && (
            <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">{formError}</div>
          )}

          <label className="block text-xs uppercase tracking-[0.15em]">Current password
            <input
              type="password"
              autoComplete="current-password"
              className={`${inputClass} mt-2`}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </label>

          <label className="block text-xs uppercase tracking-[0.15em]">New password
            <input
              type="password"
              autoComplete="new-password"
              className={`${inputClass} mt-2`}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              required
            />
            <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground">
              At least 8 characters.
            </span>
          </label>

          <label className="block text-xs uppercase tracking-[0.15em]">Confirm new password
            <input
              type="password"
              autoComplete="new-password"
              className={`${inputClass} mt-2`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </label>

          <button disabled={saving} className="w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">
            {saving ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ---------- Inquiries + detail modal ---------- */

const inquiryStatusStyles: Record<Inquiry["status"], string> = {
  new: "bg-gold/15 text-gold",
  contacted: "bg-primary/10 text-primary",
  closed: "bg-secondary text-muted-foreground",
  spam: "bg-red-100 text-red-800",
};

function Inquiries({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Inquiry | null>(null);

  async function load() { try { setItems((await getAdminInquiries()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load inquiries"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);

  async function quickChangeStatus(id: number, status: Inquiry["status"], e: React.SyntheticEvent) {
    e.stopPropagation();
    try { await updateInquiry(id, { status }); onMessage("Inquiry status updated."); await load(); }
    catch (err) { onError(err instanceof Error ? err.message : "Unable to update inquiry"); }
  }

  async function afterSave() {
    await load();
  }

  return (
    <section>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">Messages submitted through the public contact form and listing pages appear here. Open one to read the full message and keep private follow-up notes.</p>
      <div className="space-y-4">
        {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : items.length === 0 ? (
          <div className="border border-border bg-background p-6 text-sm text-muted-foreground">No inquiries yet.</div>
        ) : items.map((item) => (
          <article
            key={item.id}
            onClick={() => setSelected(item)}
            className="cursor-pointer border border-border bg-background p-5 transition-colors hover:border-gold sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg leading-snug">{item.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${inquiryStatusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </div>
                <p className="mt-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {item.interest} - {new Date(item.created_at).toLocaleString()}
                </p>
              </div>

              <select
                className="border border-input bg-background px-3 py-2 text-xs uppercase tracking-[0.12em]"
                value={item.status}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => quickChangeStatus(item.id, e.target.value as Inquiry["status"], e)}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
                <option value="spam">Spam</option>
              </select>
            </div>

            <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.message}</p>

            {item.admin_notes && (
              <p className="mt-3 border-l-2 border-gold/60 pl-3 text-xs leading-relaxed text-muted-foreground">
                Note: {item.admin_notes}
              </p>
            )}

            <p className="mt-4 text-xs uppercase tracking-[0.15em] text-gold">View full inquiry -&gt;</p>
          </article>
        ))}
      </div>

      {selected && (
        <InquiryDetailModal
          inquiry={selected}
          onClose={() => setSelected(null)}
          onSaved={afterSave}
          onError={onError}
          onMessage={onMessage}
        />
      )}
    </section>
  );
}

function InquiryDetailModal({
  inquiry, onClose, onSaved, onError, onMessage,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (s: string) => void;
  onMessage: (s: string) => void;
}) {
  const [status, setStatus] = useState<Inquiry["status"]>(inquiry.status);
  const [notes, setNotes] = useState(inquiry.admin_notes || "");
  const [saving, setSaving] = useState(false);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  async function save() {
    setSaving(true);
    try {
      await updateInquiry(inquiry.id, { status, admin_notes: notes });
      onMessage("Inquiry updated.");
      await onSaved();
      onClose();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Unable to update inquiry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 sm:items-center">
      <div className="w-full max-w-xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Inquiry</p>
            <h2 className="mt-1 text-xl leading-snug">{inquiry.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-muted-foreground hover:text-gold">x</button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-4 sm:px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Email</p>
              <a href={`mailto:${inquiry.email}`} className="mt-1 block text-sm text-gold">{inquiry.email}</a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Phone</p>
              <p className="mt-1 text-sm">{inquiry.phone || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Interest</p>
              <p className="mt-1 text-sm capitalize">{inquiry.interest}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Received</p>
              <p className="mt-1 text-sm">{new Date(inquiry.created_at).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Message</p>
            <p className="mt-2 whitespace-pre-wrap border border-border bg-secondary/30 p-4 text-sm leading-relaxed text-foreground">
              {inquiry.message}
            </p>
          </div>

          <label className="mt-6 block text-xs uppercase tracking-[0.15em]">
            Status
            <select className={`${inputClass} mt-2`} value={status} onChange={(e) => setStatus(e.target.value as Inquiry["status"])}>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>
          </label>

          <label className="mt-5 block text-xs uppercase tracking-[0.15em]">
            Private follow-up notes
            <textarea
              className={`${inputClass} mt-2 min-h-28`}
              placeholder="e.g. Called on 9/2, sending comps for the Frisco listing next."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground">
              Only visible to you here in the admin dashboard - never shown to the visitor.
            </span>
          </label>

          <button disabled={saving} onClick={save} className="mt-7 w-full bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-50">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
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

const emptyListingForm: Partial<Listing> = { status: "draft", state: "TX", published: false };

function Listings({ onError, onMessage }: { onError: (s: string) => void; onMessage: (s: string) => void }) {
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  async function load() { try { setItems((await getAdminListings()).data); } catch (e) { onError(e instanceof Error ? e.message : "Unable to load listings"); } finally { setLoading(false); } }
  useEffect(() => { load(); }, []);

  async function remove(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Delete this listing?")) return;
    try { await deleteListing(id); onMessage("Listing deleted."); await load(); }
    catch (err) { onError(err instanceof Error ? err.message : "Unable to delete listing"); }
  }

  function openNew() { setEditing(null); setModalOpen(true); }
  function openEdit(item: Listing) { setEditing(item.id); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }
  async function afterSave() { await load(); }

  const statusStyles: Record<string, string> = {
    draft: "bg-secondary text-muted-foreground",
    for_sale: "bg-gold/15 text-gold",
    for_lease: "bg-primary/10 text-primary",
    investment: "bg-green-100 text-green-800",
  };

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl text-sm text-muted-foreground">Add homes for sale, lease, or investment, and manage their photos.</p>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary px-5 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground">
          <Icon path={icons.plus} className="h-4 w-4" /> New listing
        </button>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <div className="mt-8 border border-dashed border-border bg-background p-8 sm:p-12 text-center">
          <p className="text-sm text-muted-foreground">No listings yet.</p>
          <button onClick={openNew} className="mt-4 bg-gold px-5 py-2.5 text-xs uppercase tracking-[0.2em]">Create your first listing</button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.id}
              onClick={() => openEdit(item)}
              className="group cursor-pointer border border-border bg-background transition-colors hover:border-gold"
            >
              <div className="relative aspect-[4/3] bg-secondary/40">
                {item.image_url ? (
                  <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.15em] text-muted-foreground">No photo</div>
                )}
                <span className={`absolute left-3 top-3 px-2 py-1 text-[10px] uppercase tracking-[0.1em] ${statusStyles[item.status] || "bg-secondary text-muted-foreground"}`}>
                  {item.status.replaceAll("_", " ")}
                </span>
                {!!item.is_featured && (
                  <span className="absolute right-3 top-3 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-white">Featured</span>
                )}
                {!item.published_at && (
                  <span className="absolute bottom-3 left-3 bg-black/70 px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-white">Unpublished</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg leading-snug">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.city}, {item.state}</p>
                <p className="mt-3 text-sm">{item.price_label || "Price on request"}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs uppercase tracking-[0.15em] text-gold opacity-0 transition-opacity group-hover:opacity-100">Edit -&gt;</span>
                  <button onClick={(e) => remove(item.id, e)} className="text-xs uppercase tracking-[0.15em] text-red-700">Delete</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen && (
        <ListingModal
          listingId={editing}
          initial={editing ? items.find((i) => i.id === editing) ?? null : null}
          onClose={closeModal}
          onSaved={afterSave}
          onError={onError}
          onMessage={onMessage}
        />
      )}
    </section>
  );
}

function ListingModal({
  listingId, initial, onClose, onSaved, onError, onMessage,
}: {
  listingId: number | null;
  initial: Listing | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
  onError: (s: string) => void;
  onMessage: (s: string) => void;
}) {
  const [form, setForm] = useState<Partial<Listing>>(
    initial ? { ...initial, published: !!initial.published_at } : emptyListingForm
  );
  const [currentId, setCurrentId] = useState<number | null>(listingId);
  const [slugTouched, setSlugTouched] = useState(!!listingId);
  const [saving, setSaving] = useState(false);

  function change(key: string, value: string) {
    setForm((old) => {
      const next: Record<string, unknown> = { ...old, [key]: value };
      if (key === "title" && !currentId && !slugTouched) {
        next.slug = slugify(value);
      }
      return next as Partial<Listing>;
    });
    if (key === "slug") setSlugTouched(true);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentId) {
        await updateListing(currentId, form);
        onMessage("Listing updated.");
        await onSaved();
      } else {
        const created = await createListing(form);
        onMessage("Listing created. Add photos below.");
        setCurrentId((created as { id: number }).id);
        await onSaved();
      }
    } catch (err) { onError(err instanceof Error ? err.message : "Unable to save listing"); }
    finally { setSaving(false); }
  }

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div onClick={handleOverlayClick} className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 sm:items-center">
      <div className="w-full max-w-2xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-5">
          <h2 className="text-xl">{currentId ? "Edit listing" : "New listing"}</h2>
          <button onClick={onClose} aria-label="Close" className="text-2xl leading-none text-muted-foreground hover:text-gold">x</button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto px-4 sm:px-6 py-6">
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs uppercase tracking-[0.15em]">Title
              <input className={`${inputClass} mt-2`} value={form.title || ""} onChange={(e) => change("title", e.target.value)} required />
            </label>
            <label className="text-xs uppercase tracking-[0.15em]">Slug
              <input
                className={`${inputClass} mt-2 ${currentId ? "text-muted-foreground" : ""}`}
                value={form.slug || ""}
                onChange={(e) => change("slug", slugify(e.target.value))}
                placeholder="generated from title"
                required
                disabled={!!currentId}
              />
              <span className="mt-1 block text-[11px] normal-case tracking-normal text-muted-foreground">
                {currentId ? "Locked after creation." : "Auto-filled from the title - edit if you want a different URL."}
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
            <label className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gold">
              <input
                type="checkbox"
                checked={!!form.published}
                onChange={(e) => setForm((old) => ({ ...old, published: e.target.checked }))}
              />
              Publish to website
            </label>
            <label className="text-xs uppercase tracking-[0.15em] sm:col-span-2">Description
              <textarea className={`${inputClass} mt-2 min-h-24`} value={form.description || ""} onChange={(e) => change("description", e.target.value)} />
            </label>
            <div className="sm:col-span-2">
              <button disabled={saving} className="w-full sm:w-auto bg-gold px-5 py-3 text-xs uppercase tracking-[0.2em] disabled:opacity-50">
                {saving ? "Saving..." : currentId ? "Update listing" : "Create listing"}
              </button>
            </div>
          </form>

          {currentId && (
            <div className="mt-6">
              <ImageManager listingId={currentId} onError={onError} />
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-border px-4 sm:px-6 py-4">
          <button onClick={onClose} className="border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em]">
            {currentId ? "Done" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageManager({ listingId, onError }: { listingId: number; onError: (s: string) => void }) {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function load() {
    try { setImages((await getListingImages(listingId)).data); }
    catch (e) { onError(e instanceof Error ? e.message : "Unable to load images"); }
  }
  useEffect(() => { load(); }, [listingId]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setUploading(true);
    setUploadProgress({ done: 0, total: list.length });
    try {
      for (let i = 0; i < list.length; i++) {
        await uploadListingImage(listingId, list[i]);
        setUploadProgress({ done: i + 1, total: list.length });
      }
      await load();
    } catch (e) {
      onError(e instanceof Error ? e.message : "Unable to upload image");
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function remove(imageId: number) {
    try { await deleteListingImage(imageId); setImages((prev) => prev.filter((img) => img.id !== imageId)); }
    catch (e) { onError(e instanceof Error ? e.message : "Unable to delete image"); }
  }

  async function setAsCover(imageId: number) {
    const current = [...images];
    const fromIndex = current.findIndex((i) => i.id === imageId);
    if (fromIndex <= 0) return;
    const [moved] = current.splice(fromIndex, 1);
    current.unshift(moved);
    setImages(current);
    try { await reorderListingImages(listingId, current.map((i) => i.id)); }
    catch (e) { onError(e instanceof Error ? e.message : "Unable to update cover photo"); }
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
    <div className="border border-border bg-background p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">Photos {images.length > 0 && <span className="text-sm text-muted-foreground">({images.length})</span>}</h3>
        <span className="text-xs text-muted-foreground hidden sm:inline">Drag, or use "Set as cover" - first photo is the cover image</span>
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
        <p className="text-sm text-muted-foreground">
          {uploading
            ? `Uploading ${uploadProgress?.done ?? 0} of ${uploadProgress?.total ?? 0}...`
            : "Drop photos here, or click to browse - select as many as you like at once"}
        </p>
        <p className="text-xs text-muted-foreground">JPG, PNG, or WEBP - up to 8MB each</p>
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
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/70 px-2 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 ? (
                  <button
                    onClick={() => setAsCover(img.id)}
                    className="flex items-center gap-1 text-[10px] uppercase tracking-[0.08em] text-white hover:text-gold"
                  >
                    <Icon path={icons.star} className="h-3.5 w-3.5" />
                    Set cover
                  </button>
                ) : <span />}
                <button
                  onClick={() => remove(img.id)}
                  className="flex h-6 w-6 items-center justify-center text-white hover:text-red-400"
                  aria-label="Delete photo"
                >
                  <Icon path={icons.trash} className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
