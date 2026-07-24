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
  ArrowLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";

export default function DashboardSidebar({ role }) {
  const pathname = usePathname();

  let links = [];

  if (role === "admin") {
    links = [
      {
        name: "Overview",
        href: "/dashboard/admin/",
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
    ];
  }

  return (
    <aside className="w-64 border-r bg-white p-5">
      <h2 className="mb-8 text-2xl font-bold">
        Dashboard
      </h2>

      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition hover:bg-muted",
                pathname === item.href &&
                  "bg-primary text-primary-foreground"
              )}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 border-t pt-5">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-muted"
        >
          <ArrowLeft size={18} />
          Back to Website
        </Link>
      </div>
    </aside>
  );
}