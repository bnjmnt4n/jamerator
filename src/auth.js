import * as CONFIG from "./config.js";

const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export async function generateAuthorizationUrl() {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);

  localStorage.setItem("code_verifier", codeVerifier);

  const url = new URL("https://accounts.spotify.com/authorize");
  const login_url_query = {
    response_type: "code",
    client_id: CONFIG.CLIENT_ID,
    scope: CONFIG.SCOPES,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: new URL("/callback", window.location.origin).toString(),
  };
  for (const [name, value] of Object.entries(login_url_query)) {
    url.searchParams.append(name, value);
  }

  return url.toString();
}

export async function getToken(code) {
  const codeVerifier = localStorage.getItem("code_verifier");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: CONFIG.CLIENT_ID,
      grant_type: "authorization_code",
      code,
      code_verifier: codeVerifier,
      redirect_uri: new URL("/callback", window.location.origin).toString(),
    }),
  });

  const json = await response.json();
  return json;
}
