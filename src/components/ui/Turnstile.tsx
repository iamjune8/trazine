"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Cloudflare Turnstile widget for forms that submit via `fetch()` with a
 * JSON body rather than a native form POST — so this captures the token
 * through the JS callback API and hands it to the caller, rather than
 * relying on Turnstile's usual auto-injected hidden input.
 *
 * Renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set, so forms
 * keep working exactly as before until the key is added.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function Turnstile({
  onVerify,
  onExpire,
}: {
  onVerify: (token: string) => void;
  onExpire?: () => void;
}) {
  const containerId = useId();
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled) return;
        const container = document.getElementById(containerId);
        if (!container || !window.turnstile) return;

        widgetIdRef.current = window.turnstile.render(container, {
          sitekey: siteKey,
          callback: onVerify,
          "expired-callback": onExpire,
        });
      })
      .catch((error) => console.error("[turnstile]", error));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- render once; onVerify/onExpire are stable enough in practice and re-rendering the widget on every parent re-render would reset it mid-fill
  }, [siteKey, containerId]);

  if (!siteKey) return null;

  return <div id={containerId} className="mt-2" />;
}
