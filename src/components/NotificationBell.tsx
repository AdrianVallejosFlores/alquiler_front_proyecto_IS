"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { getNewServicesCount } from "@/lib/checkNewServices";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const router = useRouter();

  const [serviceCount, setServiceCount] = useState(0);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [serviceNotifications, setServiceNotifications] = useState<any[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const goToAgenda = () => {
    router.push("/booking/agenda");
    setShowPanel(false);
  };

  const loadTempAppointments = () => {
    const appointments = [];
    let index = 1;

    while (localStorage.getItem(`temp_appointment${index}`)) {
      const appointment = JSON.parse(localStorage.getItem(`temp_appointment${index}`) || "{}");
      if (appointment) appointments.push(appointment);
      index++;
    }

    return appointments;
  };

  const loadTempServices = () => {
    const services = [];
    let index = 1;

    while (localStorage.getItem(`temp_service${index}`)) {
      const service = JSON.parse(localStorage.getItem(`temp_service${index}`) || "{}");
      if (service) services.push(service);
      index++;
    }

    return services;
  };

  const clearAppointments = () => {
    let index = 1;
    while (localStorage.getItem(`temp_appointment${index}`)) {
      localStorage.removeItem(`temp_appointment${index}`);
      index++;
    }
    setAppointments([]);
  };

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        setIsLoading(true);

        const newServicesCount = await getNewServicesCount();

        const newAppointments = loadTempAppointments();
        const newServicesLocal = loadTempServices();

        if (!active) return;

        setServiceCount(newServicesCount);
        setAppointments(newAppointments);
        setServiceNotifications(newServicesLocal);
      } catch (error) {
        console.error("❌ Error verificando notificaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    check();
    const interval = setInterval(check, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const totalAppointmentsCount = appointments.length;
  const newServicesCount = serviceNotifications.length;

  const total = serviceCount + totalAppointmentsCount + newServicesCount;

  return (
    <div className="relative" id="notification-bell-container">
      {/* 🔔 Botón campanita */}
      <button
        id="btn-notification-bell"
        onClick={() => setShowPanel((p) => !p)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition duration-200"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {!showPanel && total > 0 && (
          <span
            id="badge-notification-count"
            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse"
          >
            {total}
          </span>
        )}

        {showPanel && total > 0 && (
          <span
            id="badge-notification-dot"
            className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"
          />
        )}
      </button>

      {/* 📩 Panel */}
      {showPanel && (
       <div
          id="notification-panel"
          className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 max-h-80 overflow-y-auto"
        >
          <div className="p-3">
            {isLoading ? (
              <p id="notification-loading" className="text-gray-400 text-sm italic">
                Actualizando...
              </p>
            ) : total === 0 ? (
              <p id="notification-empty" className="text-gray-500 text-sm">
                No hay nuevas notificaciones.
              </p>
            ) : (
              <div id="notification-list" className="flex flex-col gap-3 text-sm">
                {/* 🔵 Servicios desde BD */}
                {serviceCount > 0 && (
                  <div
                    id="btn-notification-new-services"
                    onClick={goToAgenda}
                    className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition"
                  >
                    <b>{serviceCount}</b> nuevas ofertas de trabajo publicadas.
                    <div className="text-xs text-blue-600">
                      Haz clic para ir a la agenda
                    </div>
                  </div>
                )}

                {/* 🟡 Servicios cargados localmente */}
                {serviceNotifications.length > 0 &&
                  serviceNotifications.map((s, idx) => (
                    <div
                      key={idx}
                      id={`notification-service-${idx}`}
                      className="p-2 border-l-4 border-yellow-500 bg-yellow-50 rounded"
                    >
                      <b>Servicio cargado recientemente</b>
                      <div>📌 {s.nombre}</div>
                      <div>💲 {s.precio}</div>
                    </div>
                  ))}

                {/* 🟢 Citas */}
                {appointments.map((ap, idx) => (
                  <div
                    key={idx}
                    id={`notification-appointment-${idx}`}
                    className="p-2 border-l-4 border-green-500 bg-green-50 rounded"
                  >
                    <b>
                      {ap.type === "update"
                        ? "Cita actualizada"
                        : ap.type === "cancel"
                        ? "Cita cancelada"
                        : "Nueva cita registrada"}
                    </b>

                    <div>👤 Fixer: {ap.fixerNombre}</div>
                    <div>🛠 Servicio: {ap.servicioNombre}</div>
                    <div>📅 Fecha: {ap.fecha}</div>

                    {ap.type !== "cancel" && (
                      <div>⏰ Hora: {ap.horaInicio} - {ap.horaFin}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón para limpiar notificaciones */}
          <div className="p-3">
            <button
              id="btn-clear-notifications"
              onClick={clearAppointments}
              className="w-full p-1 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Limpiar todas las notificaciones de citas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
