// frontend/src/services/api.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const DEFAULT_TIMEOUT = 120000; // 120s - generation can be slow

async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal, ...options });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    // Normalize AbortError for UI
    if (err.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw err;
  }
}

/**
 * Normalized API response helper
 * returns { ok: boolean, data: any, error: string|null }
 */
async function handleResponse(response) {
  let text;
  try {
    text = await response.text();
  } catch (e) {
    return { ok: false, data: null, error: "Failed to read response body" };
  }

  // try to parse JSON if possible
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (e) {
    // not JSON
    payload = text;
  }

  if (!response.ok) {
    // Many errors come in as {"detail": "..."} from FastAPI
    const message = payload?.detail || payload?.message || String(payload) || response.statusText;
    return { ok: false, data: null, error: message };
  }

  return { ok: true, data: payload, error: null };
}

/** POST /generate  body: { url: "<wikipedia url>" } */
export async function generateQuiz(url) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    }, DEFAULT_TIMEOUT);
    return await handleResponse(res);
  } catch (err) {
    return { ok: false, data: null, error: err.message || "Network error" };
  }
}

/** GET /history?skip=0&limit=20 */
export async function getHistory({ skip = 0, limit = 20 } = {}) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/history?skip=${skip}&limit=${limit}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    }, 15000);
    return await handleResponse(res);
  } catch (err) {
    return { ok: false, data: null, error: err.message || "Network error" };
  }
}

/** GET /quiz/{id} */
export async function getQuizById(id) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/quiz/${id}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    }, 15000);
    return await handleResponse(res);
  } catch (err) {
    return { ok: false, data: null, error: err.message || "Network error" };
  }
}

/** (Optional) GET /history/full - if you need full list */
export async function getFullHistory() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/history/full`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    }, 30000);
    return await handleResponse(res);
  } catch (err) {
    return { ok: false, data: null, error: err.message || "Network error" };
  }
}

export default {
  generateQuiz,
  getHistory,
  getQuizById,
  getFullHistory,
};
