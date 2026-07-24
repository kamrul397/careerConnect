import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

export const applyJob = async (application) => {
  const { data } = await axios.post(
    `${API}/api/applications`,
    application
  );

  return data;
};



// check if already apply
export const checkApplied = async (jobId, email) => {
  const { data } = await axios.get(
    `${API}/api/applications/check`,
    {
      params: {
        jobId,
        email,
      },
    }
  );

  return data.applied;
};

// get applicats by jobid
export const getApplicants = async (jobId) => {
  const { data } = await axios.get(
    `${API}/api/applications/${jobId}/applicants`
  );

  return data;
};


// update applicats status
export const updateApplicationStatus = async (id, status) => {
  const { data } = await axios.patch(
    `${API}/api/applications/${id}/status`,
    { status }
  );

  return data;
};

// get candidate apply list
export const getCandidateApplications = async (email) => {
  const { data } = await axios.get(
    `${API}/api/applications/candidate`,
    {
      params: {
        email,
      },
    }
  );

  return data;
};