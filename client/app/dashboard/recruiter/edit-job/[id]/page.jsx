"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import JobForm from "@/components/forms/JobForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getJobById, updateJob } from "@/services/jobService";
import { toast } from "sonner";



import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EditJobPage() {

    const { id } = useParams();
	const router = useRouter();

    const [job, setJob] = useState(null);

    useEffect(() => {
        loadJob();
    }, []);

    const loadJob = async () => {
        const data = await getJobById(id);

        setJob(data);
    };

    if (!job) {
        return <LoadingSpinner />;
    }

	const handleUpdate = async (values) => {

    await updateJob(id, values);

    toast.success("Job updated");

    router.push("/dashboard/recruiter/my-jobs");
};

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-10">
            {/* Page Header */}
            <div className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold mb-1.5">Edit Job Details</h1>
                        <p className="text-teal-100 text-base max-w-xl">
                            Make changes to your job listing below. Updates will be reflected immediately after saving.
                        </p>
                    </div>
                    <Button 
                        onClick={() => router.push("/dashboard/recruiter/my-jobs")}
                        variant="secondary"
                        className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-4 rounded-xl shadow-lg transition-transform active:scale-95 whitespace-nowrap border border-white/20"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Jobs
                    </Button>
                </div>
            </div>

            {/* Form */}
            <div className="px-2 sm:px-0">
                <JobForm
                    mode="edit"
                    initialData={job}
                    onSubmit={handleUpdate}
                />
            </div>
        </div>
    );
}