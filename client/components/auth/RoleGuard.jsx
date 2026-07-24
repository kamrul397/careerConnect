"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function RoleGuard({ children, role }) {
	const { user, dbUser, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// 1. If done loading and not logged in, redirect to login
		if (!loading && !user) {
			router.replace("/login");
			return;
		}

		// 2. If done loading, user exists, but role doesn't match, redirect to default dashboard
		if (!loading && dbUser && dbUser.role !== role) {
			router.replace("/dashboard");
		}
	}, [loading, user, dbUser, role, router]);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (user && !dbUser) {
		return <LoadingSpinner />;
	}

	// Prevent rendering children if the role doesn't match
	if (!dbUser || dbUser.role !== role) {
		return null;
	}
	// If everything checks out, render the protected page content!
	return children;
}
