// spotifyAuth.js

const CLIENT_ID = "d6398aae662347e2b1854d7985ba6eb4"
const REDIRECT_URI = "https://wraptify.netlify.app/"
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token"
const SCOPES = "user-top-read user-read-private user-read-email"

function generateRandomString(length) {
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(x => possible[x % possible.length])
    .join('')
}

async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(codeVerifier)
  const digest = await crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

// Step 1: Redirect user to Spotify login
export async function redirectToSpotifyAuth() {
  const codeVerifier = generateRandomString(128)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  localStorage.setItem("code_verifier", codeVerifier)

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  })

  window.location = `${AUTH_ENDPOINT}?${params.toString()}`
}

// Step 2: Exchange code for token
export async function getAccessToken(code) {
  const codeVerifier = localStorage.getItem("code_verifier")

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  })

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  })

  const data = await response.json()
  if (data.access_token) {
    localStorage.setItem("token", data.access_token)
  }

  return data.access_token
}
