import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const createJob = async (jobData) => {
  const { data } = await axios.post(
    `${API}/api/jobs`,
    jobData
  );

  return data;
};

// get recruiter jobs(myjobs)
export const getRecruiterJobs = async (email) => {
  const { data } = await axios.get(
    `${API}/api/jobs/recruiter?email=${email}`
  );

  return data;
};

export const deleteJob = async (id) => {
  const { data } = await axios.delete(`${API}/api/jobs/${id}`);

  return data;
};

export const updateJob = async (id, jobData) => {
  const { data } = await axios.patch(
    `${API}/api/jobs/${id}`,
    jobData
  );

  return data;
};

// get job by id
export const getJobById = async (id) => {
  const { data } = await axios.get(`${API}/api/jobs/${id}`);

  return data;
};

// get pending jobs for admin
export const getPendingJobs = async () => {
  const { data } = await axios.get(
    `${API}/api/jobs/pending`
  );

  return data;
};

// update job status by admin
export const updateJobStatus = async (
  id,
  status
) => {
  const { data } = await axios.patch(
    `${API}/api/jobs/${id}/status`,
    {
      status,
    }
  );

  return data;
};

// get approve jobs
export const getApprovedJobs = async () => {
  const { data } = await axios.get(`${API}/api/jobs`);

  return data;
};

// get a single approve job details
export const getApproveJobById = async (id) => {
  const { data } = await axios.get(
    `${API}/api/jobs/${id}`
  );

  return data;
};

