"use client";

import { useState, useEffect } from "react";
import "./walletAlert.css";

import { 
  notifyFixerBalance, 
  notifyFixerBalanceNegative 
} from "@/lib/wallet_alert_gmail";

interface WalletAlertProps {
  balance: number;
  estado?: string;
}

export default function WalletAlert({ balance, estado }: WalletAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [saldoVisible, setSaldoVisible] = useState(balance);

  const getEstadoFromSaldo = (saldo: number) => {
    if (saldo > 0) return "enpositivo";
    if (saldo === 0) return "encero";
    return "ennegativo";
  };

  useEffect(() => {
    const rawSaldo = localStorage.getItem("wallet_saldo_prueba");
    const saldoLocal = rawSaldo !== null ? Number(rawSaldo) : balance;

    const saldoFinal = saldoLocal ?? balance;
    const estadoActual = getEstadoFromSaldo(saldoFinal);

    setSaldoVisible(saldoFinal);

    // ALERTA SIEMPRE, INDEPENDIENTE DE CORREO
    const shouldAlert =
      estadoActual === "encero" ||
      estadoActual === "ennegativo" ||
      estado === "restringido";

    setShowAlert(shouldAlert);

    // -----------------------------------------
    //         CONTROL DE NOTIFICACIONES
    // -----------------------------------------
    const estadoPrevio =
      localStorage.getItem("wallet_estado") ?? "enpositivo";

    // Guardar siempre el saldo actual
    localStorage.setItem("wallet_saldo_prueba", String(saldoFinal));

    // Si no cambió el estado → no enviar correo, pero sí mostrar el mensaje
    if (estadoActual === estadoPrevio) return;

    // Sí cambió → enviar correo
    if (estadoActual === "encero") {
      notifyFixerBalance(saldoFinal, estado ?? "");
    }

    if (estadoActual === "ennegativo") {
      notifyFixerBalanceNegative(saldoFinal, estado ?? "");
    }

    // Actualizar estado
    localStorage.setItem("wallet_estado", estadoActual);

  }, [balance, estado]);

  if (!showAlert) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-modal">
        <div className="alert-header">
          <span className="alert-icon">⚠️</span>
        </div>

        <h2 className="alert-title">Saldo insuficiente</h2>

        <p className="alert-message">
          Tu saldo actual es{" "}
          <span className="alert-balance">
            Bs. {saldoVisible.toFixed(2)}
          </span>
          .
        </p>

        <p className="alert-message">
          Recarga tu billetera para continuar usando los servicios.
        </p>

        <button
          className="alert-button"
          onClick={() => setShowAlert(false)}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
