import axios from "axios";
import { queryClient } from "./AxiosTanstack";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401 && !isRedirecting) {
      isRedirecting = true;
      queryClient.setQueryData(["currentUser"], null);
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }
    return Promise.reject(error);
  }
);

export default api;
