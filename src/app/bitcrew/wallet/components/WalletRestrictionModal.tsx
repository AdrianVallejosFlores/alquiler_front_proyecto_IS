import React from 'react';

interface WalletRestrictionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WalletRestrictionModal({ isOpen, onClose }: WalletRestrictionModalProps) {
    // Si no está abierto, no renderizamos nada
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* El contenido se agregará en los siguientes commits */}
        </div>
    );
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Fondo con efecto BLUR y oscurecimiento */}
            <div
                className="absolute inset-0 bg-white/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Aquí irá la tarjeta */}
        </div>
    );
}
{/* Tarjeta del Mensaje */ }
<div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center z-10 animate-in fade-in zoom-in duration-300">

    {/* Icono de Exclamación */}
    <div className="flex justify-center mb-5">
        <div className="h-16 w-16 rounded-full border-4 border-[#11255A] flex items-center justify-center">
            <span className="text-[#11255A] text-4xl font-bold">!</span>
        </div>
    </div>

    <h3 className="text-lg font-bold text-gray-900 mb-3">
        ¡Falta poco para ponerte al día!
    </h3>

    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
        Para continuar usando nuestra plataforma sin interrupciones,
        te pedimos revisar y liquidar tus comisiones pendientes.
    </p>

    <button
        className="text-[#11255A] font-bold text-sm hover:underline cursor-pointer"
        onClick={() => console.log("Redirigir a pagos...")}
    >
        Haz clic aquí para ir a tus pagos.
    </button>
</div>