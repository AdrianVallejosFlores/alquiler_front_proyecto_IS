'use client';

import { useEffect, useState } from "react";
import AppointmentButton from "./components/AgendarCitaButton";
import Sidebar from "./components/Sidebar";
import EnvConFigModal from "./components/EnvConfigModal";

interface Fixer {
  _id: string;
  name?: string;
  photoUrl?: string;
  city?: string;
  ratingAvg?: number;
}

interface Servicio {
  _id: string;
  nombre: string;
  descripcion: string;
  precio?: number;
  precio_base?: number;
  rating?: number;
  proveedorId?: Fixer | null; 
}

export default function Home() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchServiciosConFixer = async () => {
      try {
        console.log("🔹 Fetching servicios...");
        const res = await fetch(`${API_URL}/api/devcode/servicios`);
        const data = await res.json();
        console.log("🔹 Servicios crudos:", data);

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Respuesta inesperada del backend:", data);
          setServicios([]);
          return;
        }

        // Mapear servicios y traer fixers
        const serviciosConFixer: Servicio[] = await Promise.all(
          data.data.map(async (serv: any) => {
            console.log("🔹 Procesando servicio:", serv.nombre, "proveedorId:", serv.proveedorId);

            let userId: string | undefined;

            if (typeof serv.proveedorId === "string") {
              userId = serv.proveedorId;
            } else if (serv.proveedorId?.userId) {
              userId = serv.proveedorId.userId;
            }

            if (userId) {
              try {
                const fixerRes = await fetch(`${API_URL}/api/fixers/user/${userId}`);
                const fixerData = await fixerRes.json();
                console.log(`🔹 Fixer para ${serv.nombre}:`, fixerData);

                if (fixerData.success && fixerData.data) {
                  const fixer = fixerData.data;
                  // Mapear id a _id para compatibilidad
                  serv.proveedorId = { ...fixer, _id: fixer._id ?? fixer.id };
                } else {
                  serv.proveedorId = null;
                }
              } catch (err) {
                console.error("Error al cargar fixer:", err);
                serv.proveedorId = null;
              }
            } else {
              serv.proveedorId = null;
            }

            return serv;
          })
        );

        console.log("🔹 Servicios con fixers:", serviciosConFixer);
        setServicios(serviciosConFixer);
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setServicios([]);
      }
    };

    fetchServiciosConFixer();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 relative">
      <Sidebar />

      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-full max-w-7xl px-4 mb-6">
          <h1 className="text-3xl font-bold mb-1 text-left">
            Servicios Profesionales
          </h1>
          <h3 className="text-left text-gray-600">
            Encuentra y agenda el servicio que necesitas
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-7xl px-4">
          {servicios.map((serv) => {
            const fixer = serv.proveedorId ?? null;

            return (
              <div
                key={serv._id}
                className="bg-white p-6 rounded-xl shadow-lg flex flex-col justify-between min-h-[250px]"
              >
                {/* Avatar y nombre del fixer */}
                <div className="flex items-center mb-4">
                  <div className="bg-purple-500 text-white font-bold rounded-xl h-12 w-12 flex items-center justify-center mr-4">
                    {fixer?.name
                      ? fixer.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "?"}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold">{serv.nombre}</h3>
                    <p className="text-gray-600 text-sm">
                      {fixer?.name || "Fixer no asignado"}
                    </p>
                  </div>
                </div>

                {/* Descripción */}
                <p className="text-gray-700 text-sm flex-1">
                  {serv.descripcion}
                </p>

                {/* Precio */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-purple-600 font-bold text-lg">
                    ${serv.precio ?? serv.precio_base ?? 0}
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={`text-yellow-400 ${
                          i < (fixer?.ratingAvg ?? serv.rating ?? 0)
                            ? "opacity-100"
                            : "opacity-30"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="ml-2 text-gray-700 font-semibold text-sm">
                      {fixer?.ratingAvg ?? serv.rating ?? 0}{" "}
                      {(fixer?.ratingAvg ?? serv.rating ?? 0) === 1
                        ? "estrella"
                        : "estrellas"}
                    </span>
                  </div>
                </div>

                {/* Botón de agendar */}
                <div className="mt-4 flex justify-end">
                  {fixer && (
                    <AppointmentButton
                      proveedorId={fixer._id}
                      servicioId={serv._id}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <EnvConFigModal />
    </div>
  );
}
