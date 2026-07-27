"use client";

import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import {
	googleLogin,
	loginUser,
	logoutUser,
	registerUser,
} from "@/services/authService";
import { getUserByEmail } from "@/services/userService";
import { getJwt, testJwt } from "@/services/authApi";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [dbUser, setDbUser] = useState(null);
	const [loading, setLoading] = useState(true);

	const loadDbUser = async (email) => {
		try {
			const profile = await getUserByEmail(email);
			setDbUser(profile);
		} catch (error) {
			console.error(error);
			setDbUser(null);
		}
	};

	const refreshDbUser = async (email = user?.email) => {
		if (!email) return;

		await loadDbUser(email);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);

			if (currentUser) {
				console.log(currentUser);
				// Create HTTP-only cookie
				await getJwt({
					email: currentUser.email,
					uid: currentUser.uid,
					// role: currentUser.role
				});

				// const result = await testJwt();
				// console.log(result);

				await loadDbUser(currentUser.email);
			} else {
				setDbUser(null);
			}

			setLoading(false);
		});

		return unsubscribe;
	}, []);

	const value = {
		user,
		dbUser,
		loading,
		registerUser,
		loginUser,
		googleLogin,
		logoutUser,
		refreshDbUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
