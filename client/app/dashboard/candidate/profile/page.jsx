"use client";

import { useState, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/services/userService";
import { toast } from "sonner";

const formatResumeDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ProfilePage() {
  const { dbUser, refreshDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!dbUser?.email) return;

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name");
      const phone = formData.get("phone");
      const location = formData.get("location");

      await updateUserProfile(dbUser.email, { name, phone, location });
      await refreshDbUser(dbUser.email);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadResume = async (e) => {
    e.preventDefault();
    setUploadError("");

    const file = fileInputRef.current?.files?.[0];

    if (!file) return setUploadError("Please select a PDF file.");
    if (file.type !== "application/pdf") return setUploadError("Only PDF files are allowed.");
    if (file.size > 5 * 1024 * 1024) return setUploadError("File size must be under 5MB.");
    if (!dbUser?.email) return setUploadError("User not found. Please log in again.");

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      return setUploadError("Cloudinary is not configured. Check your .env.local file.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append(
      "public_id",
      `resumes/${dbUser.email.replace("@", "_at_").replace(/\./g, "_")}/resume_${Date.now()}`
    );

    setUploadProgress(0);

    try {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const downloadURL = response.secure_url;

          try {
            await updateUserProfile(dbUser.email, {
              resumeUrl: downloadURL,
              resumeUploadedAt: new Date().toISOString(),
              resumeName: file.name,
            });
            await refreshDbUser(dbUser.email);
            setUploadProgress(null);
            setShowUploadForm(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            toast.success("Resume uploaded successfully!");
          } catch {
            setUploadError("Resume uploaded but failed to save user profile. Please try again.");
            setUploadProgress(null);
          }
        } else {
          setUploadError(`Upload failed (${xhr.status}). Please try again.`);
          setUploadProgress(null);
        }
      });

      xhr.addEventListener("error", () => {
        setUploadError("Network error. Please check your connection.");
        setUploadProgress(null);
      });

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`);
      xhr.send(formData);
    } catch (err) {
      console.error(err);
      setUploadError("An unexpected error occurred.");
      setUploadProgress(null);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile &amp; Resume</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and upload your resume.
        </p>
      </div>

      {/* Personal Information */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        <form onSubmit={handleSaveProfile} className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" defaultValue={dbUser?.name || ""} />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" defaultValue={dbUser?.email || ""} disabled />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="e.g. +1 234 567 890"
              defaultValue={dbUser?.phone || ""}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. New York, USA"
              defaultValue={dbUser?.location || ""}
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>

      {/* Resume Section */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Resume</h2>
          {dbUser?.resumeUrl && !showUploadForm && (
            <button
              type="button"
              onClick={() => setShowUploadForm(true)}
              className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition font-medium"
            >
              🔄 Replace Resume
            </button>
          )}
          {showUploadForm && dbUser?.resumeUrl && (
            <button
              type="button"
              onClick={() => {
                setShowUploadForm(false);
                setUploadError("");
              }}
              className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition font-medium"
            >
              ✕ Cancel
            </button>
          )}
        </div>

        {/* Resume Card */}
        {dbUser?.resumeUrl && !showUploadForm ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl shrink-0">
                📄
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {dbUser.resumeName || "Resume.pdf"}
                </p>
                <p className="text-xs text-green-600 font-medium mt-0.5">
                  ✓ Uploaded to Cloudinary
                </p>
                {dbUser.resumeUploadedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {formatResumeDate(dbUser.resumeUploadedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={dbUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition text-center"
              >
                👁 View
              </a>
              <a
                href={dbUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg border border-gray-300 text-xs font-medium hover:bg-white transition text-center"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        ) : (
          /* Upload Form */
          <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
            <div className="text-4xl mb-3">📄</div>
            <p className="text-sm text-gray-500 mb-1 font-medium">
              {dbUser?.resumeUrl
                ? "Upload a new PDF to replace your current resume"
                : "Upload your resume to get started"}
            </p>
            <p className="text-xs text-gray-400 mb-6">PDF only · Max 5MB</p>

            <form onSubmit={handleUploadResume} className="space-y-3 max-w-sm mx-auto">
              <Input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                disabled={uploadProgress !== null}
              />
              {uploadError && (
                <p className="text-red-500 text-xs text-left">{uploadError}</p>
              )}
              {uploadProgress !== null && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 text-center">
                    {uploadProgress}% uploading...
                  </p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={uploadProgress !== null}
              >
                {uploadProgress !== null ? "Uploading..." : "Upload Resume"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}