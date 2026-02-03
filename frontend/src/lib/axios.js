const BASE_URL = process.env.NODE_ENV === "production"
  ? "https://chatify-backend-xrvn.onrender.com/api"
  : "http://localhost:3000/api";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});
