"use client";

import { useEffect, useState, useRef  } from "react";
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

  const [lastSeenServiceCount, setLastSeenServiceCount] = useState(0);

  // 👉 Control total leído
  const [lastTotalUnread, setLastTotalUnread] = useState(0);

  // 👉 Control de si hay novedades reales
  const [hasNew, setHasNew] = useState(false);

  // ============================
  // LOCALSTORAGE
  // ============================
  const getReadIds = (key: string) => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  };

  const setReadIds = (key: string, ids: string[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(ids));
  };

  const loadTempServices = () => {
    if (typeof window === "undefined") return [];
    const services = [];
    let index = 1;

    while (localStorage.getItem(`temp_service${index}`)) {
      const service = JSON.parse(localStorage.getItem(`temp_service${index}`) || "{}");
      if (service) services.push({ ...service, _id: `service_${index}` });
      index++;
    }
    return services;
  };

  const loadTempAppointments = () => {
    if (typeof window === "undefined") return [];
    const appointments = [];
    let index = 1;

    while (localStorage.getItem(`temp_appointment${index}`)) {
      const ap = JSON.parse(localStorage.getItem(`temp_appointment${index}`) || "{}");
      if (ap) appointments.push({ ...ap, _id: `appointment_${index}` });
      index++;
    }
    return appointments;
  };

  const clearAppointments = () => {
    let index = 1;
    while (localStorage.getItem(`temp_appointment${index}`)) {
      localStorage.removeItem(`temp_appointment${index}`);
      index++;
    }
    setAppointments([]);
    setReadIds("read_appointments", []);
  };

  const markAllAsRead = () => {
    const readServices = serviceNotifications.map((s) => s._id);
    const readAppointments = appointments.map((a) => a._id);

    setReadIds("read_local_services", readServices);
    setReadIds("read_appointments", readAppointments);
  };

  // ============================
  // CUANDO ABRES PANEL
  // ============================

  const prevShow = useRef(false);


  useEffect(() => {
    if (prevShow.current === true && showPanel === false) {
      // 🔥 Se cerró el panel -> ahora sí marcar como leído
      markAllAsRead();
      setHasNew(false);

      const total =
        serviceCount +
        serviceNotifications.length +
        appointments.length;

      setLastSeenServiceCount(serviceCount);
      setLastTotalUnread(total);
    }

    prevShow.current = showPanel;
  }, [showPanel]);


  const readServices = getReadIds("read_local_services");
  const readAppts = getReadIds("read_appointments");

  // ============================
  // CHECK AUTOMÁTICO
  // ============================
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

        // --------------------------
        // DETECTAR SI HAY NOVEDADES
        // --------------------------
        const unreadLocalServices = newServicesLocal.filter(s => !readServices.includes(s._id)).length;
        const unreadLocalAppts = newAppointments.filter(a => !readAppts.includes(a._id)).length;

        const backendHasNew = newServicesCount > lastSeenServiceCount;
        const localHasNew = unreadLocalServices > 0 || unreadLocalAppts > 0;

        const totalCurrent = newServicesCount + newServicesLocal.length + newAppointments.length;

        const realNew = totalCurrent > lastTotalUnread || backendHasNew || localHasNew;

        setHasNew(realNew);
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
  }, [lastSeenServiceCount, lastTotalUnread]);

  // ============================
  // VALORES DERIVADOS
  // ============================

  // 1️⃣ Contar backend NO LEÍDO
  const unreadBackend = Math.max(serviceCount - lastSeenServiceCount, 0);

  // 2️⃣ Contar servicios locales NO LEÍDOS
  const unreadLocalServices = serviceNotifications.filter(s => !readServices.includes(s._id)).length;

  // 3️⃣ Contar citas locales NO LEÍDAS
  const unreadLocalAppts = appointments.filter(a => !readAppts.includes(a._id)).length;

  // 4️⃣ TOTAL NO LEÍDO
  const unreadTotal = unreadBackend + unreadLocalServices + unreadLocalAppts;

  // Este será el numerito del ícono 🔴
  const totalUnread = unreadTotal;



  return (
    <div className="relative">

      <button
        onClick={() => setShowPanel(p => !p)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition duration-200"
      >
        <Bell className="w-6 h-6 text-gray-700" />

        {/* 🔴 NUMERITO SOLO SI HAY NUEVO */}
        {!showPanel && totalUnread > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {totalUnread}
          </span>
        )}
      </button>

      {showPanel && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
          <div className="p-3">
            {isLoading ? (
              <p className="text-gray-400 text-sm italic">Actualizando...</p>
            ) : (serviceCount + serviceNotifications.length + appointments.length) === 0 ? (
              <p className="text-gray-500 text-sm">No hay nuevas notificaciones.</p>
            ) : (
              <div className="flex flex-col gap-3 text-sm">

                {serviceCount > 0 && (
                  <div
                    onClick={() => {
                      router.push("/booking/agenda");
                      setShowPanel(false);
                    }}
                    className="p-2 border-l-4 border-blue-500 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition"
                  >
                    <b>{serviceCount}</b> nuevas ofertas de trabajo publicadas.
                  </div>
                )}

                {serviceNotifications.slice().reverse().map((s, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border-l-4 rounded ${
                      readServices.includes(s._id)
                        ? "border-green-300 bg-green-50"
                        : "border-green-800 bg-green-100"
                    }`}
                  >
                    <b>Servicio cargado recientemente</b>
                    <div>📌 {s.nombre}</div>
                    <div>💲 {s.precio}</div>
                  </div>
                ))}

                {appointments.slice().reverse().map((ap, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border-l-4 rounded ${
                      readAppts.includes(ap._id)
                        ? "border-green-300 bg-green-50"
                        : "border-green-800 bg-green-100"
                    }`}
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
                      <div>
                        ⏰ Hora: {ap.horaInicio} - {ap.horaFin}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3">
            <button
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