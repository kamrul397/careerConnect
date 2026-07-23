"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import LoadingSpinner from "../shared/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

// import LoadingSpinner from "@/components/shared/LoadingSpinner";
// import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
	const { user, loading } = useAuth();

	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!loading && !user) {
			router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
		}
	}, [loading, user, router, pathname]);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return null;
	}

	return children;
}
