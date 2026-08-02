"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPendingJobs, getApprovedJobs } from "@/services/jobService";
import { getAllUsers } from "@/services/userService";
import { getAllCompanies } from "@/services/companyService";

export default function DashboardHeader() {

	const router = useRouter();
	const [stats, setStats] = useState({
		pendingJobs: 0,
		approvedJobs: 0,
		companies: 0,
		recruiters: 0,
		candidates: 0,
	});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				const [pending, approved, users, companiesList] = await Promise.all([
					getPendingJobs(),
					getApprovedJobs(),
					getAllUsers(),
					getAllCompanies()
				]);

				const pendingCount = pending?.length || pending?.jobs?.length || 0;
				const approvedCount = approved?.length || approved?.jobs?.length || 0;
				const companiesCount = companiesList?.length || 0;

				const recruitersCount = users?.filter(u => u.role === 'recruiter').length || 0;
				const candidatesCount = users?.filter(u => u.role === 'candidate' || u.role === 'user').length || 0;

				setStats({
					pendingJobs: pendingCount,
					approvedJobs: approvedCount,
					companies: companiesCount,
					recruiters: recruitersCount,
					candidates: candidatesCount
				});
			} catch (error) {
				console.error("Failed to fetch dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	return (
		<div className="flex flex-col gap-4 lg:gap-6 animate-in fade-in duration-500">
			{/* Premium Header */}
			<div className="bg-gradient-to-r from-[#124d46] to-teal-700 rounded-2xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex-shrink-0">
				<div className="absolute top-[-50%] right-[-5%] w-64 h-64 bg-teal-400 rounded-full mix-blend-screen filter blur-[60px] opacity-30"></div>
				<div className="relative z-10">
					<h1 className="text-3xl md:text-4xl font-bold tracking-tight">
						Admin Dashboard 👑
					</h1>
					<p className="text-teal-50 mt-2 md:mt-3 text-lg max-w-xl leading-relaxed opacity-90">
						Manage users, recruiters, companies, and approve new job postings.
					</p>
				</div>
			</div>

			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 flex-shrink-0">
				<div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">
							<Link href="/dashboard/admin/pending-jobs" className="hover:underline">Pending Jobs</Link>
						</h3>
					</div>
					<p className="text-4xl font-extrabold mt-4 text-slate-800">
						{loading ? <span className="animate-pulse text-slate-300">...</span> : stats.pendingJobs}
					</p>
				</div>

				<div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
							Approved Jobs
						</h3>
					</div>
					<p className="text-4xl font-extrabold mt-4 text-slate-800">
						{loading ? <span className="animate-pulse text-slate-300">...</span> : stats.approvedJobs}
					</p>
				</div>

				<div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-teal-600 transition-colors">
							<Link href="/dashboard/admin/companies" className="hover:underline">Companies</Link>
						</h3>
					</div>
					<p className="text-4xl font-extrabold mt-4 text-slate-800">
						{loading ? <span className="animate-pulse text-slate-300">...</span> : stats.companies}
					</p>
				</div>

				<div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-blue-600 transition-colors">
							Recruiters
						</h3>
					</div>
					<p className="text-4xl font-extrabold mt-4 text-slate-800">
						{loading ? <span className="animate-pulse text-slate-300">...</span> : stats.recruiters}
					</p>
				</div>

				<div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
					<div className="flex items-center justify-between">
						<h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
							Candidates
						</h3>
					</div>
					<p className="text-4xl font-extrabold mt-4 text-slate-800">
						{loading ? <span className="animate-pulse text-slate-300">...</span> : stats.candidates}
					</p>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="bg-white border border-slate-100 rounded-xl p-6 lg:p-8 shadow-sm flex flex-col justify-center flex-1 min-h-[140px]">
				<div className="text-xl font-bold text-slate-800 mb-6">Quick Actions</div>
				<div className="flex flex-wrap gap-4">
					<Button asChild className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-6 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:shadow-amber-500/40 font-medium text-base">
						<Link href="/dashboard/admin/pending-jobs">
							Review Pending Jobs
						</Link>
					</Button>

					<Button asChild variant="outline" className="px-6 py-6 rounded-xl border-slate-200 text-slate-600 hover:text-[#124d46] hover:bg-teal-50 hover:border-teal-200 transition-all font-medium text-base">
						<Link href="/dashboard/admin/companies">
							Manage Companies
						</Link>
					</Button>

					<Button asChild variant="outline" className="px-6 py-6 rounded-xl border-slate-200 text-slate-600 hover:text-[#124d46] hover:bg-teal-50 hover:border-teal-200 transition-all font-medium text-base">
						<Link href="/dashboard/admin/users">
							Manage Users
						</Link>
					</Button>

					<Button asChild variant="outline" className="px-6 py-6 rounded-xl border-slate-200 text-slate-600 hover:text-[#124d46] hover:bg-teal-50 hover:border-teal-200 transition-all font-medium text-base">
						<Link href="/dashboard/admin/reports">
							View Reports
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}