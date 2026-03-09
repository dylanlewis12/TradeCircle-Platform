const API_BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:3000" 
  : "/";

  console.log('🔧 API_BASE_URL:', API_BASE_URL);
  console.log('🔧 import.meta.env.MODE:', import.meta.env.MODE);

export default API_BASE_URL;