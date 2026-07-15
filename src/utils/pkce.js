// PKCE (Proof Key for Code Exchange) helpers — required for OAuth "public
// clients" like a browser app, which can't safely keep a client secret.
// Instead of a secret, we generate a random `verifier`, derive a
// `challenge` from it, send the challenge up front when redirecting to
// login, then later prove we hold the original verifier when exchanging
// the returned code for a real token.

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function generateRandomString(length = 64) {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes).slice(0, length);
}

export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}
