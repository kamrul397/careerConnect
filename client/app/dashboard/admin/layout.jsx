"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";



export default function AdminLayout({ children }) {
  return (
    <RoleGuard role="admin">
      <div className="flex min-h-screen">

        <DashboardSidebar role="admin" />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>
    </RoleGuard>
  );
}