import axios from "@/lib/axios";

// Fetch all companies (optional search & industry filter)
export const getAllCompanies = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.industry && params.industry !== "All") queryParams.append("industry", params.industry);

  const queryString = queryParams.toString();
  const url = queryString ? `/api/companies?${queryString}` : "/api/companies";

  const { data } = await axios.get(url);
  return data;
};

// Fetch single company details by ID
export const getCompanyById = async (id) => {
  const { data } = await axios.get(`/api/companies/${id}`);
  return data;
};

// Create new company (Admin)
export const createCompany = async (companyData) => {
  const { data } = await axios.post("/api/companies", companyData);
  return data;
};

// Update company details (Admin)
export const updateCompany = async (id, companyData) => {
  const { data } = await axios.put(`/api/companies/${id}`, companyData);
  return data;
};

// Delete company (Admin)
export const deleteCompany = async (id) => {
  const { data } = await axios.delete(`/api/companies/${id}`);
  return data;
};
