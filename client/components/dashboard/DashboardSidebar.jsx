"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  FileClock,
  PlusCircle,
  FolderOpen,
  Bookmark,
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Logo from "@/components/shared/Logo";

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();

  let links = [];

  if (role === "admin") {
    links = [
      {
        name: "Overview",
        href: "/dashboard/admin",
        icon: LayoutDashboard,
      },
      {
        name: "Pending Jobs",
        href: "/dashboard/admin/pending-jobs",
        icon: FileClock,
      },
      {
        name: "Manage Users",
        href: "/dashboard/admin/users",
        icon: Users,
      },
    ];
  }

  if (role === "recruiter") {
    links = [
      {
        name: "Overview",
        href: "/dashboard/recruiter",
        icon: LayoutDashboard,
      },
      {
        name: "Post Job",
        href: "/dashboard/recruiter/post-job",
        icon: PlusCircle,
      },
      {
        name: "My Jobs",
        href: "/dashboard/recruiter/my-jobs",
        icon: BriefcaseBusiness,
      },
    ];
  }

  if (role === "candidate") {
    links = [
      {
        name: "Overview",
        href: "/dashboard/candidate",
        icon: LayoutDashboard,
      },
      {
        name: "Applications",
        href: "/dashboard/candidate/my-applications",
        icon: FolderOpen,
      },
      {
        name: "Saved Jobs",
        href: "/dashboard/candidate/saved-jobs",
        icon: Bookmark,
      },
      {
        name: "Profile & Resume",
        href: "/dashboard/candidate/profile",
        icon: Users,
      },
    ];
  }

  return (
    <aside className="w-64 border border-slate-100 bg-white rounded-2xl p-5 flex flex-col h-[calc(100vh-3rem)] sticky top-6 shadow-[2px_0_15px_-3px_rgba(0,0,0,0.03)] flex-shrink-0">
      <div className="mb-8 pl-2 flex items-center">
        {/* We use our Logo component and add some margin to ensure it looks balanced in the sidebar */}
        <Logo className="text-2xl" />
      </div>

      <nav className="space-y-1.5 flex-1">
        {links.map((item) => {
          const Icon = item.icon;
          const isOverview = item.href === "/dashboard/admin" || item.href === "/dashboard/recruiter" || item.href === "/dashboard/candidate";
          
          let isActive = false;
          if (isOverview) {
            isActive = pathname === item.href || pathname === item.href + "/";
          } else {
            isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 font-medium text-base",
                isActive
                  ? "bg-[#124d46] text-white shadow-md shadow-[#124d46]/20 font-semibold"
                  : "text-slate-500 hover:bg-teal-50/70 hover:text-[#124d46]"
              )}
            >
              <Icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-[#124d46]"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-slate-100 pt-5 space-y-4">
        {/* Premium Dashboard Indicator */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#124d46]/5 to-teal-100/30 border border-teal-100/50 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-16 h-16 bg-teal-200/40 rounded-full mix-blend-multiply blur-xl transition-transform duration-500 group-hover:scale-150"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-12 h-12 bg-emerald-200/40 rounded-full mix-blend-multiply blur-lg transition-transform duration-500 group-hover:scale-150"></div>
          <p className="relative z-10 text-xs font-bold text-[#124d46] uppercase tracking-wider mb-1">
            {role} Dashboard
          </p>
          <p className="relative z-10 text-[10px] text-teal-700/80 font-medium leading-tight">
            Premium workspace tailored for your needs.
          </p>
        </div>
      </div>
    </aside>
  );
}