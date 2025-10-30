// utils/acquiredService.js

const BASE_URL = process.env.ACQUIRED_API_URL;

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Fetch a valid access token from Acquired API.
 * Uses cached token if still valid.
 */
export async function fetchAccessToken() {
   if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
   }
  if(BASE_URL === undefined) throw new Error("ACQUIRED_API_URL not set in env")

  if (!process.env.ACQUIRED_APP_ID || !process.env.ACQUIRED_APP_KEY) {
    throw new Error("ACQUIRED_APP_ID or ACQUIRED_APP_KEY not set in env");
  }

  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: process.env.ACQUIRED_APP_ID,
      app_key: process.env.ACQUIRED_APP_KEY,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Authentication failed: ${text}`);
  }

  const data = await response.json();
 
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // 1 min buffer
 
  return cachedToken;
}

/**
 * Generic helper to call any Acquired API endpoint.
 * Automatically handles authentication.
 * Supports GET and POST requests.
 * @param {string} endpoint - API endpoint after base URL
 * @param {object} payload - request body for POST (optional)
 * @param {string} method - "GET" or "POST" (default "POST")
 */
export async function callAcquiredApi(endpoint, payload = {}, method = "POST") {
  const token = await fetchAccessToken();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (process.env.NODE_ENV === "production" && process.env.ACQUIRED_APP_COMPANY_ID) {
    headers["Company-Id"] = process.env.ACQUIRED_APP_COMPANY_ID;
  } else {
    console.warn(
      `[AcquiredAPI] Skipping Company-Id header (NODE_ENV=${process.env.NODE_ENV})`
    );
  }

  const options = { method, headers };

  if (method === "POST") {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${BASE_URL}/${endpoint}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Acquired API error (${endpoint}): ${text}`);
  }

  return response.json();
}

