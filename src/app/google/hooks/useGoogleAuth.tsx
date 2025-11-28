'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type AuthType = 'register' | 'login';

type GoogleProfile = {
  name?: string;
  email?: string;
  picture?: string;
};

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGoogleAuth = useCallback(async (type: AuthType = 'register') => {
    setIsLoading(true);
    setError(null);

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

      // 🔥 Usa SIEMPRE tu dominio deployado
      const redirectUri = "https://front-servineo-1wz6.vercel.app/auth/google/callback";

      console.log("🔐 Configuración OAuth:", {
        clientId: clientId ? "✅ Configurado" : "❌ Faltante",
        redirectUri,
        type,
      });

      if (!clientId) {
        throw new Error("Google Client ID no configurado");
      }

      const state = btoa(
        JSON.stringify({
          type,
          timestamp: Date.now(),
          nonce: Math.random().toString(36).substring(2, 15),
        })
      );

      const authParams = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        state,
        nonce: Math.random().toString(36).substring(2, 15),
      });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`;

      window.location.href = googleAuthUrl;

      return { success: true };
    } catch (err) {
      console.error("❌ Error en autenticación con Google:", err);
      const errorMsg = err instanceof Error ? err.message : "Error desconocido";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const finalizeFromGoogleProfile = useCallback(
    (profile: GoogleProfile) => {
      const datos = {
        nombre: profile.name ?? "",
        correo: profile.email ?? "",
        fotoPerfil: profile.picture,
        terminosYCondiciones: true,
      };

      sessionStorage.setItem("datosUsuarioParcial", JSON.stringify(datos));
      router.push("/ImagenLocalizacion");
    },
    [router]
  );

  return {
    isLoading,
    error,
    handleGoogleAuth,
    finalizeFromGoogleProfile,
  };
};
