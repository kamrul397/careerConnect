"use client";

import CandidateDashboard from "@/components/dashboard/CandidateDashboard";
import RecruiterDashboard from "@/components/dashboard/RecruiterDashboard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import useAuth from "@/hooks/useAuth";

export default function DashboardPage() {
	const { dbUser, loading } = useAuth();
	console.log("user in mongo", dbUser);

	if (loading || !dbUser) {
		return <LoadingSpinner />;
	}

	return dbUser.role === "candidate" ? (
		<CandidateDashboard />
	) : (
		<RecruiterDashboard />
	);
}
