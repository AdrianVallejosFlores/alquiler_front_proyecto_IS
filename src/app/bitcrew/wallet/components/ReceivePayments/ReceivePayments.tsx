"use client";

import React, { useState } from "react";
import QrGenerator from "../QrGenerator/QrGenerator"; // Tu componente visual
import { qrService, QrResponse } from "../../service/qr.service"; // Servicio para llamar al backend
import "./ReceivePayments.css"; // Crearemos esto en el siguiente paso

interface ReceivePaymentProps {
  userId: string;       // Necesitamos saber QUIÉN cobra
  onBack: () => void;   // Función para volver al menú principal
}

export default function ReceivePayment({ userId, onBack }: ReceivePaymentProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrData, setQrData] = useState<QrResponse | null>(null);

  const handleGenerate = async () => {
    // Validación simple
    const montoNumerico = parseFloat(amount);
    if (!amount || isNaN(montoNumerico) || montoNumerico <= 0) {
      setError("Por favor ingresa un monto válido.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. LLAMADA AL BACKEND REAL 🚀
      const data = await qrService.generarQr(userId, montoNumerico);
      setQrData(data); // Guardamos el token real
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrData(null); // Borra el QR para generar uno nuevo
    setAmount("");
    setError(null);
  };

  // --- VISTA 2: MOSTRAR EL QR (Cuando ya tenemos datos) ---
  if (qrData) {
    return (
      <div className="receive-payment-container">
        <button className="close-button" onClick={onBack}>✕ Cerrar</button>
        
        {/* Aquí usamos tu componente QrGenerator conectado a datos reales */}
        <QrGenerator
          token={qrData.token}
          monto={qrData.monto}
          expiresAt={qrData.expiresAt}
          onExpire={() => { console.log("El token ha expirado en la UI"); }}
        />

        <button className="secondary-button" onClick={handleReset}>
          Generar Nuevo Cobro
        </button>
      </div>
    );
  }

  // --- VISTA 1: FORMULARIO (Configuración) ---
  return (
    <div className="receive-payment-container">
      <div className="header-nav">
        <button className="back-link" onClick={onBack}>&lt; Volver</button>
        <h2>Recibir Pago</h2>
      </div>

      <div className="form-content">
        <label>¿Cuánto quieres cobrar?</label>
        
        <div className="input-group">
          <span className="currency-symbol">Bs.</span>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <button 
          className="primary-button" 
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generando..." : "GENERAR CÓDIGO QR"}
        </button>
      </div>
    </div>
  );
}