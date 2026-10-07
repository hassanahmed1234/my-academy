import axios from "axios";

const API = axios.create({
  baseURL: "https://my-academy-umber.vercel.app/api",
  withCredentials: true, // Yeh browser ko cookie attach karne ke liye signal deta hai
});

// Request interceptor ki ab zaroorat nahi hai, cookies automatically attach hongi!

export default API;