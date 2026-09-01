export type AdminUser = { id: number; email: string; role: "owner" | "editor" };

export type Listing = {
  id: number;
  slug: string;
  title: string;
  address?: string | null;
  city: string;
  state?: string;
  status: string;
  price?: number | null;
  price_label?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_feet?: number | null;
  description?: string | null;
  is_featured?: number;
  published_at?: string | null;
  published?: boolean;
  image_url?: string | null;
};

export type ListingImage = {
  id: number;
  listing_id: number;
  image_url: string;
  sort_order: number;
};

export type Testimonial = {
  id: number;
  client_name: string;
  client_type?: string | null;
  city?: string | null;
  body: string;
  rating: number;
  consent_to_publish: number;
  status: "pending" | "approved" | "rejected" | "hidden";
  published_at?: string | null;
};

const baseUrl = "https://api.kimahtherealtor.com/api";
let csrfToken = "";

export function setCsrfToken(token?: string | null) {
  csrfToken = token || "";
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
      ...(options.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload as T;
}

async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: formData,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload as T;
}

export async function getCurrentUser() {
  const result = await apiRequest<{ user: AdminUser; csrf_token: string }>("/auth/me");
  setCsrfToken(result.csrf_token);
  return result.user;
}

export async function login(email: string, password: string) {
  const result = await apiRequest<{ user: AdminUser; csrf_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setCsrfToken(result.csrf_token);
  return result.user;
}

export async function logout() {
  await apiRequest("/auth/logout", { method: "POST" });
  setCsrfToken("");
}

export async function getAdminListings() {
  return apiRequest<{ data: Listing[] }>("/admin/listings");
}

export async function createListing(input: Partial<Listing>) {
  return apiRequest<{ id: number }>("/admin/listings", { method: "POST", body: JSON.stringify(input) });
}

export async function updateListing(id: number, input: Partial<Listing> & { published?: boolean }) {
  return apiRequest<{ ok: boolean }>(`/admin/listings/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

export async function deleteListing(id: number) {
  return apiRequest<{ ok: boolean }>(`/admin/listings/${id}`, { method: "DELETE" });
}

export async function getListingImages(listingId: number) {
  return apiRequest<{ data: ListingImage[] }>(`/admin/listings/${listingId}/images`);
}

export async function uploadListingImage(listingId: number, file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return apiUpload<ListingImage>(`/admin/listings/${listingId}/images`, formData);
}

export async function deleteListingImage(imageId: number) {
  return apiRequest<{ ok: boolean }>(`/admin/listings/images/${imageId}`, { method: "DELETE" });
}

export async function reorderListingImages(listingId: number, order: number[]) {
  return apiRequest<{ ok: boolean }>(`/admin/listings/${listingId}/images/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ order }),
  });
}

export async function getAdminTestimonials() {
  return apiRequest<{ data: Testimonial[] }>("/admin/testimonials");
}

export type PageSections = Record<string, Record<string, unknown> | string | string[]>;

export async function getPublicPage(pageKey: string) {
  return apiRequest<{ data: PageSections }>(`/public/pages/${pageKey}`);
}

export async function getPublicSettings() {
  return apiRequest<{ data: Record<string, unknown> }>("/public/settings");
}

export type Inquiry = { id: number; name: string; email: string; phone?: string | null; interest: string; message: string; status: "new" | "contacted" | "closed" | "spam"; admin_notes?: string | null; created_at: string };

export async function getAdminInquiries() {
  return apiRequest<{ data: Inquiry[] }>("/admin/inquiries");
}

export async function updateInquiry(id: number, input: { status: Inquiry["status"]; admin_notes?: string }) {
  return apiRequest<{ ok: boolean }>(`/admin/inquiries/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}

// Public contact-form / listing-inquiry submission
export async function submitInquiry(input: { name: string; email: string; phone?: string; interest: string; message: string }) {
  return apiRequest<{ message: string }>("/public/inquiries", { method: "POST", body: JSON.stringify(input) });
}

export async function getAdminPage(pageKey: string) {
  return apiRequest<{ data: Array<{ section_key: string; content_json: string; is_published: number }> }>(`/admin/pages/${pageKey}`);
}

export async function saveAdminPage(pageKey: string, sectionKey: string, content: unknown, isPublished = true) {
  return apiRequest<{ ok: boolean }>(`/admin/pages/${pageKey}`, { method: "PUT", body: JSON.stringify({ section_key: sectionKey, content, is_published: isPublished }) });
}

export async function updateTestimonial(id: number, input: Partial<Testimonial>) {
  return apiRequest<{ ok: boolean }>(`/admin/testimonials/${id}`, { method: "PATCH", body: JSON.stringify(input) });
}
