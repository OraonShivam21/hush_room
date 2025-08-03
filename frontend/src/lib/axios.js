import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "/api",
  withCredentials: true,
});

if (import.meta.env.MODE === "development") {
  api.interceptors.response.use((response) => {
    console.log(response.data);
    return response;
  });
}
