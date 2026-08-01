"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import LoadingSpinner from "../shared/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
	const { user, dbUser, loading } = useAuth();

	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!loading) {
			if (!user) {
				router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
			} else if (!dbUser) {
				toast.error("Please complete profile first");
				router.replace("/complete-profile");
			}
		}
	}, [loading, user, dbUser, router, pathname]);

	if (loading || (user && !dbUser)) {
		return <LoadingSpinner />;
	}

	if (!user) {
		return null;
	}

	return children;
}
