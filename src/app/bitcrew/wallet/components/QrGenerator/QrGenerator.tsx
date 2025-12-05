import React, { useState, useEffect } from 'react';
import QRCode from "react-qr-code";
import './QrGenerator.css'; // Crearemos esto después

interface QrGeneratorProps {
  token: string;      // El token largo que te dio el backend
  monto: number;
  expiresAt: string;  // La fecha de expiración que te dio el backend
  onExpire: () => void; // Función para avisar al padre cuando el tiempo se acabe
}

export default function QrGenerator({ token, monto, expiresAt, onExpire }: QrGeneratorProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);

  // Lógica del Temporizador
  useEffect(() => {
    const targetDate = new Date(expiresAt).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        // ¡El tiempo se acabó!
        clearInterval(interval);
        setTimeLeft(0);
        setIsExpired(true);
        onExpire(); // Avisamos que expiró
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  // Formato MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`qr-container ${isExpired ? 'expired' : ''}`}>
      <h3>Cobrando al Cliente</h3>
      <div className="monto-display">Bs. {monto.toFixed(2)}</div>

      <div className="qr-box">
        {/* El código QR real */}
        <div className="qr-wrapper">
             {/* Importante: El valor del QR no es solo el token, 
                 usualmente es una URL o un JSON que el otro celular pueda leer */}
            <QRCode 
              value={JSON.stringify({ type: 'PAGO_BITCREW', token: token })} 
              size={200}
              level="H" // Alta corrección de errores
            />
        </div>
        
        {/* Capa de "Expirado" que cubre el QR */}
        {isExpired && (
            <div className="expired-overlay">
                <span>⚠️ Código Caducado</span>
            </div>
        )}
      </div>

      <div className="timer-display">
        {isExpired ? (
            <span className="text-red">Este código ya no es válido</span>
        ) : (
            <span>Expira en: <strong>{formatTime(timeLeft)}</strong> min</span>
        )}
      </div>

      {/* Botón Compartir (Solo si no ha expirado) */}
      {!isExpired && (
        <button className="share-button">
          Compartir
        </button>
      )}
    </div>
  );
}