"use client";

import ReCAPTCHA from "react-google-recaptcha";

type Props = {
  onVerify: (token: string | null) => void;
};

export default function Recaptcha({ onVerify }: Props) {
  const handleChange = (token: string | null) => {
    onVerify(token);
  };

  return (
    <div>
      <ReCAPTCHA
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        onChange={handleChange}
        theme="light"
      />
    </div>
  );
}
