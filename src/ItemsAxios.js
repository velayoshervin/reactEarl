import axios from "axios";

const API_BASE_URL = "http://localhost:8080/public/api/items";

export const getPagedItems = (page = 0, size = 10) => {
  return axios.get(API_BASE_URL, {
    params: { page, size },
  });
};

export const updateItem = ({ id, item }) => {
  return axios.put("http://localhost:8080/public/api/items", item, {
    params: { id },
    withCredentials: true,
  });
};

export const getEvents = () => {
  return axios.get("http://localhost:8080/public/api/event");
};

export const createItem = ({ item }) => {
  return axios.post("http://localhost:8080/public/api/items", item);
};

export const createUser = (payload) => {
  return axios.post("http://localhost:8080/public/user", payload);
};

export const loadDefaultCalendar = ({ page, size, pastDays }) => {
  return axios.get("http://localhost:8080/public/api/calendar", {
    params: { page, size, pastDays },
  });
};

export const updateCalendar = (payload) => {
  return axios.put("http://localhost:8080/public/api/calendar", payload);
};

export const logout = () => {
  return axios.post(
    "http://localhost:8080/api/auth/logout",
    {},
    {
      withCredentials: true,
    }
  );
};

export const testAdminApi = () => {
  return axios.get("http://localhost:8080/api/admin/test", {
    withCredentials: true,
  });
};

export const updateUserInfoSettings = ({ payload, userId }) => {
  return axios.put(
    "http://localhost:8080/public/user/update-userInfoSettings",
    payload,
    {
      withCredentials: true,
      params: { userId },
    }
  );
};

export const updateRole = (data) => {
  return axios.put("http://localhost:8080/public/user/update-role", data, {
    withCredentials: true,
  });
};

export const getUserAccounts = ({ filter, pageNumber, pageSize }) => {
  return axios.get("http://localhost:8080/public/user/userAccounts", {
    withCredentials: true,
    params: { filter, pageNumber, pageSize },
  });
};

export const getUsersByKeyword = (keyword) => {
  return axios.get("http://localhost:8080/public/user/search", {
    withCredentials: true,
    params: { keyword },
  });
};

export const getContacts = () => {
  return axios.get("http://localhost:8080/public/user/user-contacts", {
    withCredentials: true,
  });
};
