"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { rechargeWalletSimple } from "@/lib/updateWalletSaldo";
import { useCrearServicio } from "@/lib/useCrearServicio";
import { verificarCondicionDias } from "@/lib/checkNewServices";

interface UserData {
  request: {
    nombre: string;
    correo: string;
    numero: string;
  };
  fixer: {
    nombre: string;
    correo: string;
    numero: string;
  };
}

export default function VentanaPrueba() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<UserData>({
    request: { nombre: "", correo: "", numero: "" },
    fixer: { nombre: "", correo: "", numero: "" },
  });

  const [horaSistema, setHoraSistema] = useState("");
  const [montoRecarga, setMontoRecarga] = useState("");
  const [nombreServicio, setNombreServicio] = useState("");
  const [days, setDays] = useState("");
  

  const { crearServicio, loading: loadingServicio, error: errorServicio } =
    useCrearServicio();

  // Load localStorage data only in client
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("env_prueba");
    if (stored) setData(JSON.parse(stored));

    const savedDays = localStorage.getItem("appLoadedAt");
    if (savedDays) setDays(savedDays);

    const savedHora = localStorage.getItem("hora_sistema");
    if (savedHora) setHoraSistema(savedHora);
  }, []);

  const handleSave = () => {
    localStorage.setItem("env_prueba", JSON.stringify(data, null, 2));
    alert("✅ Datos guardados correctamente");
  };

  const handleChange = (
    section: "request" | "fixer",
    field: keyof UserData["request"],
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };


  const handleDaysSave = () => {
    const base = localStorage.getItem("appLoadedAt");

    if (!base) {
      alert("⚠️ No existe appLoadedAt en localStorage. Recarga la app.");
      return;
    }

    const fecha = new Date(base);
    if (isNaN(fecha.getTime())) {
      alert("❌ appLoadedAt no es una fecha válida.");
      return;
    }

    const n = Number(days);
    if (isNaN(n)) {
      alert("❌ Ingresa un número válido.");
      return;
    }

    // Sumamos días
    fecha.setDate(fecha.getDate() + n);

    // Guardamos en ISO
    const nuevaFechaISO = fecha.toISOString();
    localStorage.setItem("appLoadedAt", nuevaFechaISO);

    //  LEER OTRA VEZ DEL LOCALSTORAGE
    const verificadoISO = localStorage.getItem("appLoadedAt");
    const fechaVerificada = verificadoISO ? new Date(verificadoISO) : null;

    //  Formato bonito dd/mm/yyyy HH:MM
    const formatDate = (d: Date) => {
      const pad = (x: number) => String(x).padStart(2, "0");
      return (
        pad(d.getDate()) +
        "/" +
        pad(d.getMonth() + 1) +
        "/" +
        d.getFullYear() +
        " " +
        pad(d.getHours()) +
        ":" +
        pad(d.getMinutes())
      );
    };

    const formateado = fechaVerificada ? formatDate(fechaVerificada) : verificadoISO;

    alert("🔎 Inactividad actualizado:\n" + formateado);

    verificarCondicionDias();
  };

  const handleRecharge = async () => {
    const monto = Number(montoRecarga);
    if (isNaN(monto)) {
      alert("❌ Ingresa un número válido.");
      return;
    }

    const res = await rechargeWalletSimple(monto);
    if (res.ok) {
      alert(`💰 Nuevo saldo: Bs. ${res.saldo}`);
      setMontoRecarga("");
    } else {
      alert("❌ Error al recargar");
    }
  };

  const handleCrearServicio = async () => {
    if (!nombreServicio.trim()) {
      alert("❌ Nombre vacío");
      return;
    }

    const servicio = await crearServicio(nombreServicio);
    if (servicio) {
      alert("🆕 Servicio creado correctamente");
      setNombreServicio("");
    } else {
      alert("❌ Error al crear servicio");
    }
  };

  return (
    <>
      <Button
        id="btn-open-config"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
        onClick={() => setOpen(true)}
      >
        ⚙️
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* 🎯 Modal compacto */}
        <DialogContent className="w-[650px] max-h-[85vh] overflow-y-auto rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Configuración RECODE</DialogTitle>
            <DialogDescription>
              Ajustes rápidos de Requester, Fixer, Wallet y Servicios. (el numero se debe poner asi: 59177777777)
            </DialogDescription>
          </DialogHeader>

          {/* 🎯 GRID de dos columnas */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {/* =============== HORARIO DEL SISTEMA (OCUPA DOS COLUMNAS) =============== */}
            <div className="p-4 rounded-xl border bg-white col-span-2">
              <h3 className="font-semibold text-pink-500">
                Horario del Sistema
              </h3>

              <label className="text-sm text-gray-500 mt-2 block">
                Seleccione un horario:
              </label>

              <select
                value={horaSistema}
                onChange={(e) => setHoraSistema(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              >
                <option value="">-- Seleccionar --</option>
                <option value="mañana">Mañana</option>
                <option value="tarde">Tarde</option>
                <option value="noche">Noche</option>
              </select>

              <Button
                onClick={() => {
                  if (!horaSistema) {
                    alert("⚠️ Selecciona un horario primero");
                    return;
                  }
                  localStorage.setItem("hora_sistema", horaSistema);
                  setHoraSistema(horaSistema);
                  alert("⏰ Horario guardado: " + horaSistema);
                }}
                className="bg-pink-500 hover:bg-pink-700 text-white w-full"
              >
                Guardar Horario
              </Button>
            </div>

            {/* =============== DÍAS EXTRA =============== */}
            <div className="p-4 rounded-xl border bg-gray-50">
              <h3 className="font-semibold text-indigo-600">
                Añadir dias Inactividad
              </h3>

              <label className="text-sm text-gray-500 mt-2 block">
                Cantidad de días:
              </label>
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="mb-3"
              />

              <Button
                onClick={handleDaysSave}
                className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
              >
                Guardar días
              </Button>
            </div>

            {/*  WALLET  */}
            <div className="p-4 rounded-xl border bg-gray-50">
              <h3 className="font-semibold text-purple-600">
                Recargar Wallet del Fixer
              </h3>

              <label className="text-sm text-gray-500">Monto:</label>
              <Input
                type="number"
                value={montoRecarga}
                onChange={(e) => setMontoRecarga(e.target.value)}
                className="mb-3"
              />

              <Button
                onClick={handleRecharge}
                className="bg-purple-600 hover:bg-purple-700 text-white w-full"
              >
                Recargar
              </Button>
            </div>

            {/*  REQUESTER  */}
            <div className="p-4 rounded-xl border bg-white">
              <h3 className="font-semibold text-blue-600">Datos del Requester</h3>

              {["nombre", "correo", "numero"].map((field) => (
                <div key={field} className="mb-3">
                  <label className="text-sm text-gray-500 capitalize">
                    {field}:
                  </label>
                  <Input
                    value={data.request[field as keyof UserData["request"]]}
                    onChange={(e) =>
                      handleChange("request", field as any, e.target.value)
                    }
                  />
                </div>
              ))}

              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
              >
                Guardar Request
              </Button>
            </div>

            {/*  FIXER  */}
            <div className="p-4 rounded-xl border bg-white">
              <h3 className="font-semibold text-green-600">Datos del Fixer</h3>

              {["nombre", "correo", "numero"].map((field) => (
                <div key={field} className="mb-3">
                  <label className="text-sm text-gray-500 capitalize">
                    {field}:
                  </label>
                  <Input
                    value={data.fixer[field as keyof UserData["fixer"]]}
                    onChange={(e) =>
                      handleChange("fixer", field as any, e.target.value)
                    }
                  />
                </div>
              ))}

              <Button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                Guardar Fixer
              </Button>
            </div>

            {/*  SERVICIO (OCUPA LAS 2 COLUMNAS)  */}
            <div className="p-4 rounded-xl border bg-white col-span-2">
              <h3 className="font-semibold text-orange-600">
                Crear Servicio
              </h3>

              <label className="text-sm text-gray-500">Nombre:</label>
              <Input
                value={nombreServicio}
                onChange={(e) => setNombreServicio(e.target.value)}
                className="mb-3"
              />

              {errorServicio && (
                <p className="text-red-500 text-sm mb-3">{errorServicio}</p>
              )}

              <Button
                onClick={handleCrearServicio}
                disabled={loadingServicio}
                className="bg-orange-600 hover:bg-orange-700 text-white w-full"
              >
                {loadingServicio ? "Creando..." : "Crear Servicio"}
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
