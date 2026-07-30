"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({ children }) {
	return (
		<ProtectedRoute>
			<div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-100/40">
				<div className="max-w-7xl mx-auto p-6">{children}</div>
			</div>
		</ProtectedRoute>
	);
}
