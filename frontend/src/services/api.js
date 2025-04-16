import axios from "axios";

function getCSRFToken() {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrftoken") {
      return decodeURIComponent(value);
    }
  }
  return null;
}

const api = axios.create({
  baseURL: "/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const csrfToken = getCSRFToken();
  if (
    csrfToken &&
    ["post", "put", "patch", "delete"].includes(config.method.toLowerCase())
  ) {
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export const getCSRF = () => api.get("csrf/");
export const fetchUser = () => api.get("user/");
export const login = (username, password) =>
  api.post("login/", { username, password });
export const logout = () => api.post("logout/");
export const register = (username, password) =>
  api.post("register/", {username, password});

export default api;
