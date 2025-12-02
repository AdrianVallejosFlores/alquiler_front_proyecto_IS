import DetalleTerminado from "../modules/DetalleTerminado";
import { fetchTrabajoById } from "../services/TrabajoTerminados.service";

export const metadata = { title: "Trabajo - Detalle" };
export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const trabajo = await fetchTrabajoById(id);

  if (!trabajo) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div role="alert" style={{ background: "#fff8e1", border: "1px solid #ffe082", padding: 12, borderRadius: 8 }}>
          No se encontró el trabajo solicitado o no se pudo conectar con el servidor.
        </div>
        <pre style={{ fontSize: 12, color: "#666", marginTop: 8 }}>ID: {id}</pre>
      </main>
    );
  }

  return (
    <main>
      <DetalleTerminado trabajo={trabajo} />
    </main>
  );
}
