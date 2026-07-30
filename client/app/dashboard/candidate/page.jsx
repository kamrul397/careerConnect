"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import CandidateDashboard from "@/components/dashboard/CandidateDashboard";

export default function CandidatePage() {
	return (
		<RoleGuard role="candidate">
			<CandidateDashboard />
		</RoleGuard>
	);
}
