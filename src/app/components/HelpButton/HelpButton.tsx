'use client';

import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, BookOpen, Headphones, Phone, X } from 'lucide-react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const BLOCK_TIME = 15 * 60 * 1000; // 15 minutos en milisegundos
const MAX_ATTEMPTS = 5;

export default function HelpButton() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [siteKey, setSiteKey] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockEndTime, setBlockEndTime] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HCaptcha>(null);

  // Verificar si el usuario está bloqueado al cargar el componente
  useEffect(() => {
    const blockData = localStorage.getItem('whatsappBlockData');
    if (blockData) {
      const { blockUntil, attempts } = JSON.parse(blockData);
      const now = Date.now();
      
      if (blockUntil && now < blockUntil) {
        setIsBlocked(true);
        setBlockEndTime(blockUntil);
        setAttemptCount(attempts);
      } else {
        // El bloqueo ha expirado, limpiar datos
        localStorage.removeItem('whatsappBlockData');
        localStorage.removeItem('whatsappAttempts');
        setIsBlocked(false);
        setAttemptCount(0);
      }
    } else {
      // Recuperar intentos previos si existen
      const savedAttempts = localStorage.getItem('whatsappAttempts');
      if (savedAttempts) {
        setAttemptCount(parseInt(savedAttempts));
      }
    }
  }, []);


  useEffect(() => {
    if (isBlocked && blockEndTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        if (now >= blockEndTime) {
          setIsBlocked(false);
          setAttemptCount(0);
          setBlockEndTime(null);
          localStorage.removeItem('whatsappBlockData');
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isBlocked, blockEndTime]);

  const handleWhatsAppClick = async () => {
    if (isBlocked) {
      const remainingTime = Math.ceil((blockEndTime! - Date.now()) / 1000 / 60);
      alert(`Está bloqueado temporalmente. Intente nuevamente en ${remainingTime} minutos.`);
      return;
    }

    try {
      const res = await fetch('/api/check-click');
      const data = await res.json();

      if (!res.ok || data.error) {
        console.error('Error de configuración:', data.error);
        alert('⚠️ Configuración de seguridad no disponible.\n\n' + 
              'El administrador debe configurar las variables de entorno de hCaptcha.\n' +
              'Por favor, contacte al equipo de desarrollo.');
        return;
      }

      if (!data.siteKey || data.siteKey === 'tu-site-key-aqui') {
        alert('⚠️ Las claves de hCaptcha no están configuradas correctamente.\n\n' +
              'Si eres desarrollador, consulta README_CAPTCHA.md para instrucciones.');
        return;
      }
   
      setCaptchaRequired(true);
      setSiteKey(data.siteKey);
    } catch (error) {
      console.error('Error al verificar clics:', error);
      alert('Error al conectar con el servidor. Intente nuevamente.');
    }
  };

  const onVerifyCaptcha = async (token: string) => {
  
    const newAttemptCount = attemptCount + 1;
    setAttemptCount(newAttemptCount);

  
    if (newAttemptCount >= MAX_ATTEMPTS) {
      const blockUntil = Date.now() + BLOCK_TIME;
      setIsBlocked(true);
      setBlockEndTime(blockUntil);
      
      localStorage.setItem('whatsappBlockData', JSON.stringify({
        blockUntil,
        attempts: newAttemptCount
      }));

      setCaptchaRequired(false);
      alert('Ha excedido el número máximo de intentos. Está bloqueado por 15 minutos.');
      return;
    }

    try {
      const res = await fetch('/api/verify-captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (data.success) {
      
        window.open('https://wa.me/59160379823?text=Hola%20necesito%20ayuda', '_blank');
        setCaptchaRequired(false);
        
        
        localStorage.setItem('whatsappAttempts', newAttemptCount.toString());
      } else {
        alert(`Captcha inválido. Intento ${newAttemptCount} de ${MAX_ATTEMPTS}`);
        setCaptchaRequired(false);
        
        
        localStorage.setItem('whatsappAttempts', newAttemptCount.toString());
      }
    } catch (error) {
      console.error('Error al verificar captcha:', error);
      alert('Error al verificar captcha. Intente nuevamente.');
      setCaptchaRequired(false);
    }
  };

  const handleFAQ = () => {
    window.location.href = '/preguntas-frecuentes';
    setIsMenuOpen(false);
  };

  const handleHelpCenter = () => {
    window.location.href = '/centro-de-ayuda';
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
    <div className="fixed z-[100] bottom-20 right-6 flex flex-col items-end gap-3" ref={menuRef}>
      {/* Menú desplegable - solo FAQ y Centro de Ayuda */}
      {isMenuOpen && (
        <div className="bg-white rounded-xl shadow-xl overflow-hidden w-60 animate-in slide-in-from-bottom-5 fade-in duration-200 border border-gray-100">
          <div className="py-1">
            <button
              onClick={handleFAQ}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-orange-50 transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-full group-hover:scale-105 transition-transform">
                <HelpCircle className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Preguntas Frecuentes</p>
                <p className="text-xs text-gray-500">Respuestas rápidas</p>
              </div>
            </button>

            <button
              onClick={handleHelpCenter}
              className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50 transition-all text-left group"
            >
              <div className="bg-gradient-to-br from-[#2a87ff] to-[#1366fd] p-2 rounded-full group-hover:scale-105 transition-transform">
                <BookOpen className="text-white" size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Centro de Ayuda</p>
                <p className="text-xs text-gray-500">Guías y tutoriales</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Botón de soporte - azul de la app */}
      <button 
        onClick={toggleMenu}
        aria-label="Soporte"
        className="w-14 h-14 bg-gradient-to-br from-[#2a87ff] to-[#1366fd] hover:from-[#1366fd] hover:to-[#0d4db8] text-white transition-all duration-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Headphones size={24} strokeWidth={2} />
      </button>

      {/* Botón de WhatsApp */}
      <button 
        onClick={handleWhatsAppClick}
        aria-label="WhatsApp"
        className="w-14 h-14 bg-gradient-to-br from-[#25D366] to-[#128C7E] hover:from-[#20BA5A] hover:to-[#0F7A6C] text-white transition-all duration-200 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        <Phone size={24} strokeWidth={2} fill="currentColor" />
      </button>
    </div>

    {/* Modal de Captcha con hCaptcha */}
    {captchaRequired && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md animate-in zoom-in-95 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Verificación de Seguridad</h3>
            </div>
            <button 
              onClick={() => setCaptchaRequired(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mensaje de advertencia si excede peticiones */}
          {attemptCount >= 3 && attemptCount < MAX_ATTEMPTS && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <span className="font-semibold">⚠️ Advertencia:</span> Le quedan {MAX_ATTEMPTS - attemptCount} intentos.
              </p>
            </div>
          )}

          {/* Instrucciones */}
          <p className="text-sm text-gray-600 mb-4">
            Por favor, complete la verificación de seguridad para continuar:
          </p>

          {/* hCaptcha Component */}
          <div className="flex justify-center mb-4">
            <HCaptcha
              sitekey={siteKey}
              onVerify={onVerifyCaptcha}
              ref={captchaRef}
              size="normal"
              theme="light"
            />
          </div>

          {/* Contador de intentos */}
          <p className="mt-4 text-xs text-center text-gray-500">
            Intento {attemptCount} de {MAX_ATTEMPTS}
          </p>

          {/* Botón de cancelar */}
          <button
            onClick={() => setCaptchaRequired(false)}
            className="w-full mt-4 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    )}
    </>
  );
}
