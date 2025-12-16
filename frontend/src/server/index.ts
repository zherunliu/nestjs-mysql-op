import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

export const getUserList = (data: { keyWord: string }) =>
  axios.get("/users", { params: data }).then((res) => res.data);

export const addUser = (data) =>
  axios.post("/users", data).then((res) => res.data);

export const updateUser = (data) =>
  axios.patch(`/users/${data.id}`, data).then((res) => res.data);

export const deleteUser = (data) =>
  axios.delete(`/users/${data.id}`).then((res) => res.data);
