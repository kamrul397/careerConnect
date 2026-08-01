"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function CandidateLayout({ children }) {
  return (
    <RoleGuard role="candidate">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 min-h-[calc(100vh-4rem)]">
        <DashboardSidebar role="candidate" />
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}