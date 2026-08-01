"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function RecruiterLayout({ children }) {
	return (
		<RoleGuard role="recruiter">
			<div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">
				<DashboardSidebar role="recruiter" />
				<main className="flex-1">
					{children}
				</main>
			</div>
		</RoleGuard>
	);
}
