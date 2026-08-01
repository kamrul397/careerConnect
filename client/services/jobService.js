import axios from "@/lib/axios";

export const createJob = async (jobData) => {
	const { data } = await axios.post("/api/jobs", jobData);
	return data;
};

// get recruiter jobs(myjobs)
export const getRecruiterJobs = async (email) => {
	const { data } = await axios.get(`/api/jobs/recruiter?email=${email}`);
	return data;
};

export const deleteJob = async (id) => {
	const { data } = await axios.delete(`/api/jobs/${id}`);
	return data;
};

export const updateJob = async (id, jobData) => {
	const { data } = await axios.patch(`/api/jobs/${id}`, jobData);
	return data;
};

// get job by id
export const getJobById = async (id) => {
	const { data } = await axios.get(`/api/jobs/${id}`);
	return data;
};

// get pending jobs for admin
export const getPendingJobs = async () => {
	const { data } = await axios.get("/api/jobs/pending");
	return data;
};

// update job status by admin
export const updateJobStatus = async (id, status) => {
	const { data } = await axios.patch(`/api/jobs/${id}/status`, { status });
	return data;
};

// get approved jobs
export const getApprovedJobs = async (params = {}) => {
	const queryParams = new URLSearchParams();
	if (params.category && params.category !== "All") queryParams.append("category", params.category);
	if (params.type && params.type !== "All") queryParams.append("type", params.type);
	if (params.search) queryParams.append("search", params.search);

	const queryString = queryParams.toString();
	const url = queryString ? `/api/jobs?${queryString}` : "/api/jobs";

	const { data } = await axios.get(url);
	return data;
};

// get single approved job
export const getApproveJobById = async (id) => {
	const { data } = await axios.get(`/api/jobs/${id}`);
	return data;
};


// get job categories
export const getJobCategories = async () => {
	const { data } = await axios.get(`/api/jobs/categories`);
	return data;
};