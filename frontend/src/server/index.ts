import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000";

export interface IUserDto {
  id?: number;
  name: string;
  age: number | null;
  gender: "female" | "male" | "";
  password: string;
  techs: string[];
  profile: {
    nickname: string;
    bio: string;
  };
  createdAt?: string;
}

export const getUserList = (data: { keyWord: string }) =>
  axios.get("/users", { params: data }).then((res) => res.data);

export const addUser = (data: IUserDto) =>
  axios.post("/users", data).then((res) => res.data);

export const updateUser = (data: IUserDto) =>
  axios.patch(`/users/${data.id}`, data).then((res) => res.data);

export const deleteUser = (data: IUserDto) =>
  axios.delete(`/users/${data.id}`).then((res) => res.data);
