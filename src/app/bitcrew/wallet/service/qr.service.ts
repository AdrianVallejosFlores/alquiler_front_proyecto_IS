// Define la forma de la respuesta que esperamos del Backend
export interface QrResponse {
  token: string;
  expiresAt: string;
  monto: number;
}

export const qrService = {
  /**
   * Llama al backend para generar un nuevo QR
   */
  generarQr: async (userId: string, monto: number): Promise<QrResponse> => {
    // Usamos la variable de entorno que ya configuraste
    const baseUrl = process.env.NEXT_PUBLIC_API_URL; 
    
    // NOTA: Asegúrate de que la URL coincida con tu backend (bitcrew o devcode)
    // Según tu última prueba exitosa era: /api/bitcrew/qr/generar
    const url = `${baseUrl}/api/bitcrew/qr/generar`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, monto }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al generar el QR");
    }

    // El backend devuelve { success: true, data: { ... } }
    return data.data; 
  },
};