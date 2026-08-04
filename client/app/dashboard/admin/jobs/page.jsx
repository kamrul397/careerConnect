"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";

import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { updateJob, deleteJob, updateJobStatus } from "@/services/jobService";

import { toast } from "sonner";
import {
  Briefcase,
  Search,
  Building2,
  MapPin,
  DollarSign,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  X,
  Loader2,
  Filter,
  Plus,
} from "lucide-react";
import Link from "next/link";

export default function AdminJobsPage() {
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal State
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State for Editing Job
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "",
    type: "Full-time",
    location: "",
    salary: "",
    description: "",
    requirements: "",
  });

  // Fetch all jobs for Admin using TanStack Query
  const {
    data: jobs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminAllJobs"],
    queryFn: async () => {
      const { data } = await axios.get("/api/jobs/all");
      return data || [];
    },
    staleTime: 1000 * 60 * 3,
  });

  // Calculate Status Counts
  const approvedCount = jobs.filter((j) => j.status === "approved").length;
  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const rejectedCount = jobs.filter((j) => j.status === "rejected").length;

  // Extract Unique Categories
  const categoriesList = Array.from(
    new Set(jobs.map((j) => j.category).filter(Boolean))
  );

  // Handle Quick Status Change (Approved, Pending, Rejected)
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await updateJobStatus(jobId, newStatus);
      toast.success(`Job status updated to ${newStatus}!`);
      queryClient.invalidateQueries({ queryKey: ["adminAllJobs"] });
      queryClient.invalidateQueries({ queryKey: ["approvedJobs"] });
      queryClient.invalidateQueries({ queryKey: ["pendingJobs"] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job status.");
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      company: job.company || "",
      category: job.category || "Software Development",
      type: job.type || "Full-time",
      location: job.location || "",
      salary: job.salary || "",
      description: job.description || "",
      requirements: job.requirements || "",
    });
    setIsModalOpen(true);
  };

  // Submit Edit Job Form
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.company.trim()) {
      toast.error("Title and Company are required!");
      return;
    }

    try {
      setSubmitting(true);
      await updateJob(editingJob._id, formData);
      toast.success("Job updated successfully!");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["adminAllJobs"] });
      queryClient.invalidateQueries({ queryKey: ["approvedJobs"] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update job details.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Job
  const handleDeleteJob = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteJob(deletingId);
      toast.success("Job deleted successfully!");
      setDeletingId(null);
      queryClient.invalidateQueries({ queryKey: ["adminAllJobs"] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete job.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter Jobs list based on search, status tab, and category
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.recruiterEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "All" || job.status === selectedStatus.toLowerCase();

    const matchesCategory =
      selectedCategory === "All" || job.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusBadgeStyle = {
    approved: "bg-emerald-100/90 text-emerald-800 border-emerald-300",
    pending: "bg-amber-100/90 text-amber-800 border-amber-300",
    rejected: "bg-rose-100/90 text-rose-800 border-rose-300",
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#124d46] via-[#0d3c37] to-[#072421] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5 flex items-center gap-2.5">
              <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-teal-300 shrink-0" />
              Manage All Jobs
            </h1>
            <p className="text-teal-100 text-sm sm:text-base max-w-xl">
              Inspect, edit, update approval status, or delete job postings across the entire platform.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 self-start sm:self-auto">
            <Briefcase className="w-5 h-5 text-teal-300" />
            <div>
              <div className="text-xs text-teal-100 font-medium uppercase tracking-wider">Total Listings</div>
              <div className="text-xl font-bold">{jobs.length} Jobs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => setSelectedStatus("All")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === "All"
              ? "bg-[#124d46] text-white border-[#124d46] shadow-md"
              : "bg-white text-slate-700 border-slate-200 hover:border-teal-300"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider opacity-80">All Jobs</div>
          <div className="text-2xl font-extrabold mt-1">{jobs.length}</div>
        </button>

        <button
          onClick={() => setSelectedStatus("Approved")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === "Approved"
              ? "bg-emerald-700 text-white border-emerald-700 shadow-md"
              : "bg-white text-emerald-800 border-emerald-200/80 hover:bg-emerald-50/50"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Approved
          </div>
          <div className="text-2xl font-extrabold mt-1 text-emerald-700 group-hover:text-white">{approvedCount}</div>
        </button>

        <button
          onClick={() => setSelectedStatus("Pending")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === "Pending"
              ? "bg-amber-600 text-white border-amber-600 shadow-md"
              : "bg-white text-amber-800 border-amber-200/80 hover:bg-amber-50/50"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Pending Audit
          </div>
          <div className="text-2xl font-extrabold mt-1 text-amber-700">{pendingCount}</div>
        </button>

        <button
          onClick={() => setSelectedStatus("Rejected")}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            selectedStatus === "Rejected"
              ? "bg-rose-700 text-white border-rose-700 shadow-md"
              : "bg-white text-rose-800 border-rose-200/80 hover:bg-rose-50/50"
          }`}
        >
          <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" /> Rejected
          </div>
          <div className="text-2xl font-extrabold mt-1 text-rose-700">{rejectedCount}</div>
        </button>
      </div>

      {/* Controls Bar: Search Input & Category Dropdown */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by job title, company, recruiter email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-xs sm:text-sm font-semibold"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:inline">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="All">All Categories ({jobs.length})</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Jobs Management Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
            <p className="text-sm font-medium">Loading platform jobs...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-16 px-4 space-y-3">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">Failed to load jobs</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{error?.message}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No matching jobs found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try resetting your search query or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (>= sm screens) */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase text-xs tracking-wider">
                    <th className="py-4 px-5">Job Details</th>
                    <th className="py-4 px-5">Company &amp; Recruiter</th>
                    <th className="py-4 px-5">Work Type &amp; Salary</th>
                    <th className="py-4 px-5 text-center">Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-teal-50/30 transition-colors group">
                      {/* Job Title & Category */}
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <Link
                            href={`/jobs/${job._id}`}
                            className="font-bold text-slate-900 text-base group-hover:text-[#124d46] transition-colors flex items-center gap-1.5"
                          >
                            <span>{job.title}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-60 group-hover:opacity-100" />
                          </Link>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                              {job.category || "General"}
                            </span>
                            {job.createdAt && (
                              <span className="text-slate-400 text-[11px]">
                                {new Date(job.createdAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Company & Recruiter Email */}
                      <td className="py-4 px-5">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{job.company}</span>
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-[180px]">
                            {job.recruiterEmail || "Admin Post"}
                          </div>
                        </div>
                      </td>

                      {/* Work Type & Salary */}
                      <td className="py-4 px-5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-[#124d46]">
                            <Briefcase className="w-3.5 h-3.5 shrink-0" />
                            <span>{job.type || "Full-time"}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                            <DollarSign className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            <span>{job.salary || "Negotiable"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown Pill */}
                      <td className="py-4 px-5 text-center">
                        <select
                          value={job.status || "approved"}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border outline-none cursor-pointer ${
                            statusBadgeStyle[job.status] || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          <option value="approved">Approved ✓</option>
                          <option value="pending">Pending ⏳</option>
                          <option value="rejected">Rejected ✕</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(job)}
                            className="p-2 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                            title="Edit Job"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(job._id)}
                            className="p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (< sm screens) */}
            <div className="block sm:hidden divide-y divide-slate-100">
              {filteredJobs.map((job) => (
                <div key={job._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="font-bold text-slate-900 text-base leading-snug truncate block"
                      >
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{job.company}</span>
                      </div>
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={job.status || "approved"}
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border outline-none shrink-0 ${
                        statusBadgeStyle[job.status] || "bg-slate-100 text-slate-700"
                      }`}
                    >
                      <option value="approved">Approved ✓</option>
                      <option value="pending">Pending ⏳</option>
                      <option value="rejected">Rejected ✕</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                      {job.category || "General"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-[#124d46] font-bold">
                      {job.type || "Full-time"}
                    </span>
                    <span className="text-emerald-700 font-semibold ml-auto">{job.salary}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400 truncate max-w-[180px]">
                      {job.recruiterEmail}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(job)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingId(job._id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative my-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#124d46] flex items-center justify-center shrink-0">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Edit Job Details</h3>
                <p className="text-xs text-slate-500">Update title, requirements, salary, and work type parameters.</p>
              </div>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Job Title *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <Input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Work Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Salary Range / Rate
                </label>
                <Input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="rounded-xl border-slate-200 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Job Description
                </label>
                <Textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border-slate-200 text-sm resize-y"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Key Requirements
                </label>
                <Textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full rounded-xl border-slate-200 text-sm resize-y"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#124d46] hover:bg-teal-700 text-white rounded-xl font-bold min-w-[120px]"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Job Confirmation Modal */}
      {deletingId && (() => {
        const deletingJob = jobs.find((j) => j._id === deletingId);

        return (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in-0">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-center space-y-5 relative overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
              
              {/* Top Warning Glow Circle */}
              <div className="relative inline-flex items-center justify-center my-1">
                <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 border-4 border-rose-50 flex items-center justify-center shadow-lg shadow-rose-500/20">
                  <Trash2 className="w-7 h-7 text-rose-600 animate-pulse" />
                </div>
              </div>

              {/* Title & Warning */}
              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Delete Job Listing?
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
                  Are you sure you want to permanently delete this job posting?
                </p>
              </div>

              {/* Specific Job Preview Card */}
              {deletingJob && (
                <div className="bg-rose-50/60 border border-rose-200/70 rounded-2xl p-3.5 text-left space-y-1">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
                    Target Job Listing
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {deletingJob.title}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 pt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{deletingJob.company}</span>
                    <span className="ml-auto text-[11px] px-2 py-0.5 rounded-md bg-white border border-rose-200 text-rose-700 font-bold shrink-0">
                      {deletingJob.type || "Full-time"}
                    </span>
                  </div>
                </div>
              )}

              {/* Caution Callout */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-amber-800 text-[11px] font-medium flex items-center justify-center gap-1.5">
                <span>⚠️ This action cannot be undone and will un-save it for candidates.</span>
              </div>

              {/* Action Bar */}
              <div className="grid grid-cols-2 gap-3 pt-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setDeletingId(null)}
                  className="rounded-xl border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-xs sm:text-sm h-10 sm:h-11 w-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteJob}
                  disabled={isDeleting}
                  className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 transition-all duration-200 text-xs sm:text-sm h-10 sm:h-11 w-full cursor-pointer shrink-0"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin mx-auto text-white" />
                  ) : (
                    "Delete Job"
                  )}
                </Button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
}
