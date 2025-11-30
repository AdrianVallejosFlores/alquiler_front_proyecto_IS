import React from 'react';

interface WalletRestrictionModalProps {
    isOpen: boolean;
    onClose: () => void; // Añadimos esto por si quieres cerrarlo al hacer click fuera (opcional)
}

export default function WalletRestrictionModal({ isOpen, onClose }: WalletRestrictionModalProps) {
    if (!isOpen) return null;

    return (
        // 1. Contenedor fijo que cubre toda la pantalla (z-index alto)
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* 2. Fondo con efecto BLUR (Desenfoque) y oscurecimiento leve */}
            {/* Usamos backdrop-blur-md para el efecto de vidrio esmerilado del mockup */}
            <div
                className="absolute inset-0 bg-white/60 backdrop-blur-sm transition-opacity"
                onClick={onClose} // Cierra si clicas fuera (útil para pruebas)
            />

            {/* 3. La Tarjeta del Mensaje (Modal) */}
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center z-10 animate-in fade-in zoom-in duration-300">

                {/* Icono de Exclamación (Estilo personalizado según mockup) */}
                <div className="flex justify-center mb-5">
                    <div className="h-16 w-16 rounded-full border-4 border-[#11255A] flex items-center justify-center">
                        <span className="text-[#11255A] text-4xl font-bold">!</span>
                    </div>
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                    ¡Falta poco para ponerte al día!
                </h3>

                {/* Texto del cuerpo */}
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Para continuar usando nuestra plataforma sin interrupciones,
                    te pedimos revisar y liquidar tus comisiones pendientes.
                </p>

                {/* Link / Botón de acción */}
                <button
                    className="text-[#11255A] font-bold text-sm hover:underline cursor-pointer"
                    onClick={() => console.log("Redirigir a pagos...")}
                >
                    Haz clic aquí para ir a tus pagos.
                </button>
            </div>
        </div>
    );
}