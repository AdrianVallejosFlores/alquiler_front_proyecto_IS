import type { CategoryDTO } from "@/lib/api/categories";
import type { PaymentMethodKey } from "@/types/payment";

const RAW_API = process.env.NEXT_PUBLIC_API_URL || "";
const API_BASE = RAW_API ? RAW_API.replace(/\/+$/, "") : "http://localhost:4000";
const FIXER_BASE = `${API_BASE}/api/fixers`;

type ApiSuccess<T> = { success: true; data: T } & Record<string, unknown>;
type ApiFailure = { success: false; message: string };

async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, init);
  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    // no json body
  }
  if (!res.ok) {
    const message = payload?.message || `Error HTTP ${res.status}`;
    throw new Error(message);
  }
  return payload;
}

export type FixerSkillDTO = {
  categoryId: string;
  customDescription?: string;
};

export type FixerSkillInfoDTO = {
  category: CategoryDTO;
  description: string;
  customDescription?: string;
  source: "personal" | "general";
};

export type FixerDTO = {
  id: string;
  userId: string;
  ci?: string;
  location?: { lat: number; lng: number; address?: string };
  categories?: string[];
  skills?: FixerSkillDTO[];
  categoriesInfo?: CategoryDTO[];
  skillsInfo?: FixerSkillInfoDTO[];
  paymentMethods?: ("card" | "qr" | "cash")[];
  paymentAccounts?: Record<string, { holder: string; accountNumber: string }>;
  termsAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
  name?: string;
  city?: string;
  photoUrl?: string;
  whatsapp?: string;
  bio?: string;
  jobsCount?: number;
  ratingAvg?: number;
  ratingCount?: number;
  memberSince?: string;
  workExperience?: WorkExperienceDTO;
  visualPortfolio?: VisualPortfolioDTO;
};

export type FixerWithCategoriesDTO = FixerDTO & {
  categoriesInfo: CategoryDTO[];
  skillsInfo?: FixerSkillInfoDTO[];
};

export type JobPositionDTO = {
  id: string;
  positionName: string;
  journeyType: string;
  organization?: string;
  isCurrent: boolean;
  startDate: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CertificationDTO = {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl: string;
  imageMeta: {
    mimeType: string;
    size: number;
    originalName?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type WorkExperienceDTO = {
  jobPositions: JobPositionDTO[];
  certifications: CertificationDTO[];
  updatedAt?: string;
};

export type PortfolioMediaDTO = {
  id: string;
  kind: "image" | "video";
  description?: string;
  order: number;
  imageUrl?: string;
  imageMeta?: {
    mimeType: string;
    size: number;
    originalName?: string;
    optimized?: boolean;
  };
  videoUrl?: string;
  videoId?: string;
  embedUrl?: string;
  provider?: "youtube";
  createdAt?: string;
  updatedAt?: string;
};

export type VisualPortfolioDTO = {
  media: PortfolioMediaDTO[];
  updatedAt?: string;
};

export type FixersByCategoryDTO = {
  category: CategoryDTO;
  total: number;
  fixers: FixerWithCategoriesDTO[];
};

export type UpdateCategoriesPayload = {
  categories: string[];
  skills?: FixerSkillDTO[];
  bio?: string;
};

export type JobPositionPayload = {
  positionName: string;
  journeyType: string;
  organization?: string;
  isCurrent: boolean;
  startDate: string; // ISO
  endDate?: string; // ISO
};

export type CertificationPayload = {
  name: string;
  issuer: string;
  issueDate: string; // ISO
  expirationDate?: string; // ISO
  credentialId?: string;
  credentialUrl?: string;
  file?: File;
};

export type PortfolioImagePayload = {
  description?: string;
  file: File;
};

export type PortfolioVideoPayload = {
  description?: string;
  videoUrl: string;
};

export async function checkCI(ci: string, excludeId?: string) {
  const url = new URL(`${FIXER_BASE}/check-ci`);
  url.searchParams.set("ci", ci);
  if (excludeId) url.searchParams.set("excludeId", excludeId);
  return request<{ success: true; unique: boolean; message: string }>(url.toString(), {
    cache: "no-store",
  });
}

export async function createFixer(payload: {
  userId: string;
  ci: string;
  city?: string;
  location?: { lat: number; lng: number; address?: string };
}): Promise<ApiSuccess<FixerDTO>> {
  return request<ApiSuccess<FixerDTO>>(`${FIXER_BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function getFixer(id: string): Promise<ApiSuccess<FixerDTO>> {
  return request<ApiSuccess<FixerDTO>>(`${FIXER_BASE}/${id}`, { cache: "no-store" });
}

export async function getFixerByUser(userId: string): Promise<FixerDTO | null> {
  const url = `${FIXER_BASE}/user/${userId}`;
  const res = await fetch(url, { cache: "no-store" });
  const payloadText = await res.text();
  const payload = payloadText ? (JSON.parse(payloadText) as Partial<ApiSuccess<FixerDTO>>) : null;
  if (res.status === 404) return null;
  if (!res.ok) {
    const message =
      (payload && typeof (payload as any).message === "string" ? (payload as any).message : null) ||
      `Error HTTP ${res.status}`;
    throw new Error(message);
  }
  return payload?.data ?? null;
}

export async function getFixersByCategory(search?: string): Promise<FixersByCategoryDTO[]> {
  const url = new URL(`${FIXER_BASE}/by-category`);
  const trimmed = search?.trim();
  if (trimmed) {
    url.searchParams.set("search", trimmed);
  }
  const response = await request<ApiSuccess<FixersByCategoryDTO[]>>(url.toString(), { cache: "no-store" });
  return response.data;
}

export async function updateIdentity(id: string, ci: string): Promise<ApiSuccess<FixerDTO>> {
  return request<ApiSuccess<FixerDTO>>(`${FIXER_BASE}/${id}/identity`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ci }),
  });
}

export async function updateLocation(id: string, location: { lat: number; lng: number; address?: string }) {
  return request<ApiSuccess<FixerDTO>>(`${FIXER_BASE}/${id}/location`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(location),
  });
}

export async function updateCategories(id: string, payload: UpdateCategoriesPayload) {
  return request<ApiSuccess<FixerDTO>>(`${FIXER_BASE}/${id}/categories`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updatePayments(
  id: string,
  payload: {
    methods: PaymentMethodKey[];
    accounts?: Partial<Record<PaymentMethodKey, { holder: string; accountNumber: string }>>;
  }
) {
  return request<ApiSuccess<FixerDTO>>(`${FIXER_BASE}/${id}/payments`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function acceptTerms(id: string) {
  return request<ApiSuccess<FixerDTO>>(`${FIXER_BASE}/${id}/terms`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accepted: true }),
  });
}

export async function getWorkExperience(fixerId: string): Promise<WorkExperienceDTO> {
  const response = await request<ApiSuccess<WorkExperienceDTO>>(`${FIXER_BASE}/${fixerId}/work-experience`, {
    cache: "no-store",
  });
  return response.data;
}

export async function createJobPosition(fixerId: string, payload: JobPositionPayload) {
  const response = await request<ApiSuccess<JobPositionDTO>>(`${FIXER_BASE}/${fixerId}/work-experience/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateJobPosition(fixerId: string, jobId: string, payload: JobPositionPayload) {
  const response = await request<ApiSuccess<JobPositionDTO>>(
    `${FIXER_BASE}/${fixerId}/work-experience/jobs/${jobId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  return response.data;
}

export async function deleteJobPosition(fixerId: string, jobId: string) {
  await request<ApiSuccess<{ message: string }>>(`${FIXER_BASE}/${fixerId}/work-experience/jobs/${jobId}`, {
    method: "DELETE",
  });
  return true;
}

function buildCertificationFormData(payload: CertificationPayload) {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("issuer", payload.issuer);
  form.append("issueDate", payload.issueDate);
  if (payload.expirationDate) form.append("expirationDate", payload.expirationDate);
  if (payload.credentialId) form.append("credentialId", payload.credentialId);
  if (payload.credentialUrl) form.append("credentialUrl", payload.credentialUrl);
  if (payload.file) form.append("file", payload.file);
  return form;
}

export async function createCertification(fixerId: string, payload: CertificationPayload & { file: File }) {
  const response = await request<ApiSuccess<CertificationDTO>>(
    `${FIXER_BASE}/${fixerId}/work-experience/certifications`,
    {
      method: "POST",
      body: buildCertificationFormData(payload),
    }
  );
  return response.data;
}

export async function updateCertification(
  fixerId: string,
  certificationId: string,
  payload: CertificationPayload
) {
  const response = await request<ApiSuccess<CertificationDTO>>(
    `${FIXER_BASE}/${fixerId}/work-experience/certifications/${certificationId}`,
    {
      method: "PUT",
      body: buildCertificationFormData(payload),
    }
  );
  return response.data;
}

export async function deleteCertification(fixerId: string, certificationId: string) {
  await request<ApiSuccess<{ message: string }>>(
    `${FIXER_BASE}/${fixerId}/work-experience/certifications/${certificationId}`,
    { method: "DELETE" }
  );
  return true;
}

export async function getPortfolio(fixerId: string): Promise<VisualPortfolioDTO> {
  const response = await request<ApiSuccess<VisualPortfolioDTO>>(`${FIXER_BASE}/${fixerId}/portfolio`, {
    cache: "no-store",
  });
  return response.data;
}

function buildPortfolioImageFormData(payload: Partial<PortfolioImagePayload>) {
  const form = new FormData();
  if (payload.description) form.append("description", payload.description);
  if (payload.file) form.append("file", payload.file);
  return form;
}

export async function addPortfolioImage(fixerId: string, payload: PortfolioImagePayload) {
  const response = await request<ApiSuccess<PortfolioMediaDTO>>(`${FIXER_BASE}/${fixerId}/portfolio/images`, {
    method: "POST",
    body: buildPortfolioImageFormData(payload),
  });
  return response.data;
}

export async function updatePortfolioImage(
  fixerId: string,
  mediaId: string,
  payload: Partial<PortfolioImagePayload>
) {
  const response = await request<ApiSuccess<PortfolioMediaDTO>>(
    `${FIXER_BASE}/${fixerId}/portfolio/images/${mediaId}`,
    {
      method: "PUT",
      body: buildPortfolioImageFormData(payload),
    }
  );
  return response.data;
}

export async function addPortfolioVideo(fixerId: string, payload: PortfolioVideoPayload) {
  const response = await request<ApiSuccess<PortfolioMediaDTO>>(`${FIXER_BASE}/${fixerId}/portfolio/videos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updatePortfolioVideo(
  fixerId: string,
  mediaId: string,
  payload: PortfolioVideoPayload
) {
  const response = await request<ApiSuccess<PortfolioMediaDTO>>(
    `${FIXER_BASE}/${fixerId}/portfolio/videos/${mediaId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  return response.data;
}

export async function deletePortfolioItem(fixerId: string, mediaId: string) {
  await request<ApiSuccess<{ message: string }>>(`${FIXER_BASE}/${fixerId}/portfolio/${mediaId}`, {
    method: "DELETE",
  });
  return true;
}

export async function reorderPortfolio(
  fixerId: string,
  items: { id: string; order: number }[]
): Promise<VisualPortfolioDTO> {
  const response = await request<ApiSuccess<VisualPortfolioDTO>>(
    `${FIXER_BASE}/${fixerId}/portfolio/reorder`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    }
  );
  return response.data;
}
