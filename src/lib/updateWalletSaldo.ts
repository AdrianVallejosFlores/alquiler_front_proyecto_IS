export type SimpleRechargeResponse = {
  ok: boolean;
  message: string;
  saldo?: number;
};

export async function rechargeWalletSimple(monto: number): Promise<SimpleRechargeResponse> {
  try {
    // 👉 Validar que sea un número REAL (no NaN, no texto, no null)
    if (monto === null || monto === undefined || typeof monto !== "number" || isNaN(monto)) {
      return { ok: false, message: "El monto debe ser un número válido." };
    }

    // 👉 Se permite monto 0 o negativo
    const nuevoSaldo = monto;

    // 👉 Guardarlo en localStorage
    localStorage.setItem("wallet_saldo_prueba", String(nuevoSaldo));

    return {
      ok: true,
      message: "Saldo establecido correctamente.",
      saldo: nuevoSaldo,
    };

  } catch (error) {
    return {
      ok: false,
      message: "Error al guardar el saldo en localStorage.",
    };
  }
}
