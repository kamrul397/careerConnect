"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";




export default function AdminLayout({ children }) {
  return (
    <RoleGuard role="recruiter">
      <div className="flex min-h-screen">

        <DashboardSidebar role="recruiter" />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </RoleGuard>
  );
}