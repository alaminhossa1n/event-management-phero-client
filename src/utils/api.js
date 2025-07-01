import axios from "axios";

const API_BASE_URL = "https://event-management-server-omega.vercel.app/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  signup: (userData) => api.post("/user/signup", userData),
  login: (credentials) => api.post("/user/login", credentials),
  getProfile: () => api.get("/user/profile"),
};

// Events APIs
export const eventsAPI = {
  createEvent: (eventData) => api.post("/events/create", eventData),
  getAllEvents: (params = {}) => api.get("/events/all", { params }),
  getMyEvents: () => api.get("/events/my-events"),
  joinEvent: (eventId) => api.post("/events/join", { eventId }),
  updateEvent: (eventId, eventData) =>
    api.patch(`/events/${eventId}`, eventData),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
};

export default api;
