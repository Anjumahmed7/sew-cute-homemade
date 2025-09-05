const BASE = import.meta.env.VITE_API_URL;

async function request(path, { method = "GET", body, headers } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // send/receive httpOnly JWT cookie
  });

  // Try to parse JSON either way
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = data?.message || `HTTP ${res.status}`;
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

  // Products for later use
  getProducts: (q = "") => request(`/api/products${q ? `?${q}` : ""}`),

  getProduct: (slug) => request(`/api/products/${slug}`),

  // Order (use later)
  createOrder: (payload) =>
    request("/api/orders", { method: "POST", body: payload }),
};

export default api;
