"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import JobForm from "@/components/forms/JobForm";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { getJobById, updateJob } from "@/services/jobService";
import { toast } from "sonner";



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
       <JobForm
    mode="edit"
    initialData={job}
    onSubmit={handleUpdate}
/>
    );
}