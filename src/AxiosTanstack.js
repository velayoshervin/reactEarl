import api from "./api";
import { QueryClient, QueryCache } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      retry: false,
    },
  },
});

queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === "query" && event.action?.type === "error") {
    const error = event.action.error;
    if (error?.response?.status === 401) {
      queryClient.setQueryData(["currentUser"], null);

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
  }
});

export const fetchUserContacts = async () => {
  const response = await api.get(
    "http://localhost:8080/public/user/user-contacts"
  );
  return response;
};

export const uploadAvatar = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId.toString());

    const res = await api.post(
      "http://localhost:8080/public/user/upload-avatar",
      formData,
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Upload error:", error.response?.data || error.message);
    throw error;
  }
};

export const fetchCurrentUser = async () => {
  const res = await api.get(
    "http://localhost:8080/protected/api/userData/me",

    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const fetchCalendarData = async (userId) => {
  return await api.get("http://localhost:8080/calendar/data", {
    params: { userId: userId },
  });
};
