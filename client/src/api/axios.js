import axios from "axios";
const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach bearer token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shopez_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Catch 401 unauthorized errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear authentication cache
      localStorage.removeItem("shopez_token");
      localStorage.removeItem("shopez_user");
      
      // Prevent infinite redirect loops if already on login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
