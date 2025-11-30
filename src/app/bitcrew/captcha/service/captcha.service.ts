import axios from "@config/axios";

 // tu axios configurado

export const validarCaptcha = async (token: string) => {
  const res = await axios.post("/api/bitcrew/captcha/validate-captcha", {
    token,
  });

  return res.data;
};
