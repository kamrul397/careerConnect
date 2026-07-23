import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;
// saving user
export const saveUser = async (userData) => {
  const res = await axios.post(`${API}/api/users`, userData);

  return res.data;
};


// get user by email
export const getUserByEmail = async (email) => {
  const { data } = await axios.get(`${API}/api/users/${email}`);

  return data.user;
};