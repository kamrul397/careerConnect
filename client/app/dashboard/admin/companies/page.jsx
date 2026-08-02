"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";

import {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "@/services/companyService";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Search,
  Globe,
  MapPin,
  Users,
  Briefcase,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Loader2,
} from "lucide-react";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null); // null if adding
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation state
  const [deletingId, setDeletingId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    banner: "",
    website: "",
    location: "",
    industry: "",
    employeeCount: "",
    description: "",
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getAllCompanies();
      setCompanies(data || []);
    } catch (error) {
      console.error("Fetch companies error:", error);
      toast.error("Failed to load companies.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingCompany(null);
    setFormData({
      name: "",
      logo: "",
      banner: "",
      website: "",
      location: "",
      industry: "Technology",
      employeeCount: "10-50 employees",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || "",
      logo: company.logo || "",
      banner: company.banner || "",
      website: company.website || "",
      location: company.location || "",
      industry: company.industry || "Technology",
      employeeCount: company.employeeCount || "10-50 employees",
      description: company.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Company name is required!");
      return;
    }

    try {
      setSubmitting(true);
      if (editingCompany) {
        await updateCompany(editingCompany._id, formData);
        toast.success("Company updated successfully!");
      } else {
        await createCompany(formData);
        toast.success("Company created successfully!");
      }
      setIsModalOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error("Save company error:", error);
      toast.error(editingCompany ? "Failed to update company" : "Failed to create company");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      setIsDeleting(true);
      await deleteCompany(deletingId);
      toast.success("Company deleted successfully!");
      setDeletingId(null);
      fetchCompanies();
    } catch (error) {
      console.error("Delete company error:", error);
      toast.error("Failed to delete company");
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.industry?.toLowerCase().includes(q) ||
      c.location?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1.5 flex items-center gap-2.5">
              <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-teal-300 shrink-0" />
              Manage Companies
            </h1>
            <p className="text-teal-100 text-sm sm:text-base max-w-xl">
              Create, update, and manage company profiles for job listings across the platform.
            </p>
          </div>
          <Button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto bg-teal-500 hover:bg-teal-400 text-white font-bold px-6 py-3.5 sm:py-5 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Company
          </Button>
        </div>
      </div>

      {/* Controls Bar: Search & Stats */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by company name, industry, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-slate-50 border-slate-200 focus:bg-white rounded-xl text-sm"
          />
        </div>
        <div className="text-xs sm:text-sm font-semibold text-slate-500 self-end md:self-auto">
          Total Companies: <span className="text-[#124d46] font-bold text-base">{companies.length}</span>
        </div>
      </div>

      {/* Companies List Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
            <p className="text-sm font-medium">Loading companies...</p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">No companies found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto mt-1">
              {searchQuery
                ? "Try searching with different keywords."
                : "Get started by adding your first company profile."}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleOpenAddModal}
                className="mt-5 bg-[#124d46] hover:bg-teal-700 text-white rounded-xl font-medium"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Company
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase text-xs tracking-wider">
                  <th className="py-4 px-5">Company</th>
                  <th className="py-4 px-5">Industry</th>
                  <th className="py-4 px-5">Location</th>
                  <th className="py-4 px-5">Employees</th>
                  <th className="py-4 px-5 text-center">Active Jobs</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map((company) => (
                  <tr key={company._id} className="hover:bg-teal-50/30 transition-colors group">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={company.logo || "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=300&auto=format&fit=crop"}
                          alt={company.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                        />
                        <div>
                          <h4 className="font-bold text-slate-800 text-base group-hover:text-[#124d46] transition-colors">
                            {company.name}
                          </h4>
                          {company.website ? (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-teal-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                            >
                              <Globe className="w-3 h-3" />
                              {company.website.replace(/^https?:\/\//, "")}
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No website</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                        {company.industry || "Technology"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{company.location || "Remote"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{company.employeeCount || "10-50"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-[#124d46]">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {company.jobsCount || 0}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(company)}
                          className="p-2 rounded-lg text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition-colors"
                          title="Edit Company"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(company._id)}
                          className="p-2 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete Company"
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
        )}
      </div>

      {/* Add / Edit Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#124d46] flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  {editingCompany ? "Edit Company Profile" : "Create New Company"}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in the company branding, location, and description details.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Company Name *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="e.g. PixelCraft Studios"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Industry
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Design & Web Development"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Logo Image URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Banner Cover URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://example.com/banner.jpg"
                    value={formData.banner}
                    onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. Remote / San Francisco, CA"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Employee Size
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 50-200 employees"
                    value={formData.employeeCount}
                    onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Website URL
                  </label>
                  <Input
                    type="url"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="rounded-xl border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  About Company / Description
                </label>
                <Textarea
                  rows={4}
                  placeholder="Describe company mission, values, work environment..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl border-slate-200 text-sm resize-none"
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
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : editingCompany ? (
                    "Save Changes"
                  ) : (
                    "Create Company"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Delete Company Profile?</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this company? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeletingId(null)}
                className="rounded-xl font-medium w-full"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold w-full"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
