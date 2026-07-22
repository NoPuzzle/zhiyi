"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/base-path";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    const register = () => {
      const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "dev";

      navigator.serviceWorker
        .register(withBasePath(`/sw.js?v=${encodeURIComponent(version)}`), {
          scope: withBasePath("/"),
          updateViaCache: "none",
        })
        .then((registration) => registration.update())
        .catch(() => {
          // Registration failure should not block the app.
        });
    };

    if (document.readyState === "complete") {
      register();
      return;
    }

    window.addEventListener("load", register, { once: true });

    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
