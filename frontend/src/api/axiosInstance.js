import axios from "axios";

const API = axios.create({
  baseURL: "https://my-academy-umber.vercel.app/api",
});

// Automatic JWT Token Attachment
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;