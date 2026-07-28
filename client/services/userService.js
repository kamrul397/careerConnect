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

// update user profile
export const updateUserProfile = async (email, updateData) => {
	const { data } = await axiosInstance.patch(`/api/users/${email}`, updateData);
	return data;
};
// 1. Get all users (Admin only)
export const getAllUsers = async () => {
	const { data } = await axiosInstance.get("/api/users");
	return data.users;
};
// 2. Delete user (Admin only)
export const deleteUser = async (userId) => {
	const { data } = await axiosInstance.delete(`/api/users/${userId}`);
	return data;
};