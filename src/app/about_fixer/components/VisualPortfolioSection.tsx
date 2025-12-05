'use client';

import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, MoveLeft, MoveRight, Pencil, Plus, Trash2, Video } from "lucide-react";
import {
  type VisualPortfolioDTO,
  type PortfolioMediaDTO,
  addPortfolioImage,
  updatePortfolioImage,
  addPortfolioVideo,
  updatePortfolioVideo,
  deletePortfolioItem,
  getPortfolio,
  reorderPortfolio,
} from "@/lib/api/fixer";

type Props = {
  fixerId: string;
  isOwner: boolean;
  showForms?: boolean;
};

type ImageFormState = {
  description: string;
  file: File | null;
  previewUrl: string | null;
  editingId: string | null;
};

type VideoFormState = {
  description: string;
  url: string;
  previewId: string | null;
  editingId: string | null;
};

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const extractYouTubeId = (url: string) => {
  const match = /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=|shorts\/|v\/|.+[?&]v=))([\w-]{11})/i.exec(
    url.trim()
  );
  return match ? match[1] : null;
};

const normalizeMediaList = (media: PortfolioMediaDTO[] | undefined) =>
  Array.isArray(media) ? [...media].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) : [];

async function maybeCompressImage(file: File): Promise<File> {
  const threshold = 1.5 * 1024 * 1024;
  if (file.size <= threshold || !file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/webp", 0.82)
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.\w+$/, "");
    return new File([blob], `${name}.webp`, { type: "image/webp" });
  } catch {
    return file;
  }
}

export default function VisualPortfolioSection({ fixerId, isOwner, showForms = true }: Props) {
  const [portfolio, setPortfolio] = useState<VisualPortfolioDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingImage, setSavingImage] = useState(false);
  const [savingVideo, setSavingVideo] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const [imageForm, setImageForm] = useState<ImageFormState>({
    description: "",
    file: null,
    previewUrl: null,
    editingId: null,
  });

  const [videoForm, setVideoForm] = useState<VideoFormState>({
    description: "",
    url: "",
    previewId: null,
    editingId: null,
  });

  const [formsOpen, setFormsOpen] = useState(showForms);
  const editable = isOwner && formsOpen;

  useEffect(() => {
    setFormsOpen(showForms);
  }, [showForms]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getPortfolio(fixerId)
      .then((data) => {
        if (active) {
          setPortfolio(data);
          setError(null);
        }
      })
      .catch((err) => active && setError(String(err?.message || "No se pudo cargar el portafolio visual")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [fixerId]);

  const mediaList = useMemo(() => normalizeMediaList(portfolio?.media), [portfolio]);

  const resetImageForm = () => {
    if (imageForm.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imageForm.previewUrl);
    }
    setImageForm({ description: "", file: null, previewUrl: null, editingId: null });
    setImageError(null);
  };

  const resetVideoForm = () => {
    setVideoForm({ description: "", url: "", previewId: null, editingId: null });
    setVideoError(null);
  };

  const validateImageFile = (file: File | null) => {
    if (!file) return "Debes seleccionar una imagen valida.";
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return "Formato no permitido. Solo imagenes (JPG, PNG, WebP).";
    if (file.size > MAX_IMAGE_SIZE) return "La imagen supera el tamano maximo permitido (5 MB).";
    return null;
  };

  const onImageFileChange = async (file: File | null) => {
    if (imageForm.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imageForm.previewUrl);
    }
    if (!file) {
      setImageForm((prev) => ({ ...prev, file: null, previewUrl: null }));
      return;
    }
    const validation = validateImageFile(file);
    if (validation) {
      setImageError(validation);
      return;
    }
    const processed = await maybeCompressImage(file).catch(() => file);
    const preview = URL.createObjectURL(processed);
    setImageForm((prev) => ({ ...prev, file: processed, previewUrl: preview }));
    setImageError(null);
  };

  const saveImage = async () => {
    const description = imageForm.description.trim();
    const payload: { description?: string; file?: File } = {};
    if (description) payload.description = description;

    if (imageForm.editingId) {
      if (imageForm.file) {
        const validation = validateImageFile(imageForm.file);
        if (validation) {
          setImageError(validation);
          return;
        }
        payload.file = imageForm.file;
      }
    } else {
      const validation = validateImageFile(imageForm.file);
      if (validation) {
        setImageError(validation);
        return;
      }
      payload.file = imageForm.file!;
    }

    try {
      setSavingImage(true);
      setImageError(null);
      const updated = imageForm.editingId
        ? await updatePortfolioImage(fixerId, imageForm.editingId, payload)
        : await addPortfolioImage(fixerId, payload as { description?: string; file: File });

      setPortfolio((prev) => {
        const media = normalizeMediaList(prev?.media);
        if (imageForm.editingId) {
          const mapped = media.map((item) => (item.id === imageForm.editingId ? updated : item));
          return { media: normalizeMediaList(mapped), updatedAt: prev?.updatedAt };
        }
        return { media: normalizeMediaList([updated, ...media]), updatedAt: prev?.updatedAt };
      });
      resetImageForm();
    } catch (err: any) {
      setImageError(String(err?.message || "No se pudo guardar la imagen"));
    } finally {
      setSavingImage(false);
    }
  };

  const saveVideo = async () => {
    const description = videoForm.description.trim();
    const id = extractYouTubeId(videoForm.url);
    if (!id) {
      setVideoError("Ingresa un enlace valido de YouTube");
      return;
    }

    const payload = {
      description: description || undefined,
      videoUrl: videoForm.url.trim(),
    };

    try {
      setSavingVideo(true);
      setVideoError(null);
      const updated = videoForm.editingId
        ? await updatePortfolioVideo(fixerId, videoForm.editingId, payload)
        : await addPortfolioVideo(fixerId, payload);

      setPortfolio((prev) => {
        const media = normalizeMediaList(prev?.media);
        if (videoForm.editingId) {
          const mapped = media.map((item) => (item.id === videoForm.editingId ? updated : item));
          return { media: normalizeMediaList(mapped), updatedAt: prev?.updatedAt };
        }
        return { media: normalizeMediaList([updated, ...media]), updatedAt: prev?.updatedAt };
      });
      resetVideoForm();
    } catch (err: any) {
      setVideoError(String(err?.message || "No se pudo guardar el video"));
    } finally {
      setSavingVideo(false);
    }
  };

  const startEditImage = (media: PortfolioMediaDTO) => {
    setImageForm({
      description: media.description ?? "",
      file: null,
      previewUrl: media.imageUrl || null,
      editingId: media.id,
    });
    setImageError(null);
  };

  const startEditVideo = (media: PortfolioMediaDTO) => {
    const url = media.videoUrl || (media.videoId ? `https://www.youtube.com/watch?v=${media.videoId}` : "");
    setVideoForm({
      description: media.description ?? "",
      url,
      previewId: media.videoId ?? null,
      editingId: media.id,
    });
    setVideoError(null);
  };

  const handleDelete = async (id: string) => {
    if (!editable) return;
    const confirmed = window.confirm("¿Eliminar este elemento del portafolio?");
    if (!confirmed) return;
    try {
      await deletePortfolioItem(fixerId, id);
      setPortfolio((prev) => ({
        media: normalizeMediaList(prev?.media)?.filter((item) => item.id !== id),
        updatedAt: prev?.updatedAt,
      }));
    } catch (err: any) {
      setError(String(err?.message || "No se pudo eliminar el elemento"));
    }
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    if (!editable) return;
    const current = normalizeMediaList(portfolio?.media);
    const index = current.findIndex((item) => item.id === id);
    const target = direction === "up" ? index - 1 : index + 1;
    if (index === -1 || target < 0 || target >= current.length) return;

    const reordered = [...current];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    const payload = reordered.map((item, order) => ({ id: item.id, order }));

    setPortfolio({ media: normalizeMediaList(reordered), updatedAt: portfolio?.updatedAt });
    try {
      await reorderPortfolio(fixerId, payload);
    } catch (err: any) {
      setError(String(err?.message || "No se pudo actualizar el orden"));
      setPortfolio({ media: current, updatedAt: portfolio?.updatedAt });
    }
  };

  const onImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  const skeletonCards = (
    <div className="grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((idx) => (
        <div
          key={idx}
          className="h-64 rounded-2xl border border-slate-200 bg-slate-100 shadow-sm animate-pulse"
        />
      ))}
    </div>
  );

  const emptyState = (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
      <p className="font-semibold text-slate-800">Aún no hay material visual cargado.</p>
      <p className="mt-1 text-slate-600">
        {editable
          ? "Agrega imagenes o videos de YouTube para mostrar tus trabajos."
          : "El fixer aun no publico imagenes o videos."}
      </p>
      {editable && (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-blue-500"
            onClick={resetImageForm}
          >
            <Plus className="h-4 w-4" />
            Agregar imagen
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-500"
            onClick={resetVideoForm}
          >
            <Video className="h-4 w-4" />
            Agregar video
          </button>
        </div>
      )}
    </div>
  );

  const renderMediaCard = (media: PortfolioMediaDTO) => {
    const isImage = media.kind === "image";
    const broken = brokenImages[media.id];
    const description = media.description?.trim();
    const embedSrc =
      media.embedUrl ||
      (media.videoId ? `https://www.youtube.com/embed/${media.videoId}` : undefined);

    return (
      <article
        key={media.id}
        className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="relative aspect-video bg-slate-100">
          {isImage ? (
            !broken && media.imageUrl ? (
              <img
                src={media.imageUrl}
                alt={description || "Trabajo del fixer"}
                loading="lazy"
                className="h-full w-full object-contain bg-slate-50"
                onError={() => onImageError(media.id)}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                <ImageIcon className="h-8 w-8" />
                <p className="text-xs text-center px-3">
                  {description || "No se pudo cargar la imagen."}
                </p>
              </div>
            )
          ) : embedSrc ? (
            <iframe
              src={embedSrc}
              title={description || "Video del portafolio"}
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
              <Video className="h-8 w-8" />
              <p className="text-xs text-center px-3">
                {description || "No se pudo cargar el video de YouTube."}
              </p>
            </div>
          )}

          {editable && (
            <div className="absolute right-2 top-2 flex gap-2">
              <button
                type="button"
                className="rounded-full bg-white/90 p-2 text-slate-700 shadow hover:text-blue-600"
                aria-label="Editar elemento"
                onClick={() => (isImage ? startEditImage(media) : startEditVideo(media))}
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-full bg-white/90 p-2 text-red-600 shadow hover:text-red-700"
                aria-label="Eliminar elemento"
                onClick={() => handleDelete(media.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
              {isImage ? "Imagen" : "Video"}
            </span>
            {editable && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full border border-slate-200 p-1 text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
                  onClick={() => moveItem(media.id, "up")}
                  disabled={mediaList[0]?.id === media.id}
                  aria-label="Mover arriba"
                >
                  <MoveLeft className="h-4 w-4 rotate-90 md:rotate-0" />
                </button>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 p-1 text-slate-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
                  onClick={() => moveItem(media.id, "down")}
                  disabled={mediaList[mediaList.length - 1]?.id === media.id}
                  aria-label="Mover abajo"
                >
                  <MoveRight className="h-4 w-4 rotate-90 md:rotate-0" />
                </button>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {description || (isImage ? "Imagen sin descripcion" : "Video sin descripcion")}
          </p>
          {isImage && media.imageMeta?.originalName && (
            <p className="text-xs text-slate-500">{media.imageMeta.originalName}</p>
          )}
          {media.provider === "youtube" && media.videoId && (
            <p className="text-xs text-slate-500">YouTube · ID: {media.videoId}</p>
          )}
        </div>
      </article>
    );
  };

  return (
    <section className="mt-10">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-base font-semibold text-slate-900">Portafolio visual</p>
            <p className="text-xs text-slate-500">
              Comparte imagenes y videos de tus trabajos. Los cambios se guardan al instante.
            </p>
          </div>
          {isOwner && (
            <div className="flex items-center gap-2">
              {editable && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Edicion habilitada
                </span>
              )}
              <button
                type="button"
                onClick={() => setFormsOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
              >
                {formsOpen ? "Ocultar formularios" : "+ Añadir"}
              </button>
            </div>
          )}
        </div>

        {editable && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">Agregar imagen</h3>
              {imageForm.editingId && (
                <button
                  type="button"
                onClick={resetImageForm}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Cancelar edicion
              </button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-[2fr_1fr] items-start">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Descripcion (opcional)</label>
              <textarea
                value={imageForm.description}
                onChange={(e) => setImageForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Explica brevemente el trabajo de la imagen"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Imagen (JPG, PNG, WebP) *</label>
              <input
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                onChange={(e) => onImageFileChange(e.target.files?.[0] ?? null)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageForm.previewUrl && (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img
                    src={imageForm.previewUrl}
                    alt="Vista previa"
                    className="h-40 w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            {imageError ? (
              <p className="text-xs font-semibold text-red-600">{imageError}</p>
            ) : (
              <span className="text-xs text-slate-500">
                Tamaño maximo 5 MB. Se usa compresion ligera para cargas pesadas.
              </span>
            )}
            <button
              type="button"
              disabled={savingImage}
              onClick={saveImage}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingImage ? "Guardando..." : imageForm.editingId ? "Actualizar imagen" : "Guardar imagen"}
            </button>
            </div>
          </div>
        )}

        {editable && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">Agregar video de YouTube</h3>
              {videoForm.editingId && (
                <button
                  type="button"
                onClick={resetVideoForm}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Cancelar edicion
              </button>
            )}
          </div>
          <div className="grid gap-3 md:grid-cols-[2fr_1fr] items-start">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Enlace de YouTube *</label>
              <input
                type="url"
                value={videoForm.url}
                onChange={(e) => {
                  const value = e.target.value;
                  setVideoForm((prev) => ({ ...prev, url: value, previewId: extractYouTubeId(value) }));
                  setVideoError(null);
                }}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="https://www.youtube.com/watch?v="
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Descripcion (opcional)</label>
              <textarea
                value={videoForm.description}
                onChange={(e) => setVideoForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Breve contexto del video"
              />
            </div>
          </div>
          {videoForm.previewId && (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <iframe
                src={`https://www.youtube.com/embed/${videoForm.previewId}`}
                title="Vista previa de video"
                className="aspect-video w-full"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {videoError ? (
              <p className="text-xs font-semibold text-red-600">{videoError}</p>
            ) : (
              <span className="text-xs text-slate-500">
                Se valida el enlace de YouTube antes de guardar. No se permiten duplicados.
              </span>
            )}
            <button
              type="button"
              disabled={savingVideo}
              onClick={saveVideo}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingVideo ? "Guardando..." : videoForm.editingId ? "Actualizar video" : "Guardar video"}
            </button>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          skeletonCards
        ) : mediaList.length ? (
          <div className="grid gap-4 md:grid-cols-3">{mediaList.map(renderMediaCard)}</div>
        ) : (
          emptyState
        )}
      </div>
    </section>
  );
}
