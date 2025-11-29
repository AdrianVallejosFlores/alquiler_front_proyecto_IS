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

  const [montoRecarga, setMontoRecarga] = useState("");
  const [nombreServicio, setNombreServicio] = useState("");

  const { crearServicio, loading: loadingServicio, error: errorServicio } =
    useCrearServicio();

  useEffect(() => {
    const stored = localStorage.getItem("env_prueba");
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (err) {
        console.error("Error al leer env_prueba:", err);
      }
    }

    const storedMonto = localStorage.getItem("wallet_saldo_prueba");
    if (storedMonto) {
      setMontoRecarga("");
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("env_prueba", JSON.stringify(data, null, 2));
    alert("✅ Datos guardados en env_prueba");
    setOpen(false);
  };

  const handleChange = (
    section: "request" | "fixer",
    field: keyof UserData["request"],
    value: string
  ) => {
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleRecharge = async () => {
    const monto = Number(montoRecarga);
    if (isNaN(monto)) {
      alert("❌ El monto debe ser un número válido.");
      return;
    }

    const res = await rechargeWalletSimple(monto);
    if (res.ok) {
      alert(`✅ Saldo establecido: Bs. ${res.saldo}`);
      setMontoRecarga("");
    } else {
      alert(`❌ Error: ${res.message}`);
    }
  };

  const handleCrearServicio = async () => {
    if (!nombreServicio.trim()) {
      alert("❌ El nombre del servicio no puede estar vacío.");
      return;
    }

    const servicio = await crearServicio(nombreServicio);

    if (servicio) {
      alert("✅ Servicio creado correctamente");
      setNombreServicio("");
    } else {
      alert("❌ Error al crear servicio");
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <Button
        id="btn-open-config"
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
        onClick={() => setOpen(true)}
      >
        ⚙️
      </Button>

      {/* Ventana modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>Configuración RECODE</DialogTitle>
            <DialogDescription>
              Datos del Requester, Fixer, Wallet y creación de servicios
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* 🟣 Request */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-semibold mb-2 text-blue-600">
                Datos del Request
              </h3>

              <Input
                placeholder="Nombre"
                value={data.request.nombre}
                onChange={(e) =>
                  handleChange("request", "nombre", e.target.value)
                }
                className="mb-2"
              />

              <Input
                placeholder="Correo"
                value={data.request.correo}
                onChange={(e) =>
                  handleChange("request", "correo", e.target.value)
                }
                className="mb-2"
              />

              <Input
                placeholder="Número (WhatsApp)"
                value={data.request.numero}
                onChange={(e) =>
                  handleChange("request", "numero", e.target.value)
                }
              />
            </div>

            {/* 🟡 Fixer */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h3 className="text-md font-semibold mb-2 text-green-600">
                Datos del Fixer
              </h3>

              <Input
                placeholder="Nombre"
                value={data.fixer.nombre}
                onChange={(e) => handleChange("fixer", "nombre", e.target.value)}
                className="mb-2"
              />

              <Input
                placeholder="Correo"
                value={data.fixer.correo}
                onChange={(e) => handleChange("fixer", "correo", e.target.value)}
                className="mb-2"
              />

              <Input
                placeholder="Número"
                value={data.fixer.numero}
                onChange={(e) => handleChange("fixer", "numero", e.target.value)}
              />
            </div>

            {/* 💸 Recarga Wallet */}
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="text-md font-semibold mb-2 text-purple-600">
                Recargar o Actualizar Billetera (para fixer)
              </h3>

              <Input
                placeholder="Monto de recarga"
                type="number"
                value={montoRecarga}
                onChange={(e) => setMontoRecarga(e.target.value)}
                className="mb-2"
              />
            </div>

            {/* 🆕 Crear Servicio */}
            <div className="border rounded-lg p-4 bg-white">
              <h3 className="text-md font-semibold mb-2 text-orange-600">
                Crear Servicio de Prueba
              </h3>

              <Input
                placeholder="Nombre del servicio"
                value={nombreServicio}
                onChange={(e) => setNombreServicio(e.target.value)}
                className="mb-3"
              />

              {errorServicio && (
                <p className="text-red-500 text-sm mt-2">{errorServicio}</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 mt-4">

              <Button
                onClick={handleCrearServicio}
                disabled={loadingServicio}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {loadingServicio ? "Creando..." : "Crear Servicio"}
              </Button>

              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancelar
              </Button>

              <Button
                id="btn-guardar-config"
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Guardar
              </Button>

              <Button
                id="btn-recharge"
                onClick={handleRecharge}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Recargar Wallet
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
