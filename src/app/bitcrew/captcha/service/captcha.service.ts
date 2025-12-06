import axios from "@config/axios";

export const validarCaptcha = async (token: string) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bitcrew/captcha/validate-captcha`,
    { token }
  );

  return res.data; // { success: true }
};
