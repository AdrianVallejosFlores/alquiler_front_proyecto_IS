declare module "react-google-recaptcha" {
  import * as React from "react";

  export interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    theme?: "light" | "dark";
    size?: "compact" | "normal";
    badge?: "bottomright" | "bottomleft" | "inline";
    tabindex?: number;
  }

  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {}
}
