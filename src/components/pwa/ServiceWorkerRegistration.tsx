"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/base-path";

const developmentResetKey = "zhiyi-development-service-worker-reset";

function isZhiyiWorker(scriptUrl?: string) {
  if (!scriptUrl) {
    return false;
  }

  return new URL(scriptUrl).pathname === withBasePath("/sw.js");
}

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then(async (registrations) => {
          const zhiyiRegistrations = registrations.filter((registration) =>
            isZhiyiWorker(
              registration.active?.scriptURL ??
                registration.waiting?.scriptURL ??
                registration.installing?.scriptURL,
            ),
          );
          const hasZhiyiController = isZhiyiWorker(
            navigator.serviceWorker.controller?.scriptURL,
          );

          if (zhiyiRegistrations.length === 0 && !hasZhiyiController) {
            sessionStorage.removeItem(developmentResetKey);
            return;
          }

          await Promise.all(
            zhiyiRegistrations.map((registration) => registration.unregister()),
          );

          if (
            hasZhiyiController &&
            sessionStorage.getItem(developmentResetKey) !== "complete"
          ) {
            sessionStorage.setItem(developmentResetKey, "complete");
            window.location.reload();
          }
        })
        .catch(() => {
          // Development cleanup should never block the app.
        });

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
