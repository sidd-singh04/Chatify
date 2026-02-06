// import axios from "axios";

// const BASE_URL =
//   import.meta.env.MODE === "production"
//     ? "https://chatify-backend-xrvn.onrender.com/api"
//     : "http://localhost:3000/api";

// export const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   withCredentials: true,
// });



import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatify-backend-xrvn.onrender.com/api",
  withCredentials: true,
});
