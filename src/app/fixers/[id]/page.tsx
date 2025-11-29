import { getFixer } from "@/lib/api/fixer";
import Link from "next/link";
import FixerOwnerActions from "../components/FixerOwnerActions";
import FixerSkillsList from "../components/FixerSkillsList";
import Calendario from "@/app/agenda_proveedor/components/calendario";
import TrabajosAgendadosWidget from "@/app/epic_VisualizadorDeTrabajosAgendadosVistaProveedor/page";

// --- INTERFACES (Sin cambios) ---
interface FixerSkill {
  id?: string;
  categoryId?: string;
  name?: string;
  description?: string;
  customDescription?: string;
  category?: { id: string; name: string };
}
interface FixerCategory { id?: string; name?: string; description?: string; }
interface FixerData {
  name?: string;
  city?: string;
  jobsCount?: number | string;
  ratingAvg?: number | string;
  memberSince?: string;
  createdAt?: string;
  paymentMethods?: string[];
  bio?: string;
  whatsapp?: string;
  photoUrl?: string;
  skillsInfo?: FixerSkill[];
  categoriesInfo?: FixerCategory[];
  categories?: string[];
}
type PageProps = { params: Promise<{ id: string }> };

// --- FUNCIONES AUXILIARES (Sin cambios) ---
function calculateTimeSince(iso?: string) {
  if (!iso) return "N/D";
  const startDate = new Date(iso);
  if (Number.isNaN(startDate.getTime())) return "N/D";
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  let years = now.getFullYear() - startDate.getFullYear();
  let months = now.getMonth() - startDate.getMonth();
  let days = now.getDate() - startDate.getDate();
  if (days < 0) { months--; const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0); days += prevMonth.getDate(); }
  if (months < 0) { years--; months += 12; }
  if (years > 0) return `Hace ${years} año${years > 1 ? "s" : ""}, ${months} mes${months > 1 ? "es" : ""} y ${days} día${days > 1 ? "s" : ""}`;
  if (months > 0) return `Hace ${months} mes${months > 1 ? "es" : ""} y ${days} día${days > 1 ? "s" : ""}`;
  if (diffDays > 1) return `Hace ${diffDays} días`;
  if (diffDays === 1) return `Hace 1 día`;
  return "Hoy";
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <div className="inline-flex items-center gap-1 text-yellow-500">
      {Array.from({ length: full }).map((_, i) => <span key={`full-${i}`}>&#9733;</span>)}
      {half ? <span>&#9734;</span> : null}
      {Array.from({ length: empty }).map((_, i) => <span key={`empty-${i}`} className="text-slate-300">&#9733;</span>)}
    </div>
  );
}

function whatsappLink(phone?: string, msg?: string) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d]/g, "");
  const text = encodeURIComponent(msg ?? "Hola, vi tu perfil en Servineo y me interesa contactarte.");
  return `https://wa.me/${digits}?text=${text}`;
}

// --- COMPONENTE PRINCIPAL ---

export default async function FixerDetailPage({ params }: PageProps) {
  const { id } = await params;
  let data: FixerData | null = null;
  try {
    const res = await getFixer(id);
    data = (res?.data as FixerData) ?? null;
  } catch {}

  const name = data?.name ?? "Juan Pérez";
  const city = data?.city ?? "Cochabamba";
  const jobsCount = Number(data?.jobsCount ?? 45);
  const rating = Number(data?.ratingAvg ?? 4.4);
  const memberSince = data?.memberSince ?? data?.createdAt ?? new Date(2019, 7, 28).toISOString();
  const methods: string[] = Array.isArray(data?.paymentMethods) ? data.paymentMethods : ["cash", "qr", "card"];
  const bio = data?.bio?.trim() || null;
  const hasBio = bio !== null && bio.length > 0;
  const phone = data?.whatsapp ?? "+59170123456";
  const photoUrl = data?.photoUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=E5E7EB&color=111827&size=128`;
  
  const defaultSkills = ["Carpintería", "Albañil", "Plomero"];
  const skillsInfo = Array.isArray(data?.skillsInfo) ? data.skillsInfo : [];
  const categoriesInfo = Array.isArray(data?.categoriesInfo) ? data.categoriesInfo : [];
  const rawCategories = Array.isArray(data?.categories) && data.categories.length ? data.categories : defaultSkills;

  type SkillDisplay = { id: string; name: string; general: string; personal?: string; source: "personal" | "general"; };

  const skillsDetails: SkillDisplay[] = skillsInfo.length
    ? skillsInfo.map((skill) => ({
        id: skill?.category?.id ?? skill?.categoryId ?? skill?.id ?? "",
        name: skill?.category?.name ?? skill?.name ?? "Oficio",
        general: (skill?.description ?? "").trim() || "Sin descripción disponible.",
        personal: (skill?.customDescription ?? "").trim() || undefined,
        source: (skill?.customDescription ?? "").trim() ? "personal" : "general",
      }))
    : categoriesInfo.length
    ? categoriesInfo.map((category) => ({
        id: category?.id ?? "",
        name: category?.name ?? "Oficio",
        general: (category?.description ?? "").trim() || "Sin descripción disponible.",
        source: "general" as const,
      }))
    : rawCategories.map((name: string, index: number) => ({
        id: `${index}`,
        name,
        general: "Descripción no disponible.",
        source: "general" as const,
      }));

  const skillTags = Array.from(new Set(skillsDetails.map((item) => item.name)));
  const mainProfession = skillTags.length > 0 ? skillTags[0] : "Fixer Profesional";
  const wa = whatsappLink(phone);

  return (
    // ✅ CAMBIO 1: Agregamos !scroll-smooth al contenedor principal para asegurar la animación
    // Si usas Tailwind v3+, scroll-smooth funciona. Si no, necesitarás CSS global.
    <div className="mx-auto max-w-5xl px-4 py-6 scroll-smooth">
      
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-800">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/convertirse-fixer" className="hover:text-slate-800">Convertirse en fixer</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">Sobre el fixer</span>

        {/* ✅ CAMBIO 2: Nuevos enlaces de navegación interna */}
        <span className="mx-2">/</span>
        <a href="#seccion-disponibilidad" className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
            Disponibilidad
        </a>
        <span className="mx-2">/</span>
        <a href="#seccion-trabajos" className="text-slate-500 hover:text-blue-600 transition-colors cursor-pointer">
            Trabajos Agendados
        </a>
      </nav>

      {/* --- CAJA 1: Perfil --- */}
      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[160px_1fr]">
         {/* ... (Contenido del perfil sin cambios) ... */}
         <div className="flex flex-col items-center gap-4">
          <img src={photoUrl} alt={`Foto de ${name}`} className="h-36 w-36 rounded-full object-cover ring-1 ring-slate-200" />
          <div className="text-center">
            <div className="text-xl font-semibold text-slate-900">{name}</div>
            <div className="text-slate-500">{city}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Trabajos registrados</div>
            <div className="text-2xl font-semibold text-slate-900">{jobsCount}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Calificación</div>
            <div className="flex items-center gap-2">
              <Stars value={rating} />
              <span className="text-slate-700">{rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">En servicio desde</div>
            <div className="text-slate-900">{calculateTimeSince(memberSince)}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-1 text-sm text-slate-500">Rubros</div>
            <div className="text-slate-900">{skillTags.length ? skillTags.join(", ") : "Sin información"}</div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-1 text-sm text-slate-500">Métodos de pago</div>
            <div className="text-slate-900">
              {methods.length ? methods.map((m) => (<span key={m} className="mr-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{m === "cash" ? "Efectivo" : m === "qr" ? "QR" : "Tarjeta"}</span>)) : "N/D"}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-2 text-sm text-slate-500">Sobre mí</div>
            {hasBio ? (<div className="rounded-lg bg-slate-50 p-4 text-slate-800">{bio}</div>) : (<div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm"><p className="font-medium mb-1">Este fixer aún no ha agregado una descripción personal.</p></div>)}
          </div>
          <div className="rounded-xl border border-slate-200 p-4 md:col-span-3">
            <div className="mb-2 text-sm text-slate-500">Mis habilidades</div>
            <FixerSkillsList initialSkills={skillsDetails} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 font-medium text-white shadow hover:brightness-95">
             <span>Enviar WhatsApp</span>
          </a>
        ) : (
          <button className="cursor-not-allowed rounded-full bg-slate-300 px-5 py-3 text-white opacity-70" disabled>WhatsApp no disponible</button>
        )}
      </div>

      {/* --- CAJA 2: Calendario --- */}
      {/* ✅ CAMBIO 3: Agregamos id="seccion-disponibilidad" y scroll-mt-24 para compensar si hay header fijo */}
      <div id="seccion-disponibilidad" className="mt-8 scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <Calendario
          proveedorId={id}
          nombreProveedor={name}
          profesionProveedor={mainProfession}
        />
      </div>

      {/* --- CAJA 3: Historial de Trabajos --- */}
      {/* ✅ CAMBIO 4: Agregamos id="seccion-trabajos" */}
      <div id="seccion-trabajos" className="mt-8 scroll-mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <TrabajosAgendadosWidget proveedorId={id} />
      </div>

      <FixerOwnerActions
        fixerId={id}
        currentBio={bio}
        skills={skillsDetails.map((skill) => ({ id: skill.id, name: skill.name, general: skill.general, personal: skill.personal, source: skill.source, }))}
      />
    </div>
  );
}