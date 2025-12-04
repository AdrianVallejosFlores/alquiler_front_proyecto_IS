// src/app/auth/google/callback/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function Inner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        const state = searchParams.get('state');

        //console.log('📋 Parámetros recibidos:', { code, error, errorDescription, state });

        // ✅ CORRECCIÓN: Mejor manejo de errores de Google
        if (error) {
          const detailedError = errorDescription 
            ? `${error}: ${decodeURIComponent(errorDescription)}`
            : `Error de Google: ${error}`;
          
          //console.error('❌ Error de OAuth:', detailedError);
          
          // Manejo específico de access_denied
          if (error === 'access_denied') {
            throw new Error('Acceso denegado por el usuario o configuración incorrecta de OAuth. Verifica las URIs de redirección en Google Cloud Console.');
          }
          
          throw new Error(detailedError);
        }
        
        if (!code) {
          throw new Error('No se recibió código de autorización de Google');
        }

        // Determinar tipo de autenticación (registro o login)
        let authType: 'register' | 'login' = 'register';
        if (state) {
          try {
            const decodedState = JSON.parse(atob(state));
            authType = decodedState.type || 'register';
          } catch {
            console.warn('No se pudo decodificar el state, usando registro por defecto');
          }
        }

        //console.log(`🔐 Procesando ${authType} con Google...`);

        const backend = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'https://alquiler-back-soft-war2.vercel.app/';
        
        // ENVIAR authType al backend
        const response = await fetch(`${backend}api/teamsys/google/callback`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            code,
            authType,
            // ✅ CORRECCIÓN: Enviar redirect_uri para verificación en backend
            redirect_uri: `${window.location.origin}/auth/google/callback`
          }),
        });

        const responseText = await response.text();
        const data = responseText ? JSON.parse(responseText) : {};

        //console.log('📊 Respuesta del backend:', { status: response.status, data });

        if (!data.success) {
          if (data.message === 'usuario ya registrado') {
            if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
  const emailFromBackend: string | undefined =
    data?.data?.user?.email ?? data?.data?.user?.correo ?? data?.data?.email;
  window.opener.postMessage(
    {
      type: 'google-auth-success',
      email: emailFromBackend,
    },
    window.location.origin
  );
  window.close();
  return; // no seguir con el flujo normal
}
//
            if(data.data.user.authProvider=='local'){
              throw new Error("metodo de autenticacion no activado para este correo");
              
            }
            if (data) {
      const token = data.data.accessToken ?? data.data.token; 

      if (token) sessionStorage.setItem('authToken', token);

      sessionStorage.setItem('userData', JSON.stringify(data.data.user));
    }
      
      // Disparar evento de login exitoso para que el Header se actualice
      if(data.data.user.twoFactorEnabled){
        sessionStorage.setItem("checkSeguridad", "true");
      router.push('/loginSeguridad')
      return
      }
          sessionStorage.setItem("login",'true')
          const eventLogin = new CustomEvent("login-exitoso");
          window.dispatchEvent(eventLogin);
          router.push('/');
            return;
          }
          
          // CASO 2: Usuario no encontrado (durante LOGIN) → Error
          if (response.status === 400 && data.message === 'usuario no encontrado' && authType === 'login') {
            throw new Error('No existe una cuenta con este correo. Regístrate primero.');
          }

          // CASO 3: Otros errores
          throw new Error(data.message || `Error del servidor: ${response.status}`);
        }

        // ✅ AUTENTICACIÓN EXITOSA
        if (data.success && data.data) {
          const { user, accessToken, refreshToken } = data.data;

          // Guardar datos de sesión
          localStorage.setItem('authToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('userData', JSON.stringify(user));

          // Disparar evento de login exitoso
          window.dispatchEvent(new CustomEvent("login-exitoso"));

          setStatus('success');

          if (authType === 'register') {
            // REGISTRO exitoso → Guardar datos y redirigir a ImagenLocalizacion
            sessionStorage.setItem('datosUsuarioParcial', JSON.stringify({
              nombre: user.nombre || '',
              correo: user.correo || '',
              fotoPerfil: user.fotoPerfil || '',
              terminosYCondiciones: true,
            }));
            setMessage('🎉 ¡Registro exitoso! Redirigiendo...');
            setTimeout(() => router.push('/ImagenLocalizacion'), 2000);
          } else {
            throw new Error(data.message || 'Error en la autenticación con Google');
          }
        }

        //Extraer datos correctamente desde data.data
        const user = data.data.user;
        const accessToken = data.data.accessToken;
        const refreshToken = data.data.refreshToken;
          // >>> Añadir: soporte POPUP (linkear método)
// Si este callback fue abierto en popup, devolvemos SOLO el email y cerramos.
if (typeof window !== 'undefined' && window.opener && window.opener !== window) {
  const emailFromProfile: string | undefined = user?.email ?? user?.correo;
  window.opener.postMessage(
    {
      type: 'google-auth-success',
      email: emailFromProfile,
    },
    window.location.origin
  );
  window.close();
  return; // no continuar con guardados ni redirecciones normales
}
// <<< Fin añadido
        //  Guardar token y usuario
        localStorage.setItem('userToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(user));

        //  Guardar en sessionStorage para ImagenLocalizacion
        sessionStorage.setItem('datosUsuarioParcial', JSON.stringify(user));

        // (Si luego usas finalizeFromGoogleProfile, aquí lo puedes llamar)
        // await finalizeFromGoogleProfile?.(user);

        // Redirigir a /ImagenLocalizacion
        setTimeout(() => {
          router.push('/ImagenLocalizacion');
        }, 1500);

      } catch (error) {
        console.error('❌ Error en autenticación:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Error desconocido');
        
        // Redirigir después de error
        setTimeout(() => {
          router.push('/login');
        }, 5000); // ✅ Aumentado a 5 segundos para leer el error
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700">Procesando autenticación...</h2>
              <p className="text-gray-500 mt-2">Completando con Google</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">¡Éxito!</h2>
              <p className="text-gray-500 mt-2">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-700">Error de Autenticación</h2>
              <p className="text-red-500 mt-2 break-all whitespace-pre-wrap">{message}</p>
              <p className="text-gray-500 text-sm mt-4">
                <strong>Solución:</strong> Verifica que las URIs de redirección en Google Cloud Console coincidan con:
                <br />
                <code className="bg-gray-100 p-1 rounded text-xs">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/auth/google/callback
                </code>
              </p>
              <p className="text-gray-500 text-sm mt-2">Redirigiendo al login en 5 segundos...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando...</p>
        </div>
      </div>
    }>
      <Inner />
    </Suspense>
  );
}