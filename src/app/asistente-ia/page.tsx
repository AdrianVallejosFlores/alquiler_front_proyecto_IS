'use client';

import React from 'react';
import { ArrowLeft, Bot, Mic, Camera, MessageSquare, Zap, Video } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AsistentePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pt-4">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Botón de Volver */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
        </div>

        {/* Encabezado */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 rounded-full mb-4">
            <Bot size={48} className="text-purple-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tu Asistente Inteligente Servineo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre cómo nuestra Inteligencia Artificial te ayuda desde WhatsApp con tus consultas para solicitar un servicio.
          </p>
        </div>

        {/* --- LISTA DE CARACTERÍSTICAS (ORDENADA) --- */}
        <div className="space-y-24 mb-20">
          
          {/* 1. CHAT MEDIANTE TEXTO */}
          <div className="flex flex-col items-center">
             <div className="text-center max-w-2xl mb-8">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-orange-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">1. Consultas mediante texto</h3>
              <p className="text-gray-600 text-lg">
                Envía tus dudas escribiendo directamente en el chat. El asistente Servineo analizará tu mensaje y te responderá 
                con recomendaciones precisas sobre qué servicio solicitar.
              </p>
            </div>

            <div className="w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
              <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="bg-white">
                <Image 
                  src="/capturas/demo-chat.png" 
                  alt="Ejemplo de chat en PC"
                  width={1200}
                  height={800}
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* 2. NOTAS DE VOZ*/}
          <div className="flex flex-col items-center">
            <div className="text-center max-w-2xl mb-8">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mic className="text-blue-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">2. Consultas mediante notas de voz</h3>
              <p className="text-gray-600 text-lg">
                Graba o envía un audio explicando tu problema. El asistente transcribirá tu mensaje, entenderá el contexto y te dará una 
                respuesta clara en segundos. Ideal para consultas largas o cuando no puedes escribir.
              </p>
            </div>
            
            <div className="w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
              <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="bg-white">
                <Image 
                  src="/capturas/demo-audio.png" 
                  alt="Ejemplo de nota de voz en PC"
                  width={1200}
                  height={800}
                  className="w-full h-auto block" 
                />
              </div>
            </div>
          </div>

          {/* 3. ANÁLISIS DE FOTOS */}
          <div className="flex flex-col items-center">
             <div className="text-center max-w-2xl mb-8">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Camera className="text-green-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">3. Consultas mediante imágenes</h3>
              <p className="text-gray-600 text-lg">
                Sube o envía una foto del problema que necesitas resolver (por ejemplo, una pared dañada o un electrodoméstico averiado).
                 El asistente analizará la imagen y te sugerirá el servicio más adecuado para tu necesidad.
              </p>
            </div>

            <div className="w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
              <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="bg-white">
                <Image 
                  src="/capturas/demo-foto.png" 
                  alt="Ejemplo de análisis de imagen en PC"
                  width={1200}
                  height={800}
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

          {/* 4. ANÁLISIS DE VIDEO*/}
          <div className="flex flex-col items-center">
             <div className="text-center max-w-2xl mb-8">
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Video className="text-red-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">4. Consultas mediante video</h3>
              <p className="text-gray-600 text-lg">
                ¿Una imagen no es suficiente? Graba un video corto mostrando el problema en detalle. El asistente lo procesará 
                y te orientará sobre qué tipo de servicio necesitas, brindándote una orientación más rápida y precisa.
              </p>
            </div>

            <div className="w-full max-w-4xl shadow-2xl rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
              <div className="h-8 bg-gray-800 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              
              <div className="bg-white">
                <Image 
                  src="/capturas/demo-video.png" 
                  alt="Ejemplo de análisis de video en PC"
                  width={1200}
                  height={800}
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Sección Final*/}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold mb-4">¿Listo para probarlo?</h2>
          <p className="mb-6 text-green-100">
            Interactúa ahora mismo con nuestro asistente en WhatsApp.
          </p>
          
        </div>


      </main>
    </div>
  );
}