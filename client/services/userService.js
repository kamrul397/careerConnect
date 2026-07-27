import axiosInstance from "@/lib/axios";

// saving user
export const saveUser = async (userData) => {
	const { data } = await axiosInstance.post("/api/users", userData);
	return data;
};

// get user by email
export const getUserByEmail = async (email) => {
	const { data } = await axiosInstance.get(`/api/users/${email}`);
	return data.user;
};