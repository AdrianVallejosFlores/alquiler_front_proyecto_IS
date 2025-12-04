// src/app/teamsys/realtime/socketClient.ts
"use client";

import io from "socket.io-client";

type Socket = ReturnType<typeof io>;

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const url = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    socket = io(url, {
      autoConnect: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
    });

    // SOLO CAMBIA ESTO: tipa el parámetro
    socket.on("connect_error", (err: any) => {
    });

    socket.on("disconnect", (reason: any) => {
    });
  }

  return socket;
}
