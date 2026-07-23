"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "../shared/LoadingSpinner";

// import LoadingSpinner from "@/components/shared/LoadingSpinner";
// import useAuth from "@/hooks/useAuth";

export default function RoleGuard({ children, allowedRole }) {
	const { user, dbUser, loading } = useAuth();

	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login");
			return;
		}

		if (!loading && dbUser && dbUser.role !== allowedRole) {
			router.replace("/dashboard");
		}
	}, [loading, user, dbUser, allowedRole, router]);

	if (loading || !dbUser) {
		return <LoadingSpinner />;
	}

	if (dbUser.role !== allowedRole) {
		return null;
	}

	return children;
}
