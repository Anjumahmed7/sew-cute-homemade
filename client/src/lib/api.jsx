// const BASE = import.meta.env.VITE_API_URL;

// async function request(path, { method = "GET", body, headers } = {}) {
//   const res = await fetch(`${BASE}${path}`, {
//     method,
//     headers: {
//       "Content-Type": "application/json",
//       ...headers,
//     },
//     body: body ? JSON.stringify(body) : undefined,
//     credentials: "include", // send/receive httpOnly JWT cookie
//   });

//   // Try to parse JSON either way
//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     const msg = data?.message || `HTTP ${res.status}`;
//     const err = new Error(msg);
//     err.status = res.status;
//     err.data = data;
//     throw err;
//   }
//   return data;
// }

// export const api = {
//   // AUTH
//   signup: (payload) =>
//     request("/api/auth/signup", { method: "POST", body: payload }),

//   login: (payload) =>
//     request("/api/auth/login", { method: "POST", body: payload }),
//   me: () => request("/api/auth/me"),

//   logout: () => request("/api/auth/logout", { method: "POST" }),

//   // Products for later use
//   getProducts: (q = "") => request(`/api/products${q ? `?${q}` : ""}`),

//   getProduct: (slug) => request(`/api/products/${slug}`),

//   // Order (use later)
//   createOrder: (payload) =>
//     request("/api/orders", { method: "POST", body: payload }),
// };

// export default api;
const BASE = import.meta.env.VITE_API_URL ?? ""; // e.g. "https://api.example.com/"

function buildUrl(path, params) {
  const url = new URL(path, BASE); // safe join
  if (params && typeof params === "object") {
    const qs = new URLSearchParams(params);
    // Avoid adding "?" when qs is empty
    if ([...qs].length) url.search = qs.toString();
  }
  return url.toString();
}

async function request(
  path,
  {
    method = "GET",
    body,
    headers,
    params, // optional object for query string
    timeout = 15000, // 15s default timeout
    credentials = "include", // needed for cookie-based auth
  } = {}
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  // Only set JSON header when sending a plain object
  const isJsonBody =
    body &&
    !(body instanceof FormData) &&
    !(body instanceof Blob) &&
    !(body instanceof ArrayBuffer);

  const finalHeaders = {
    ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
    ...headers,
  };

  const res = await fetch(buildUrl(path, params), {
    method,
    headers: finalHeaders,
    body: isJsonBody ? JSON.stringify(body) : body, // pass FormData/Blob as-is
    credentials,
    signal: controller.signal,
  }).catch((e) => {
    clearTimeout(timer);
    // Network/abort error normalization
    const err = new Error(
      e.name === "AbortError"
        ? "Request timed out"
        : e.message || "Network error"
    );
    err.isNetworkError = true;
    throw err;
  });

  clearTimeout(timer);

  // Handle empty bodies (204/205/HEAD)
  if (res.status === 204 || res.status === 205 || method === "HEAD") {
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.status = res.status;
      throw err;
    }
    return null; // or {} if you prefer
  }

  const ct = res.headers.get("content-type") || "";
  let data;
  try {
    if (ct.includes("application/json")) {
      data = await res.json();
    } else {
      // fallback: read as text; still useful for error messages
      const text = await res.text();
      data = text?.length ? { message: text } : {};
    }
  } catch {
    data = {};
  }

  if (!res.ok) {
    const msg =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
      `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // AUTH
  signup: (payload) =>
    request("/api/auth/signup", { method: "POST", body: payload }),
  login: (payload) =>
    request("/api/auth/login", { method: "POST", body: payload }),
  me: () => request("/api/auth/me"),
  logout: () => request("/api/auth/logout", { method: "POST" }),

  // PRODUCTS
  // Accept an object and turn it into query string: e.g. { q: "dress", page: 2 }
  getProducts: (params = {}) => request("/api/products", { params }),
  getProduct: (slug) => request(`/api/products/${slug}`),

  // ORDERS
  createOrder: (payload) =>
    request("/api/orders", { method: "POST", body: payload }),
};

export default api;
