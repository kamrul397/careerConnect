"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import CandidateDashboard from "@/components/dashboard/CandidateDashboard";

export default function CandidatePage() {
	return (
		<RoleGuard role="candidate">
			<div className="p-10">
				<h1 className="text-3xl font-bold">Candidate Dashboard</h1>
				<div>
					<CandidateDashboard></CandidateDashboard>
				</div>
			</div>
		</RoleGuard>
	);
}
