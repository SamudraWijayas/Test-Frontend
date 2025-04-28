import axios from "axios";

const instance = axios.create({
  baseURL: "https://test-fe.mysellerpintar.com/api",
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("token="));
    if (token) {
      config.headers.Authorization = `Bearer ${token.split("=")[1]}`;
    }
  }
  return config;
});

export default instance;
