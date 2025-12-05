import { useState } from "react";
import { validarCaptcha } from "../service/captcha.service";

export function useCaptcha() {
  const [cargando, setCargando] = useState(false);
  const [valido, setValido] = useState(false);

  const verificarCaptcha = async (token: string | null) => {
    if (!token) return setValido(false);

    setCargando(true);
    const result = await validarCaptcha(token);
    setValido(result.success);
    setCargando(false);
  };

  return { cargando, valido, verificarCaptcha };
}
