"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import LoadingSpinner from "@/components/shared/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

export default function DashboardPage() {
	const { dbUser, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (loading) return;

		if (dbUser?.role === "candidate") {
	router.replace("/dashboard/candidate");
}

if (dbUser?.role === "recruiter") {
	router.replace("/dashboard/recruiter");
}

if (dbUser?.role === "admin") {
	router.replace("/dashboard/admin");
}
	}, [dbUser, loading, router]);

	if (loading) {
		return <LoadingSpinner />;
	}

	return null;
}
