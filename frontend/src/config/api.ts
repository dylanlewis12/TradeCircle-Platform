const API_BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3000"
  : import.meta.env.VITE_API_BASE_URL || "https://tradecircle-backend.onrender.com";

export default API_BASE_URL;