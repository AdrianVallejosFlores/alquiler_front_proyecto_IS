"use client";

import { useEffect, useState } from "react";
import { getSocket } from "../realtime/socketClient";
import { cerrarSesion } from "../services/UserService";

export function useForceLogout(userId: string | null,accessToken: String | null) {
     const [isSocketReady, setIsSocketReady] = useState(false);
     const getSocketStatus = () => {
        const socket = getSocket();
        return socket.connected;  // Retorna si el socket está conectado
    };
     useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    const onConnect = () => {
        
      socket.emit("auth", {
  userId,
  accessToken
});
    };

    const onForceLogout = () => {
      cerrarSesion();
    };

    // Si ya está conectado, autenticamos directamente
    if (socket.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("force-logout", onForceLogout);

    return () => {
      socket.off("connect", onConnect);
      socket.off("force-logout", onForceLogout);
    };
  }, [userId]);
  return isSocketReady;
}
