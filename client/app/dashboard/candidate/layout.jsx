"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

// import RoleGuard from "@/components/auth/RoleGuard";
// import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function CandidateLayout({ children }) {
  return (
    <RoleGuard role="candidate">
      <div className="flex min-h-screen">

        <DashboardSidebar role="candidate" />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </RoleGuard>
  );
}