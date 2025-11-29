"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";

export default function GoogleSignInButton() {
  const { signOut, user, processOAuthCallback, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Chequear si hay callback de OAuth cuando se carga la página
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.has("from_oauth")) {
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const handleSignIn = async () => {
    try {
      setRedirecting(true);
      // Solicitar la URL de login a backend (puerto 5000)
      const res = await fetch("http://localhost:5000/api/devcode/auth/google-login");
      const data = await res.json();
      if (data.authUrl) {
        // Redirigir a Google
        window.location.href = data.authUrl;
      }
    } catch (e) {
      console.error("Error initiating Google login:", e);
      alert("Error iniciando sesión con Google");
      setRedirecting(false);
    }
  };

  return (
    <div>
      {user ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {user.picture && <img src={user.picture} alt="avatar" width={28} height={28} style={{ borderRadius: 999 }} />}
          <span style={{ fontSize: 14 }}>{user.name ?? user.email}</span>
          <button onClick={() => signOut()} style={{ marginLeft: 8 }} disabled={isLoading}>
            Cerrar sesión
          </button>
        </div>
      ) : (
        <button onClick={handleSignIn} disabled={redirecting || isLoading}>
          {redirecting ? "Redirigiendo..." : "Iniciar sesión con Google"}
        </button>
      )}
    </div>
  );
}
