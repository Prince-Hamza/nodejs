import axios from "axios";
import { domain } from "../constants/constants";

const API = axios.create({ baseURL:domain});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const getUser = (userId) => API.get(`/user/${userId}`);
export const updateUser = (id, formData) =>  API.put(`/user/${id}`, formData);
export const getAllUser = () => API.get('/user');
export const followUser = (id, data) => API.put(`/user/${id}/follow`, data);
export const unfollowUser = (id, data) => API.put(`/user/${id}/unfollow`, data);
export const deleteUser = (id) => API.delete(`/user/${id}`);


export const getUserById = (userId) => API.get(`/user/${userId}`);
