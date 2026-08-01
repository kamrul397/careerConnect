"use client";

import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import { deleteJob, getRecruiterJobs } from "@/services/jobService";
import { getApplicants } from "@/services/applicationService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BriefcaseBusiness, Edit3, Trash2, Users, FileText, CheckCircle2, XCircle, Clock, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RecruiterJobsTable() {
	const { dbUser } = useAuth();
	const router = useRouter();
	const [jobs, setJobs] = useState([]);
	const [applicantCounts, setApplicantCounts] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!dbUser?.email) return;
		loadJobs();
	}, [dbUser]);

	const loadJobs = async () => {
		try {
			setLoading(true);
			const data = await getRecruiterJobs(dbUser.email);
			const fetchedJobs = data || [];
			setJobs(fetchedJobs);
			
			// Stop the main loading spinner so the table renders instantly
			setLoading(false);

			// Fetch applicant counts in the background
			if (fetchedJobs.length > 0) {
				const counts = {};
				await Promise.all(
					fetchedJobs.map(async (job) => {
						try {
							const applicants = await getApplicants(job._id);
							counts[job._id] = applicants?.length || 0;
						} catch (err) {
							counts[job._id] = 0;
						}
					})
				);
				setApplicantCounts(counts);
			}
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteJob(id);
			toast.success("Job deleted successfully");
			await loadJobs();
		} catch (error) {
			console.error(error);
			toast.error("Failed to delete job");
		}
	};

	const getStatusConfig = (status) => {
		switch (status?.toLowerCase()) {
			case "approved":
				return { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 };
			case "rejected":
				return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: XCircle };
			default:
				return { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", icon: Clock };
		}
	};

	return (
		<div className="space-y-6 sm:space-y-8 pb-10">
			{/* Page Header */}
			<div className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] rounded-3xl p-5 sm:p-8 text-white shadow-xl relative overflow-hidden">
				<div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
				<div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5 flex items-center gap-2">
							<BriefcaseBusiness className="w-7 h-7 sm:w-8 sm:h-8 text-teal-300 shrink-0" />
							My Posted Jobs
						</h1>
						<p className="text-teal-100 text-sm sm:text-base max-w-xl">
							Manage your job listings, track status, and review applicants all in one place.
						</p>
					</div>
					<Button
						onClick={() => router.push("/dashboard/recruiter/post-job")}
						className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-bold px-6 py-3.5 sm:py-5 rounded-xl shadow-lg transition-transform active:scale-95 whitespace-nowrap"
					>
						Post a New Job
					</Button>
				</div>
			</div>

			{/* Jobs Container */}
			{loading ? (
				<div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-12 text-center text-slate-500 font-medium animate-pulse">
					Loading your jobs...
				</div>
			) : jobs.length === 0 ? (
				<div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center">
					<div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
						<FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
					</div>
					<h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">No Jobs Posted Yet</h3>
					<p className="text-slate-500 text-sm max-w-sm mb-6">
						You haven't posted any job openings. Get started by creating your first listing to attract top talent.
					</p>
					<Button
						onClick={() => router.push("/dashboard/recruiter/post-job")}
						className="bg-[#124d46] hover:bg-[#0a2e2a] text-white"
					>
						Post Your First Job
					</Button>
				</div>
			) : (
				<>
					{/* Mobile Card List (< md screens) */}
					<div className="block md:hidden space-y-4">
						{jobs.map((job) => {
							const StatusIcon = getStatusConfig(job.status).icon;
							const statusClasses = getStatusConfig(job.status);
							return (
								<div
									key={job._id}
									className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 sm:p-5 space-y-3.5"
								>
									{/* Top Info: Title + Status */}
									<div className="flex items-start justify-between gap-3">
										<div className="space-y-1">
											<h3 className="font-bold text-slate-900 text-base leading-snug">
												{job.title}
											</h3>
											<p className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
												<Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
												{job.company}
											</p>
										</div>
										<div
											className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${statusClasses.bg} ${statusClasses.border} ${statusClasses.text} text-xs font-bold capitalize shrink-0`}
										>
											<StatusIcon className="w-3 h-3" />
											{job.status || "Pending"}
										</div>
									</div>

									{/* Badges: Category & Type */}
									<div className="flex flex-wrap gap-2 text-xs font-medium">
										<span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
											{job.category}
										</span>
										<span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-md border border-teal-100">
											{job.type}
										</span>
									</div>

									{/* Action Row */}
									<div className="pt-3 border-t border-slate-100 flex items-center gap-2">
										<Button
											size="sm"
											variant="outline"
											className={cn(
												"flex-1 rounded-xl transition-colors shadow-xs text-xs font-semibold h-9",
												job.status === "pending"
													? "opacity-50 cursor-not-allowed text-slate-400 border-slate-200"
													: "hover:text-[#124d46] hover:border-[#124d46] text-slate-700 border-slate-300"
											)}
											disabled={job.status === "pending"}
											onClick={() => router.push(`/dashboard/recruiter/my-jobs/${job._id}/applicants`)}
										>
											<Users className="w-3.5 h-3.5 mr-1" />
											Applicants
											{applicantCounts[job._id] !== undefined ? (
												<span
													className={cn(
														"ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
														job.status === "pending"
															? "bg-slate-100 text-slate-500"
															: "bg-teal-100 text-teal-800"
													)}
												>
													{applicantCounts[job._id]}
												</span>
											) : (
												<span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400 animate-pulse">
													...
												</span>
											)}
										</Button>

										<Button
											size="sm"
											variant="outline"
											className="rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-xs h-9 w-9 p-0 flex items-center justify-center shrink-0"
											onClick={() => router.push(`/dashboard/recruiter/edit-job/${job._id}`)}
											title="Edit Job"
										>
											<Edit3 className="w-4 h-4" />
										</Button>

										<Button
											size="sm"
											variant="outline"
											className="rounded-xl text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-xs h-9 w-9 p-0 flex items-center justify-center shrink-0"
											onClick={() => {
												if (confirm("Are you sure you want to delete this job?")) {
													handleDelete(job._id);
												}
											}}
											title="Delete Job"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</div>
							);
						})}
					</div>

					{/* Desktop Table View (>= md screens) */}
					<div className="hidden md:block bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full text-sm text-left">
								<thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-xs tracking-wider">
									<tr>
										<th className="px-6 py-5">Job Details</th>
										<th className="px-6 py-5">Company</th>
										<th className="px-6 py-5">Status</th>
										<th className="px-6 py-5 text-right">Actions</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-slate-100">
									{jobs.map((job) => {
										const StatusIcon = getStatusConfig(job.status).icon;
										const statusClasses = getStatusConfig(job.status);
										return (
											<tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
												<td className="px-6 py-5">
													<p className="font-bold text-slate-900 text-base mb-1">{job.title}</p>
													<p className="text-slate-500 text-xs font-medium">{job.category} • {job.type}</p>
												</td>
												<td className="px-6 py-5">
													<span className="font-medium text-slate-700">{job.company}</span>
												</td>
												<td className="px-6 py-5">
													<div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${statusClasses.bg} ${statusClasses.border} ${statusClasses.text} text-xs font-bold capitalize`}>
														<StatusIcon className="w-3.5 h-3.5" />
														{job.status || "Pending"}
													</div>
												</td>
												<td className="px-6 py-5 text-right">
													<div className="flex items-center justify-end gap-2">
														<Button
															size="sm"
															variant="outline"
															className={cn(
																"rounded-lg transition-colors shadow-sm",
																job.status === "pending"
																	? "opacity-50 cursor-not-allowed text-slate-400 border-slate-200"
																	: "hover:text-[#124d46] hover:border-[#124d46] text-slate-600"
															)}
															disabled={job.status === "pending"}
															onClick={() => router.push(`/dashboard/recruiter/my-jobs/${job._id}/applicants`)}
															title="View Applicants"
														>
															<Users className="w-4 h-4 mr-1.5" />
															Applicants
															{applicantCounts[job._id] !== undefined ? (
																<span className={cn(
																	"ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold",
																	job.status === "pending"
																		? "bg-slate-100 text-slate-500"
																		: "bg-teal-100 text-teal-800"
																)}>
																	{applicantCounts[job._id]}
																</span>
															) : (
																<span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-400 animate-pulse">
																	...
																</span>
															)}
														</Button>
														<Button
															size="sm"
															variant="outline"
															className="rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-colors shadow-sm"
															onClick={() => router.push(`/dashboard/recruiter/edit-job/${job._id}`)}
															title="Edit Job"
														>
															<Edit3 className="w-4 h-4" />
														</Button>
														<Button
															size="sm"
															variant="outline"
															className="rounded-lg text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm"
															onClick={() => {
																if (confirm("Are you sure you want to delete this job?")) {
																	handleDelete(job._id);
																}
															}}
															title="Delete Job"
														>
															<Trash2 className="w-4 h-4" />
														</Button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
