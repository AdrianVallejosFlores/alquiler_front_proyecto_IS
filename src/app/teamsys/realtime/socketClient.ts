// src/app/teamsys/realtime/socketClient.ts
"use client";

// Fallback seguro para socket.io-client
let io: any = null;

try {
  io = require("socket.io-client");
} catch (error) {
  console.warn("socket.io-client no está disponible:", error);
  // Mock para desarrollo
  io = () => ({
    on: () => {},
    off: () => {},
    emit: () => {},
    disconnect: () => {},
    connected: false,
    id: null
  });
}

type Socket = any;

let socket: Socket | null = null;

export function getSocket(): Socket {
  console.log("🔥 getSocket fue llamado");

  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
    console.log("🌐 [socketClient] creando socket hacia:", url);

    socket = io(url, {
      autoConnect: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ [socketClient] conectado. id =", socket?.id);
    });

    socket.on("connect_error", (err: any) => {
      console.log("❌ [socketClient] connect_error:", err?.message ?? err);
    });

    socket.on("disconnect", (reason: any) => {
      console.log("🔌 [socketClient] disconnect. reason =", reason);
    });
  }

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}