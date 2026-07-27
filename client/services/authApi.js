import axios from "@/lib/axios";

export const getJwt = async (user) => {
	const { data } = await axios.post("/api/auth/jwt", user);
	return data;
};

export const logoutJwt = async () => {
	const { data } = await axios.post("/api/auth/logout");
	return data;
};


export const testJwt = async () => {
  const { data } = await axios.get("/api/auth/private");
  return data;
};
