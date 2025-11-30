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