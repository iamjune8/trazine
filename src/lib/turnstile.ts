/**
 * Server-side verification for Cloudflare Turnstile. Inert until
 * TURNSTILE_SECRET_KEY is set — same pattern as GA4/Resend elsewhere in
 * this codebase — so the forms keep working exactly as before until the
 * key is added, then CAPTCHA enforcement turns on with no further
 * deploys needed.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstileToken(
  token: unknown,
  remoteIp?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  if (typeof token !== "string" || !token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch(VERIFY_URL, { method: "POST", body });
    const data = (await response.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[turnstile] verification request failed", error);
    // Fail closed — a network hiccup talking to Cloudflare shouldn't be
    // indistinguishable from "the bot didn't even try".
    return false;
  }
}
