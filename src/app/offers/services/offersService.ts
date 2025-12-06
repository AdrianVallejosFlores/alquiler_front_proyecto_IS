// Cliente de la API para HU9 (listado) y HU10 (detalle) + crear/editar/eliminar

export type OfferStatus = 'active' | 'inactive' | 'deleted';

export interface Offer {
  id: string;
  _id: string;
  ownerId?: string;
  title: string;
  description: string;
  category: string;
  contact: { whatsapp?: string; phone?: string; email?: string };
  createdAt: string;   // ISO
  status: OfferStatus;
  images?: string[];
  
  // ✅ AGREGADO: Campo opcional para compatibilidad con tu formulario
  isActive?: boolean; 
}

export interface ListOffersParams {
  query?: string;
  page?: number;
  pageSize?: number;
  includeInactive?: boolean;
  ownerId?: string;
}
export interface ListOffersResult { total: number; items: Offer[]; }

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000').replace(/\/$/, '');

function qs(params: Record<string, any>) {
  const url = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    url.set(k, String(v));
  });
  return url.toString();
}

function normalize(o: any): Offer {
  // Calculamos el status primero
  const status = (o?.status === 'inactive' || o?.status === 'deleted') ? o.status : 'active';
  
  return {
    id: String(o?.id ?? o?._id ?? ''),
    _id: String(o?._id ?? ''),
    ownerId: o?.ownerId ?? undefined,
    title: o?.title ?? o?.descripcion ?? 'Oferta sin título',
    description: o?.description ?? o?.descripcion ?? '',
    category: o?.category ?? o?.categoria ?? 'General',
    contact: o?.contact ?? {},
    createdAt: o?.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
    status: status,
    // ✅ AGREGADO: Mapeamos isActive basado en el status para que el frontend lo lea fácil
    isActive: status === 'active',
    images: Array.isArray(o?.images)
      ? o.images.filter((x: any) => typeof x === 'string')
      : (o?.imagen ? [String(o.imagen)] : []),
  };
}

// ---- HU9: Listado ----
export async function listOffers(params: ListOffersParams = {}): Promise<ListOffersResult> {
  const { query = '', page = 1, pageSize = 10, includeInactive = true, ownerId } = params;
  const url = `${API_BASE}/api/offers?${qs({ query, page, pageSize, includeInactive, ownerId })}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error al cargar ofertas');

  const data = await res.json();
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const items = rawItems.map(normalize);
  const total = typeof data.total === 'number' ? data.total : items.length;
  return { total, items };
}

// ---- HU10: Detalle ----
export async function getOfferById(id: string): Promise<Offer | null> {
  const res = await fetch(`${API_BASE}/api/offers/${id}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('No se pudo cargar la oferta');
  const o = await res.json();
  return normalize(o);
}

// ---- Permisos simulados
export function canEditOffer(offer: Offer, currentFixerId?: string | null): boolean {
  if (!currentFixerId) return false;
  return offer.ownerId === currentFixerId;
}

// ---- Crear oferta (JSON). Acepta imagen en base64 en `images: string[]`
type CreateOfferPayload = {
  id?: string;
  ownerId: string;
  title?: string;
  description?: string;
  category?: string;
  contact?: { whatsapp?: string; phone?: string; email?: string };
  images?: string[];
  // alias en español
  descripcion?: string;
  categoria?: string;
  
  // ✅ AGREGADO: Para que createOffer acepte el campo isActive
  isActive?: boolean;
};

export async function createOffer(input: CreateOfferPayload): Promise<Offer> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (input.ownerId) {
    headers['x-owner-id'] = input.ownerId;
  }

  // Conversión opcional: si tu backend espera 'status' en lugar de 'isActive'
  const payload = {
    ...input,
    status: input.isActive ? 'active' : 'inactive'
  };

  const res = await fetch(`${API_BASE}/api/offers`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload), // Enviamos el payload procesado
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => '');
    throw new Error(msg || 'No se pudo crear la oferta');
  }
  const o = await res.json();
  return normalize(o);
}

// ---- Editar (PUT)
export async function updateOffer(
  id: string,
  patch: Partial<{
    title: string;
    description: string;
    category: string;
    contact: { whatsapp?: string; phone?: string; email?: string };
    images: string[];
    status: OfferStatus;
    descripcion: string;
    categoria: string;
    
    // ✅ AGREGADO: Para que updateOffer acepte isActive
    isActive: boolean;
  }>,
  ownerId: string
): Promise<Offer> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (ownerId) headers['x-owner-id'] = ownerId;

  // Lógica para convertir isActive a status si viene en el patch
  const payload = { ...patch, ownerId };
  if (patch.isActive !== undefined) {
    payload.status = patch.isActive ? 'active' : 'inactive';
  }

  const res = await fetch(`${API_BASE}/api/offers/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('No se pudo editar la oferta');
  const o = await res.json();
  return normalize(o);
}

// ---- Eliminar (soft delete)
export async function deleteOffer(id: string, ownerId: string): Promise<void> {
  const headers: HeadersInit = {};
  if (ownerId) headers['x-owner-id'] = ownerId;
  const res = await fetch(`${API_BASE}/api/offers/${id}`, {
    method: 'DELETE',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ ownerId }),
  });
  if (!res.ok) throw new Error('No se pudo eliminar la oferta');
}