"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const RecargaQR: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 1. CAPTURAMOS EL ID DE LA URL
  const fixerId = searchParams.get("fixer_id") || searchParams.get("usuario");

  const [tipoDocumento, setTipoDocumento] = useState("CI");
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [monto, setMonto] = useState<number | string>("");
  const [nombre, setNombre] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [detalle, setDetalle] = useState<string>("");

  const [mostrarQR, setMostrarQR] = useState(false);
  const [saldo, setSaldo] = useState<number>(0.0);
  const [fechaHoraQR, setFechaHoraQR] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [montoError, setMontoError] = useState<string>("");
  const [correoError, setCorreoError] = useState("");
  const [errorServidor, setErrorServidor] = useState("");
  const [mensajeDocumento, setMensajeDocumento] = useState("");
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let valid = true;
    const montoNum = Number(monto);

    if (!monto) {
      valid = false;
      setMontoError("El monto es obligatorio");
    } else if (isNaN(montoNum) || montoNum <= 0 || montoNum > 3000) {
      valid = false;
      setMontoError("Monto inválido (1 - 3000 BS)");
    } else {
      setMontoError("");
    }

    if (!nombre || !/^[a-zA-Z\s]+$/.test(nombre) || nombre.length > 40) valid = false;
    if (!numeroDocumento || !/^\d+$/.test(numeroDocumento)) valid = false;
    if (!correo || correoError) valid = false;
    if (!telefono || telefono.length < 1) valid = false;
    if (detalle.length > 40) valid = false;

    setIsFormValid(valid);
  }, [monto, nombre, numeroDocumento, telefono, correo, correoError, detalle]);

  const handleMontoClick = (valor: number) => setMonto(valor);

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 3000) {
      setMonto(value);
    } else if (value === "") {
      setMonto("");
    }
  };

  const validarDocumento = (valor: string) => {
    if (!/^\d*$/.test(valor)) return;
    if (/^(\d)\1+$/.test(valor)) return;

    if (tipoDocumento === "CI") {
      if (valor.length <= 9) {
        setNumeroDocumento(valor);
        setMensajeDocumento("");
      } else {
        setMensajeDocumento("El CI es demasiado largo");
      }
    } else if (tipoDocumento === "NIT") {
      if (valor.length <= 12) {
        setNumeroDocumento(valor);
        setMensajeDocumento("");
      } else {
        setMensajeDocumento("El NIT debe tener máximo 12 dígitos");
      }
    }
  };

  const enviarRecarga = async (): Promise<boolean> => {
    setLoading(true);
    setErrorServidor("");
    
    try {
      const url = `${API_URL}/api/bitCrew/recarga`;
      console.log("📡 Enviando a:", url);

      const payload = {
        nombre,
        detalle: detalle || "Recarga de saldo",
        monto: Number(monto),
        correo,
        telefono,
        tipoDocumento,
        numeroDocumento,
        // 2. ENVIAMOS EL ID AL BACKEND (CRÍTICO PARA QUE NO FALLE)
        fixerId: fixerId 
      };

      const response = await axios.post(url, payload);

      console.log("✅ Respuesta:", response.data);

      if (response.data.success) {
        return true;
      } else {
        setErrorServidor(response.data.message || "Error desconocido");
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error:", error);
      const msg = error.response?.data?.message || "Error de conexión con el servidor.";
      setErrorServidor(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmar = async () => {
    const nuevosErrores: { [key: string]: string } = {};
    let valido = true;

    if (!monto || Number(monto) <= 0) {
      nuevosErrores.monto = "Monto inválido";
      valido = false;
    }
    if (!nombre) { nuevosErrores.nombre = "Requerido"; valido = false; }
    if (!numeroDocumento) { nuevosErrores.documento = "Requerido"; valido = false; }
    if (!telefono) { nuevosErrores.telefono = "Requerido"; valido = false; }
    if (!correo) { nuevosErrores.correo = "Requerido"; valido = false; }

    setErrores(nuevosErrores);
    if (!valido) return;

    const exito = await enviarRecarga();

    if (exito) {
      const ahora = new Date();
      setFechaHoraQR(ahora.toLocaleString("es-BO", { dateStyle: "short", timeStyle: "medium" }));
      setMostrarQR(true);
    }
  };

  const aceptarTransaccion = () => {
    // 3. REDIRECCIÓN SEGURA A LA WALLET
    if (fixerId) {
        router.push(`/bitcrew/wallet?fixer_id=${fixerId}`);
    } else {
        setMostrarQR(false);
        setMonto("");
        alert("Recarga procesada correctamente.");
    }
  };

  const descargarQR = async () => {
    if (!qrRef.current) return;
    alert("Descarga iniciada...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-2xl border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-[#11255A]">
          Recarga por QR
        </h1>

        {/* Aviso de seguridad si falta el ID */}
        {!fixerId && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-center text-sm border border-yellow-200">
                ⚠️ Advertencia: No se detectó tu usuario. La recarga podría fallar.
            </div>
        )}

        {errorServidor && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 border border-red-300 text-center text-sm font-medium">
            ⚠️ {errorServidor}
          </div>
        )}

        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex justify-center gap-3 flex-wrap w-full">
            {[10, 20, 50, 100, 200].map((valor) => (
              <button
                key={valor}
                className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-semibold transition-colors flex-1 sm:flex-none text-center"
                onClick={() => handleMontoClick(valor)}
              >
                {valor} Bs
              </button>
            ))}
          </div>
        </div>

        <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#11255A]">Monto</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black"
                value={monto}
                onChange={handleMontoChange}
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">BS</span>
            </div>
            {montoError && <p className="text-red-500 text-xs mt-1">{montoError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#11255A]">Nombre Completo</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 px-3 py-2 text-black"
              value={nombre}
              onChange={(e) => {
                 if (/^[a-zA-Z\s]*$/.test(e.target.value)) setNombre(e.target.value);
              }}
              placeholder="Ej: Juan Perez"
            />
            {errores.nombre && <p className="text-red-500 text-xs mt-1">{errores.nombre}</p>}
          </div>

          <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div>
                <label className="block text-sm font-medium mb-1 text-[#11255A]">Documento</label>
                <div className="flex gap-2">
                   <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-black"
                      placeholder="Nro. Documento"
                      value={numeroDocumento}
                      onChange={(e) => validarDocumento(e.target.value)}
                   />
                   <select 
                      className="border border-gray-300 rounded-md px-2 py-2 bg-gray-50 text-black"
                      value={tipoDocumento}
                      onChange={(e) => setTipoDocumento(e.target.value)}
                   >
                      <option value="CI">CI</option>
                      <option value="NIT">NIT</option>
                   </select>
                </div>
                {mensajeDocumento && <p className="text-red-500 text-xs mt-1">{mensajeDocumento}</p>}
             </div>

             <div>
                <label className="block text-sm font-medium mb-1 text-[#11255A]">WhatsApp</label>
                <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden">
                   <span className="bg-gray-100 px-3 py-2 text-gray-600 border-r border-gray-300">+591</span>
                   <input
                      type="text"
                      className="flex-1 px-3 py-2 outline-none text-black"
                      placeholder="70000000"
                      value={telefono}
                      onChange={(e) => {
                         const val = e.target.value;
                         if (/^\d*$/.test(val) && val.length <= 8) setTelefono(val);
                      }}
                   />
                </div>
                {errores.telefono && <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>}
             </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-[#11255A]">Correo Electrónico</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@gmail.com"
            />
            {errores.correo && <p className="text-red-500 text-xs mt-1">{errores.correo}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-[#11255A]">Concepto (Opcional)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-black"
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              maxLength={40}
              placeholder="Ej: Pago de servicio"
            />
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            disabled={!isFormValid || loading}
            onClick={handleConfirmar}
            className={`px-8 py-3 w-full sm:w-auto rounded-lg font-bold transition-all shadow-md
              ${!isFormValid || loading 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-[#11255A] text-white hover:bg-blue-900 active:scale-95"}`}
          >
            {loading ? "Procesando..." : "Generar QR y Pagar"}
          </button>
        </div>

        {mostrarQR && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div ref={qrRef} className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center relative border border-gray-200">
              
              <div className="flex items-center justify-center mb-4">
                 <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">TRANSACCIÓN REGISTRADA</span>
              </div>

              <h2 className="text-xl font-bold text-[#11255A] mb-2">Escanea para Pagar</h2>
              <p className="text-gray-500 text-sm mb-4">Usa tu aplicación de banco favorita</p>

              <div className="flex justify-center mb-6">
                <div className="bg-white p-2 rounded-xl border-2 border-[#11255A] shadow-inner">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Cobro-BitCrew-${nombre}-${monto}-BOB`}
                    alt="QR Code"
                    className="rounded-lg"
                    width={200}
                    height={200}
                  />
                </div>
              </div>

              <div className="text-left bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700 mb-6">
                <div className="flex justify-between">
                   <span className="font-semibold">Monto:</span>
                   <span className="font-bold text-[#11255A] text-lg">{monto} Bs</span>
                </div>
                <div className="flex justify-between">
                   <span className="font-semibold">Cliente:</span>
                   <span>{nombre}</span>
                </div>
                <div className="flex justify-between">
                   <span className="font-semibold">Fecha:</span>
                   <span>{fechaHoraQR.split(',')[0]}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={aceptarTransaccion}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Finalizar
                </button>
                <button
                  onClick={() => setMostrarQR(false)}
                  className="text-gray-500 hover:text-gray-800 font-medium text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecargaQR;
