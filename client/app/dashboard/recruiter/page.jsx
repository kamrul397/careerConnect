"use client";

import Link from "next/link";

import RoleGuard from "@/components/auth/RoleGuard";

import RecruiterDashboard from "@/components/dashboard/RecruiterDashboard";

export default function RecruiterPage() {
	return (
		<RoleGuard role="recruiter">
			<RecruiterDashboard />
		</RoleGuard>
	);
}
