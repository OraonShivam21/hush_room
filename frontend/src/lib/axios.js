import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

if (import.meta.env.MODE === "development") {
  api.interceptors.response.use((response) => {
    console.log(response.data);
    return response;
  });
}
