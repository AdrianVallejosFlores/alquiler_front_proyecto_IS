'use client';

import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import {
  type JobPositionDTO,
  type CertificationDTO,
  type WorkExperienceDTO,
  type JobPositionPayload,
  type CertificationPayload,
  getWorkExperience,
  createJobPosition,
  updateJobPosition,
  deleteJobPosition,
  createCertification,
  updateCertification,
  deleteCertification,
} from "@/lib/api/fixer";

type Props = {
  fixerId: string;
  isOwner: boolean;
  showForms?: boolean;
};

type JobFormState = {
  positionName: string;
  journeyType: string;
  organization: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
};

type CertFormState = {
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate: string;
  credentialId: string;
  credentialUrl: string;
  file: File | null;
  previewUrl: string | null;
};

const emptyJob: JobFormState = {
  positionName: "",
  journeyType: "",
  organization: "",
  isCurrent: false,
  startDate: "",
  endDate: "",
};

const emptyCert: CertFormState = {
  name: "",
  issuer: "",
  issueDate: "",
  expirationDate: "",
  credentialId: "",
  credentialUrl: "",
  file: null,
  previewUrl: null,
};

const MIN_VALID_YEAR = 1900;
const MAX_VALID_YEAR = 2100;
const MIN_VALID_DATE = `${MIN_VALID_YEAR}-01-01`;
const MAX_VALID_DATE = `${MAX_VALID_YEAR}-12-31`;

const isDateWithinRange = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return false;
  if (year < MIN_VALID_YEAR || year > MAX_VALID_YEAR) return false;

  const date = new Date(value);
  return (
    !Number.isNaN(date.getTime()) &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
};

const validateDateRange = (value: string, label: string) => {
  if (!isDateWithinRange(value)) {
    return `${label} debe tener un año entre ${MIN_VALID_YEAR} y ${MAX_VALID_YEAR}.`;
  }
  return null;
};

const normalizeDateInput = (value: string) => {
  if (!value) return { value: "", error: null };
  // Permite escritura parcial o años fuera de rango mientras se tipea; validamos al hacer blur o guardar.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return { value, error: null };
  }
  const year = Number(value.slice(0, 4));
  if (year < MIN_VALID_YEAR || year > MAX_VALID_YEAR) {
    return { value, error: null };
  }
  if (!isDateWithinRange(value)) {
    return { value, error: null };
  }
  return { value, error: null };
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};

const JOB_JOURNEY_TYPES = ["Tiempo completo", "Medio tiempo", "Freelance", "Proyecto", "Prácticas"];

export default function WorkExperienceSection({ fixerId, isOwner, showForms = true }: Props) {
  const [experience, setExperience] = useState<WorkExperienceDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [jobForm, setJobForm] = useState<JobFormState>(emptyJob);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobSaving, setJobSaving] = useState(false);

  const [certForm, setCertForm] = useState<CertFormState>(emptyCert);
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [certError, setCertError] = useState<string | null>(null);
  const [certSaving, setCertSaving] = useState(false);
  const [jobFormOpen, setJobFormOpen] = useState(showForms);
  const [certFormOpen, setCertFormOpen] = useState(showForms);
  const editableJobs = isOwner && jobFormOpen;
  const editableCerts = isOwner && certFormOpen;

  useEffect(() => {
    setJobFormOpen(showForms);
    setCertFormOpen(showForms);
  }, [showForms]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getWorkExperience(fixerId)
      .then((data) => {
        if (mounted) setExperience(data);
      })
      .catch((err) => mounted && setError(String(err?.message || "No se pudo cargar Work Experience")))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [fixerId]);

  const hasJobs = useMemo(() => (experience?.jobPositions?.length ?? 0) > 0, [experience]);
  const hasCerts = useMemo(() => (experience?.certifications?.length ?? 0) > 0, [experience]);

  const resetJobForm = () => {
    setJobForm(emptyJob);
    setEditingJobId(null);
    setJobError(null);
  };

  const resetCertForm = () => {
    if (certForm.previewUrl) URL.revokeObjectURL(certForm.previewUrl);
    setCertForm(emptyCert);
    setEditingCertId(null);
    setCertError(null);
  };

  const handleJobDateChange = (key: "startDate" | "endDate", value: string) => {
    const { value: normalized } = normalizeDateInput(value);
    setJobForm((prev) => ({ ...prev, [key]: normalized }));
    if (jobError) setJobError(null);
  };

  const handleCertDateChange = (key: "issueDate" | "expirationDate", value: string) => {
    const { value: normalized } = normalizeDateInput(value);
    setCertForm((prev) => ({ ...prev, [key]: normalized }));
    if (certError) setCertError(null);
  };

  const handleJobDateBlur = (key: "startDate" | "endDate") => {
    const value = jobForm[key];
    if (!value) return;
    const label = key === "startDate" ? "La fecha de inicio" : "La fecha de fin";
    const error = validateDateRange(value, label);
    if (error) setJobError(error);
  };

  const handleCertDateBlur = (key: "issueDate" | "expirationDate") => {
    const value = certForm[key];
    if (!value) return;
    const label = key === "issueDate" ? "La fecha de expedición" : "La fecha de expiración";
    const error = validateDateRange(value, label);
    if (error) setCertError(error);
  };

  const validateJobForm = (form: JobFormState) => {
    if (!form.positionName.trim()) return "El nombre del puesto es obligatorio.";
    if (!form.journeyType.trim()) return "El tipo de jornada es obligatorio.";
    if (!form.startDate) return "La fecha de inicio es obligatoria.";
    const startDateRangeError = validateDateRange(form.startDate, "La fecha de inicio");
    if (startDateRangeError) return startDateRangeError;
    if (!form.isCurrent && !form.endDate) return "Indica la fecha de finalización o marca como trabajo actual.";
    const endDateRangeError = !form.isCurrent && form.endDate ? validateDateRange(form.endDate, "La fecha de fin") : null;
    if (endDateRangeError) return endDateRangeError;
    const start = new Date(form.startDate);
    const end = form.endDate ? new Date(form.endDate) : null;
    if (end && end.getTime() < start.getTime()) return "La fecha de fin no puede ser anterior a la fecha de inicio.";
    return null;
  };

  const validateCertForm = (form: CertFormState, isEditing: boolean) => {
    if (!form.name.trim()) return "El nombre de la certificación es obligatorio.";
    if (!form.issuer.trim()) return "La institución emisora es obligatoria.";
    if (!form.issueDate) return "La fecha de expedición es obligatoria.";
    const issueDateRangeError = validateDateRange(form.issueDate, "La fecha de expedición");
    if (issueDateRangeError) return issueDateRangeError;
    if (!isEditing && !form.file) return "Debes adjuntar la imagen de la certificación.";

    if (form.file && !["image/jpeg", "image/png", "image/webp"].includes(form.file.type)) {
      return "Formato no permitido. Solo imágenes.";
    }

    if (form.expirationDate) {
      const expirationDateRangeError = validateDateRange(form.expirationDate, "La fecha de expiración");
      if (expirationDateRangeError) return expirationDateRangeError;
      const issue = new Date(form.issueDate);
      const expiration = new Date(form.expirationDate);
      if (expiration.getTime() < issue.getTime()) {
        return "La fecha de expiración no puede ser anterior a la fecha de expedición.";
      }
    }
    return null;
  };

  const buildJobPayload = (form: JobFormState): JobPositionPayload => ({
    positionName: form.positionName.trim(),
    journeyType: form.journeyType.trim(),
    organization: form.organization.trim() || undefined,
    isCurrent: form.isCurrent,
    startDate: new Date(form.startDate).toISOString(),
    endDate: form.isCurrent || !form.endDate ? undefined : new Date(form.endDate).toISOString(),
  });

  const buildCertPayload = (form: CertFormState): CertificationPayload => ({
    name: form.name.trim(),
    issuer: form.issuer.trim(),
    issueDate: new Date(form.issueDate).toISOString(),
    expirationDate: form.expirationDate ? new Date(form.expirationDate).toISOString() : undefined,
    credentialId: form.credentialId.trim() || undefined,
    credentialUrl: form.credentialUrl.trim() || undefined,
    file: form.file ?? undefined,
  });

  const upsertJobPosition = async () => {
    const validation = validateJobForm(jobForm);
    if (validation) {
      setJobError(validation);
      return;
    }

    try {
      setJobSaving(true);
      setJobError(null);
      const payload = buildJobPayload(jobForm);
      const result = editingJobId
        ? await updateJobPosition(fixerId, editingJobId, payload)
        : await createJobPosition(fixerId, payload);

      setExperience((prev) => {
        const current = prev?.jobPositions ?? [];
        if (editingJobId) {
          return {
            jobPositions: current.map((item) => (item.id === editingJobId ? result : item)),
            certifications: prev?.certifications ?? [],
            updatedAt: prev?.updatedAt,
          };
        }
        return {
          jobPositions: [result, ...current],
          certifications: prev?.certifications ?? [],
          updatedAt: prev?.updatedAt,
        };
      });
      resetJobForm();
    } catch (err: any) {
      setJobError(String(err?.message || "No se pudo guardar la posición"));
    } finally {
      setJobSaving(false);
    }
  };

  const upsertCertification = async () => {
    const validation = validateCertForm(certForm, Boolean(editingCertId));
    if (validation) {
      setCertError(validation);
      return;
    }

    try {
      setCertSaving(true);
      setCertError(null);
      const payload = buildCertPayload(certForm);
      const result = editingCertId
        ? await updateCertification(fixerId, editingCertId, payload)
        : await createCertification(fixerId, payload as CertificationPayload & { file: File });

      setExperience((prev) => {
        const current = prev?.certifications ?? [];
        if (editingCertId) {
          return {
            jobPositions: prev?.jobPositions ?? [],
            certifications: current.map((item) => (item.id === editingCertId ? result : item)),
            updatedAt: prev?.updatedAt,
          };
        }
        return {
          jobPositions: prev?.jobPositions ?? [],
          certifications: [result, ...current],
          updatedAt: prev?.updatedAt,
        };
      });
      resetCertForm();
    } catch (err: any) {
      setCertError(String(err?.message || "No se pudo guardar la certificación"));
    } finally {
      setCertSaving(false);
    }
  };

  const startEditJob = (job: JobPositionDTO) => {
    setEditingJobId(job.id);
    setJobForm({
      positionName: job.positionName,
      journeyType: job.journeyType,
      organization: job.organization ?? "",
      isCurrent: job.isCurrent,
      startDate: job.startDate.slice(0, 10),
      endDate: job.endDate ? job.endDate.slice(0, 10) : "",
    });
    setJobError(null);
  };

  const startEditCert = (cert: CertificationDTO) => {
    setEditingCertId(cert.id);
    setCertForm({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate.slice(0, 10),
      expirationDate: cert.expirationDate ? cert.expirationDate.slice(0, 10) : "",
      credentialId: cert.credentialId ?? "",
      credentialUrl: cert.credentialUrl ?? "",
      file: null,
      previewUrl: cert.imageUrl || null,
    });
    setCertError(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!editableJobs) return;
    const confirmDelete = window.confirm("¿Eliminar esta posición laboral?");
    if (!confirmDelete) return;
    try {
      await deleteJobPosition(fixerId, jobId);
      setExperience((prev) => ({
        jobPositions: (prev?.jobPositions ?? []).filter((item) => item.id !== jobId),
        certifications: prev?.certifications ?? [],
        updatedAt: prev?.updatedAt,
      }));
    } catch (err: any) {
      setJobError(String(err?.message || "No se pudo eliminar la posición"));
    }
  };

  const handleDeleteCert = async (certId: string) => {
    if (!editableCerts) return;
    const confirmDelete = window.confirm("¿Eliminar esta certificación?");
    if (!confirmDelete) return;
    try {
      await deleteCertification(fixerId, certId);
      setExperience((prev) => ({
        jobPositions: prev?.jobPositions ?? [],
        certifications: (prev?.certifications ?? []).filter((item) => item.id !== certId),
        updatedAt: prev?.updatedAt,
      }));
    } catch (err: any) {
      setCertError(String(err?.message || "No se pudo eliminar la certificación"));
    }
  };

  if (loading) {
    return (
      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">Cargando Work Experience...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm font-semibold text-red-700">{error}</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-2">
            <p className="text-base font-semibold text-slate-900">Work experience (inspirado en LinkedIn)</p>
            <p className="text-xs text-slate-600">
              Cuenta tu trayectoria con cargos, empresas y fechas claras. Luego agrega las certificaciones que validen tu trabajo.
            </p>
          </div>
          {isOwner && (editableJobs || editableCerts) && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Edición habilitada</span>
          )}
        </div>

      {/* Sección de posiciones laborales */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">Experiencia laboral</h3>
            <p className="text-xs text-slate-500">Describe tus roles como en LinkedIn: cargo, jornada, empresa y fechas.</p>
          </div>
          {isOwner && (
            <button
              type="button"
              onClick={() => setJobFormOpen((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
            >
              {jobFormOpen ? "Ocultar formulario" : "+ Añadir posición"}
            </button>
          )}
        </div>

        {editableJobs && (
          <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">
                  Nombre del puesto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jobForm.positionName}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, positionName: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ej: Carpintero senior, Instalador eléctrico"
                />
                <p className="text-[11px] text-slate-500">Sé específico: cargo + especialidad.</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Tipo de jornada *</label>
                <select
                  value={jobForm.journeyType}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, journeyType: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Selecciona</option>
                  {JOB_JOURNEY_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Organización (opcional)</label>
                <input
                  type="text"
                  value={jobForm.organization}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, organization: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Empresa o proyecto"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="isCurrent"
                  type="checkbox"
                  checked={jobForm.isCurrent}
                  onChange={(e) => setJobForm((prev) => ({ ...prev, isCurrent: e.target.checked, endDate: "" }))}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isCurrent" className="text-xs font-semibold text-slate-700">
                  Trabajo actual
                </label>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-slate-700">Periodo *</label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="date"
                    min={MIN_VALID_DATE}
                    max={MAX_VALID_DATE}
                    value={jobForm.startDate}
                    onChange={(e) => handleJobDateChange("startDate", e.target.value)}
                    onBlur={() => handleJobDateBlur("startDate")}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {jobForm.isCurrent ? (
                    <div className="rounded-xl border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-500">
                      Marcado como trabajo actual
                    </div>
                  ) : (
                    <input
                      type="date"
                      min={MIN_VALID_DATE}
                      max={MAX_VALID_DATE}
                      value={jobForm.endDate}
                      onChange={(e) => handleJobDateChange("endDate", e.target.value)}
                      onBlur={() => handleJobDateBlur("endDate")}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              {jobError ? (
                <p className="text-xs font-semibold text-red-600">{jobError}</p>
              ) : (
                <span className="text-xs text-slate-500">
                  Incluye el cargo, jornada y fechas. Si es actual, marca la casilla.
                </span>
              )}
              <div className="flex gap-2">
                {editingJobId && (
                  <button
                    type="button"
                    onClick={resetJobForm}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Cancelar edición
                  </button>
                )}
                <button
                  type="button"
                  disabled={jobSaving}
                  onClick={upsertJobPosition}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {jobSaving ? "Guardando..." : editingJobId ? "Actualizar posición" : "Guardar posición"}
                </button>
              </div>
            </div>
          </div>
        )}

        {hasJobs ? (
          <div className="grid gap-3 md:grid-cols-2">
            {experience?.jobPositions?.map((job) => (
              <article
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{job.positionName}</p>
                    <p className="text-xs text-slate-600">{job.journeyType}</p>
                    {job.organization && <p className="text-xs text-slate-500 mt-1">{job.organization}</p>}
                    <p className="mt-2 text-xs text-slate-600">
                      {formatDate(job.startDate)} — {job.isCurrent ? "Actual" : formatDate(job.endDate)}
                    </p>
                  </div>
                  {editableJobs && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                        onClick={() => startEditJob(job)}
                        aria-label="Editar posición"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-full border border-red-200 p-2 text-red-600 transition hover:border-red-400"
                        onClick={() => handleDeleteJob(job.id)}
                        aria-label="Eliminar posición"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Aún no hay posiciones registradas. {editableJobs ? "Agrega tu primera posición para mostrar tu trayectoria." : ""}
          </p>
        )}
      </div>

      {/* Sección de certificaciones */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-900">Certificaciones y credenciales</h3>
            <p className="text-xs text-slate-500">Adjunta diplomas, cursos o credenciales que respalden tu perfil.</p>
          </div>
          {isOwner && (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-400 hover:text-blue-600"
              onClick={() => setCertFormOpen((prev) => !prev)}
            >
              {certFormOpen ? "Ocultar formulario" : "+ Añadir certificación"}
            </button>
          )}
        </div>

        {editableCerts && (
          <div className="mb-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Nombre de la certificación *</label>
                <input
                  type="text"
                  value={certForm.name}
                  onChange={(e) => setCertForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Ej: Certificación en Instalaciones Eléctricas"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Institución emisora *</label>
                <input
                  type="text"
                  value={certForm.issuer}
                  onChange={(e) => setCertForm((prev) => ({ ...prev, issuer: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Institución o entidad"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Fecha de expedición *</label>
                <input
                  type="date"
                  min={MIN_VALID_DATE}
                  max={MAX_VALID_DATE}
                  value={certForm.issueDate}
                  onChange={(e) => handleCertDateChange("issueDate", e.target.value)}
                  onBlur={() => handleCertDateBlur("issueDate")}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Fecha de expiración (opcional)</label>
                <input
                  type="date"
                  min={MIN_VALID_DATE}
                  max={MAX_VALID_DATE}
                  value={certForm.expirationDate}
                  onChange={(e) => handleCertDateChange("expirationDate", e.target.value)}
                  onBlur={() => handleCertDateBlur("expirationDate")}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">ID de la credencial (opcional)</label>
                <input
                  type="text"
                  value={certForm.credentialId}
                  onChange={(e) => setCertForm((prev) => ({ ...prev, credentialId: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">URL de la credencial (opcional)</label>
                <input
                  type="url"
                  value={certForm.credentialUrl}
                  onChange={(e) => setCertForm((prev) => ({ ...prev, credentialUrl: e.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="https://"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700">Imagen (JPG, PNG, WebP) *</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    if (certForm.previewUrl) URL.revokeObjectURL(certForm.previewUrl);
                    setCertForm((prev) => ({
                      ...prev,
                      file,
                      previewUrl: file ? URL.createObjectURL(file) : prev.previewUrl,
                    }));
                    setCertError(null);
                  }}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
                {certForm.previewUrl && (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={certForm.previewUrl}
                      alt="Vista previa"
                      className="h-40 w-full object-contain bg-white"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              {certError ? (
                <p className="text-xs font-semibold text-red-600">{certError}</p>
              ) : (
                <span className="text-xs text-slate-500">
                  Se mostrará una vista previa inmediata. La imagen se valida antes de enviar.
                </span>
              )}
              <div className="flex gap-2">
                {editingCertId && (
                  <button
                    type="button"
                    onClick={resetCertForm}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-500 hover:text-blue-600"
                  >
                    Cancelar edición
                  </button>
                )}
                <button
                  type="button"
                  disabled={certSaving}
                  onClick={upsertCertification}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {certSaving ? "Guardando..." : editingCertId ? "Actualizar certificación" : "Guardar certificación"}
                </button>
              </div>
            </div>
          </div>
        )}

        {hasCerts ? (
          <div className="grid gap-4 md:grid-cols-3">
            {experience?.certifications?.map((cert) => (
              <article
                key={cert.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm transition hover:shadow"
              >
                <div className="relative aspect-video bg-white">
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt={cert.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  {editableCerts && (
                    <div className="absolute right-2 top-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditCert(cert)}
                        className="rounded-full bg-white/90 p-2 text-slate-700 shadow hover:text-blue-600"
                        aria-label="Editar certificación"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCert(cert.id)}
                        className="rounded-full bg-white/90 p-2 text-red-600 shadow hover:text-red-700"
                        aria-label="Eliminar certificación"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1 p-4">
                  <p className="text-sm font-semibold text-slate-900">{cert.name}</p>
                  <p className="text-xs text-slate-600">{cert.issuer}</p>
                  <p className="text-xs text-slate-500">
                    Expedición: {formatDate(cert.issueDate)} {cert.expirationDate ? `· Expira: ${formatDate(cert.expirationDate)}` : ""}
                  </p>
                  {cert.credentialId && <p className="text-xs text-slate-500">ID: {cert.credentialId}</p>}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Ver credencial
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
            Aún no hay certificaciones registradas. {editableCerts ? "Sube una imagen válida (JPG, PNG o WebP) para mostrarla aquí." : ""}
          </p>
        )}
      </div>
      </div>
    </section>
  );
}

