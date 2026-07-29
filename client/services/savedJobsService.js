import axiosInstance from "@/lib/axios";

export const getSavedJobs = async () => {
    const { data } = await axiosInstance.get("/api/saved-jobs");
    return data.savedJobs;
};

export const saveJob = async (jobId) => {
    const { data } = await axiosInstance.post("/api/saved-jobs", {
        jobId,
    });

    return data;
};

export const removeSavedJob = async (jobId) => {
    const { data } = await axiosInstance.delete(`/api/saved-jobs/${jobId}`);
    return data;
};
