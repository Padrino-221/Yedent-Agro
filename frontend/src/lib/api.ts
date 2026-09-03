export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} for ${path}`);
  }
  const json = await res.json();
  return json.data as T;
}

export interface Subsidiary {
  id: string;
  name: string;
  slug: string;
  description: string;
  focus_area: string;
  logo_url: string | null;
  hero_image_url: string | null;
  tagline: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface ProductNutrition {
  nutrient: string;
  value: string | null;
  unit: string | null;
  category: 'macro' | 'micro';
  sort_order: number;
}

export interface PreparationStep {
  step_number: number;
  instruction: string;
}

export interface ProductVideo {
  video_url: string;
  title: string | null;
  sort_order: number;
}

export interface Product {
  id: string;
  subsidiary_id: string;
  /** Present on list responses (LEFT JOIN with subsidiaries). */
  subsidiary_name?: string | null;
  subsidiary_slug?: string | null;
  name: string;
  slug: string;
  description: string;
  sector: string;
  category: string | null;
  fda_registration: string | null;
  storage_instructions: string | null;
  allergens: string | null;
  net_weight: string | null;
  cover_image_url: string | null;
  video_url: string | null;
  sort_order: number;
  is_published: boolean;
  nutrition: ProductNutrition[];
  preparation_steps: PreparationStep[];
  images: { image_url: string; caption: string | null; sort_order: number }[];
  videos: ProductVideo[];
  subsidiary: { id: string; name: string; slug: string } | null;
}

export interface Department {
  id: string;
  subsidiary_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  head_of_department: string | null;
  sort_order: number;
  subsidiary_name: string | null;
  subsidiary_slug: string | null;
}

export interface SalesRep {
  id: string;
  subsidiary_id: string | null;
  name: string;
  region: string;
  territory: string | null;
  phone: string;
  email: string | null;
  sort_order: number;
  is_published: boolean;
  subsidiary_name: string | null;
  subsidiary_slug: string | null;
}

export interface Award {
  id: string;
  title: string;
  award_year: number;
  conferring_body: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  sort_order: number;
  is_published: boolean;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  cta_label: string | null;
  cta_href: string | null;
  slide_type: string;
  subsidiary_id: string | null;
  sort_order: number;
  is_published: boolean;
  subsidiary_name: string | null;
  subsidiary_slug: string | null;
}

export interface NewsEvent {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  type: 'news' | 'event';
  image_url: string | null;
  video_url: string | null;
  event_date: string | null;
  published_at: string | null;
  is_published: boolean;
}

export interface SiteSettings {
  [key: string]: string | null;
}

export async function getSubsidiaries(): Promise<Subsidiary[]> {
  return request<Subsidiary[]>('/subsidiaries');
}

export async function getProducts(
  filters: { sector?: string; subsidiary?: string } = {}
): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters.sector) params.set('sector', filters.sector);
  if (filters.subsidiary) params.set('subsidiary', filters.subsidiary);
  const qs = params.toString();
  return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const products = await request<Product[]>('/products');
  const product = products.find((p) => p.slug === slug);
  if (!product) throw new Error(`Product not found: ${slug}`);
  return request<Product>(`/products/${product.id}`);
}

export async function getDepartments(filters: { subsidiary?: string } = {}): Promise<Department[]> {
  const params = new URLSearchParams();
  if (filters.subsidiary) params.set('subsidiary', filters.subsidiary);
  const qs = params.toString();
  return request<Department[]>(`/departments${qs ? `?${qs}` : ''}`);
}

export async function getSalesReps(filters: { subsidiary?: string } = {}): Promise<SalesRep[]> {
  const params = new URLSearchParams();
  if (filters.subsidiary) params.set('subsidiary', filters.subsidiary);
  const qs = params.toString();
  return request<SalesRep[]>(`/sales-reps${qs ? `?${qs}` : ''}`);
}

export async function getAwards(): Promise<Award[]> {
  return request<Award[]>('/awards');
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    return await request<SiteSettings>('/settings');
  } catch {
    return {};
  }
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  return request<HeroSlide[]>('/hero-slides');
}

export async function getPartners(): Promise<Partner[]> {
  return request<Partner[]>('/partners');
}

export async function getNewsEvents(filters: { type?: 'news' | 'event'; limit?: string } = {}): Promise<NewsEvent[]> {
  const params = new URLSearchParams();
  if (filters.type) params.set('type', filters.type);
  if (filters.limit) params.set('limit', filters.limit);
  const qs = params.toString();
  return request<NewsEvent[]>(`/news${qs ? `?${qs}` : ''}`);
}