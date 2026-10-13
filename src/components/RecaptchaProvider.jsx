"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function ReCaptchaProvider({ children }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LdjdCEfAAAAAO2Vpko_NM8FKQsX1xLJpVv3CgBa"
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
