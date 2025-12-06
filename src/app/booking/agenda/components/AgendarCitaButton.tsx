"use client";
import { useState, useEffect } from "react";
import { AppointmentModal } from "./appointment-modal";
import { useClientSession } from "@/lib/auth/useSession";

interface AgendarCitaButtonProps {
  proveedorId: string;  
  servicioId: string;
}

export default function AgendarCitaButton({ proveedorId, servicioId }: AgendarCitaButtonProps) {
  const [open, setOpen] = useState(false);

  // ⬇️ Traemos la sesión del usuario autenticado
  const { user, loading } = useClientSession();

  // Depuración: estado de la sesión
  useEffect(() => {
    console.log("🔹 Sesión cargada:", { user, loading });
  }, [user, loading]);

  // Mientras carga la sesión
  if (loading) {
    console.log("🔹 Cargando sesión...");
    return null;
  }

  // Si no hay usuario => no puede agendar
  if (!user) {
    console.log("🔹 No hay usuario autenticado.");
    return null;
  }

  const clienteId = user._id; // ⬅️ El ID real del usuario desde tu JWT / sesión
  console.log("🔹 Cliente ID:", clienteId);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2 bg-[#4289CC] text-white rounded-lg hover:bg-blue-700 transition transform hover:scale-105 duration-300 font-medium"
      >
        Agendar Cita
      </button>

      <AppointmentModal
        open={open}
        onOpenChange={setOpen}
        patientName={`${user.nombre} ${user.apellido ?? ""}`}
        providerId={proveedorId}
        servicioId={servicioId}
        clienteId={clienteId}
        slotMinutes={30}
        hours="08:00-12:00,14:00-18:00"
      />
    </>
  );
}
