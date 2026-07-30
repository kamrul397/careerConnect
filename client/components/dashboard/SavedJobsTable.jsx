"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { getSavedJobs, removeSavedJob } from "@/services/savedJobsService";
import { toast } from "sonner";
import { Bookmark, Building2, Calendar, MapPin, DollarSign, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SavedJobsTable() {
  const { dbUser } = useAuth();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (dbUser?.email) {
      loadSavedJobs();
    }
  }, [dbUser]);

  const loadSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setSavedJobs(data);
    } catch (error) {
      console.error("Failed to load saved jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId) => {
    const backup = savedJobs.find((item) => item.jobDetails?._id === jobId);

    setSavedJobs((prev) =>
      prev.filter((item) => item.jobDetails?._id !== jobId)
    );

    try {
      await removeSavedJob(jobId);
      toast.success("Job removed from saved list.");
    } catch (error) {
      setSavedJobs((prev) => [...prev, backup]);
      toast.error("Failed to remove. Please try again.");
    }
  };

  const jobTypeBadge = {
    "Full-time": "bg-blue-100/80 text-blue-700 border border-blue-200/50",
    "Part-time": "bg-purple-100/80 text-purple-700 border border-purple-200/50",
    Remote: "bg-emerald-100/80 text-emerald-700 border border-emerald-200/50",
    Hybrid: "bg-orange-100/80 text-orange-700 border border-orange-200/50",
    Contract: "bg-yellow-100/80 text-yellow-700 border border-yellow-200/50",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-200 border-t-[#124d46] rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading saved jobs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#124d46] to-emerald-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-teal-400 rounded-full mix-blend-overlay filter blur-[80px] opacity-40"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-emerald-300 fill-emerald-300/20" />
            Saved Jobs
          </h1>
          <p className="text-teal-50 mt-2 text-lg max-w-xl leading-relaxed opacity-90">
            Keep track of the opportunities you're most interested in. Apply when you're ready!
          </p>
        </div>
      </div>

      {savedJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center flex flex-col items-center justify-center shadow-sm">
          <div className="p-5 bg-teal-50 rounded-full mb-4">
            <Bookmark className="w-10 h-10 text-teal-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No saved jobs yet</h3>
          <p className="text-slate-500 mb-6 max-w-md">
            You haven't bookmarked any jobs. Start exploring and save the ones that catch your eye!
          </p>
          <Button asChild className="bg-[#124d46] hover:bg-[#0a2e2a] text-white px-8 py-6 rounded-xl shadow-lg shadow-[#124d46]/20 transition-all">
            <Link href="/jobs" className="flex items-center gap-2 font-semibold">
              Browse Jobs <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-sm uppercase tracking-wider">
                  <th className="px-6 py-5 font-semibold">Job Title</th>
                  <th className="px-6 py-5 font-semibold">Company</th>
                  <th className="px-6 py-5 font-semibold">Details</th>
                  <th className="px-6 py-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {savedJobs.map((item) => (
                  <tr key={item._id} className="group hover:bg-teal-50/30 transition-colors duration-200">
                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-800 group-hover:text-[#124d46] transition-colors text-base mb-1">
                        {item.jobDetails?.title}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        Saved on {new Date(item.savedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {item.jobDetails?.company}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center justify-center px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full ${
                              jobTypeBadge[item.jobDetails?.type] ?? "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.jobDetails?.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-500 text-sm">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {item.jobDetails?.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" /> {item.jobDetails?.salary}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-teal-200 text-teal-700 hover:bg-teal-50 hover:text-teal-800 transition-colors rounded-lg font-medium"
                        >
                          <Link href={`/jobs/${item.jobDetails?._id}`}>View Job</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.jobDetails?._id)}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-lg px-2"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
