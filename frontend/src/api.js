export const api = async (path, { method = "GET", body, token } = {}) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
};
