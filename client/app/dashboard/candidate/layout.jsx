"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function CandidateLayout({ children }) {
  return (
    <RoleGuard role="candidate">
      <div className="flex flex-col md:flex-row gap-6">
        <DashboardSidebar role="candidate" />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}