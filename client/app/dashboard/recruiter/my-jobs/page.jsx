"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import RecruiterJobsTable from "@/components/dashboard/recruiter/RecruiterJobsTable";

export default function MyJobsPage() {
	return (
		<RoleGuard role="recruiter">
			<RecruiterJobsTable />
		</RoleGuard>
	);
}
