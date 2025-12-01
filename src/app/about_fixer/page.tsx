'use client';

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Header from "./components/Header";
import WorkExperienceSection from "./components/WorkExperienceSection";
import VisualPortfolioSection from "./components/VisualPortfolioSection";
import { useClientSession } from "@/lib/auth/useSession";
import { getFixer, getFixerByUser, type FixerDTO } from "@/lib/api/fixer";

const formatRating = (rating?: number) => (rating ? rating.toFixed(1) : "—");

function AboutFixerPageContent() {
  const { user, ready } = useClientSession();
  const searchParams = useSearchParams();
  const queryFixerId = searchParams.get("fixerId");

  const [fixer, setFixer] = useState<FixerDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fixerId = useMemo(() => queryFixerId || user?.fixerId || null, [queryFixerId, user?.fixerId]);
  const isOwner = fixerId && user?.fixerId === fixerId;

  useEffect(() => {
    const fetchData = async () => {
      if (!fixerId) {
        setFixer(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await getFixer(fixerId);
        setFixer(response.data);
      } catch (err: any) {
        // Intentar por userId si falla el fixerId directo
        try {
          if (user?.id) {
            const byUser = await getFixerByUser(user.id);
            if (byUser) {
              setFixer(byUser);
              return;
            }
          }
        } catch {
          // ignore
        }
        setError(String(err?.message || "No se pudo cargar el perfil del fixer."));
      } finally {
        setLoading(false);
      }
    };

    if (ready) fetchData();
  }, [fixerId, ready, user?.id]);

  const renderAvatar = () => {
    const url = fixer?.photoUrl;
    if (!url) {
      return (
        <div className="flex h-36 w-36 items-center justify-center rounded-full bg-slate-200 text-xl font-semibold text-slate-500">
          {fixer?.name?.[0]?.toUpperCase() || "?"}
        </div>
      );
    }
    return (
      <Image
        src={url}
        alt="Foto de perfil del fixer"
        width={144}
        height={144}
        className="rounded-full border border-slate-200 object-cover"
      />
    );
  };

  const aboutText = fixer?.bio || "Este fixer aún no ha agregado una descripción.";
  const displayName = fixer?.name || `${user?.nombre ?? ""} ${user?.apellido ?? ""}`.trim() || "Fixer";
  const displayCity = fixer?.city || "Sin ciudad";
  const displaySkills =
    fixer?.categoriesInfo?.map((cat) => cat.name).join(", ") ||
    fixer?.categories?.join(", ") ||
    "Sin rubros asignados";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {loading && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Cargando perfil...</p>
          </section>
        )}

        {!loading && !fixer && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
            <p className="text-sm font-semibold text-amber-800">
              {error ?? "No encontramos el perfil. Inicia sesión como fixer o pasa ?fixerId= en la URL."}
            </p>
          </section>
        )}

        {fixer && (
          <>
            <div className="flex justify-center mb-8">{renderAvatar()}</div>

            <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                  <p className="text-sm text-slate-500">{displayCity}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">Rubros</p>
                  <p className="text-sm text-slate-600">{displaySkills}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-900">Sobre mí</p>
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-slate-800">
                    {aboutText}
                  </div>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                  <span className="font-semibold">Trabajos registrados:</span>
                  <span>{fixer.jobsCount ?? 0}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                  <span className="font-semibold">Calificación:</span>
                  <span className="text-amber-500 font-semibold">{formatRating(fixer.ratingAvg)}</span>
                  <span className="text-xs text-slate-500">
                    ({fixer.ratingCount ?? 0} reseñas)
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                  <span className="font-semibold">En Servineo desde:</span>
                  <span>{fixer.memberSince ? new Date(fixer.memberSince).toLocaleDateString() : "—"}</span>
                </div>
                {fixer.whatsapp && (
                  <a
                    href={`https://wa.me/${fixer.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-4 font-semibold text-white shadow transition hover:bg-green-700"
                  >
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
            </section>

            {/* Portafolio visual + Work Experience */}
            {fixerId && <VisualPortfolioSection fixerId={fixerId} isOwner={Boolean(isOwner)} />}
            {fixerId && <WorkExperienceSection fixerId={fixerId} isOwner={Boolean(isOwner)} />}
          </>
        )}
      </main>
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AboutFixerPageContent />
    </Suspense>
  );
}
