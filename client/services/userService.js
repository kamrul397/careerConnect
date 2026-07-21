import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const saveUser = async (userData) => {
  const res = await axios.post(`${API}/api/users`, userData);

  return res.data;
};