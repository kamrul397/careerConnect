"use client";

import { useState, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/services/userService";
import { toast } from "sonner";

export default function ProfilePage() {
  const { dbUser, refreshDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null); // null = idle, 0-100 = uploading
  const [uploadError, setUploadError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);
  const fileInputRef = useRef(null);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!dbUser?.email) return;

    setLoading(true);
    try {
      const name = e.target.name.value;
      const phone = e.target.phone.value;
      const location = e.target.location.value;

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

  const handleUploadResume = (e) => {
    e.preventDefault();
    setUploadError("");

    const file = fileInputRef.current?.files?.[0];

    // Validation
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
    formData.append("public_id", `resumes/${dbUser.email.replace("@", "_at_")}/resume`);

    setUploadProgress(0);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    });

    xhr.addEventListener("load", async () => {
      console.log("☁️ Cloudinary response status:", xhr.status);
      console.log("☁️ Cloudinary raw response:", xhr.responseText);

      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        console.log("✅ Cloudinary success:", response);
        console.log("🔗 secure_url:", response.secure_url);
        const downloadURL = response.secure_url;

        try {
          await updateUserProfile(dbUser.email, { resumeUrl: downloadURL });
          await refreshDbUser(dbUser.email);
          setUploadProgress(null);
          setShowUploadForm(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
          toast.success("Resume uploaded successfully!");
        } catch {
          setUploadError("Resume uploaded but failed to save. Please try again.");
          setUploadProgress(null);
        }
      } else {
        console.error("❌ Cloudinary error response:", xhr.responseText);
        setUploadError(`Upload failed (${xhr.status}). Check console for details.`);
        setUploadProgress(null);
      }
    });

    xhr.addEventListener("error", () => {
      setUploadError("Network error. Please check your connection.");
      setUploadProgress(null);
    });

    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`);
    xhr.send(formData);
  };

  // Inject fl_attachment:false into Cloudinary raw URL to force inline PDF display
  const getInlineResumeUrl = (url) => {
    if (!url) return url;
    return url.replace("/raw/upload/", "/raw/upload/fl_attachment:false/");
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile &amp; Resume</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal information and upload your resume.
        </p>
      </div>

      {/* Personal Information — always full width */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        <form onSubmit={handleSaveProfile} className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={dbUser?.name} />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" defaultValue={dbUser?.email} disabled />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="e.g. +1 234 567 890" defaultValue={dbUser?.phone || ""} />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" placeholder="e.g. New York, USA" defaultValue={dbUser?.location || ""} />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </div>

      {/* Resume Section — full width */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        {/* Header with action buttons */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Resume</h2>
          {dbUser?.resumeUrl && !showUploadForm && (
            <div className="flex gap-2">
              <a
                href={dbUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="text-xs px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition font-medium"
              >
                ⬇ Download
              </a>
              <button
                type="button"
                onClick={() => setShowUploadForm(true)}
                className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition font-medium"
              >
                🔄 Replace Resume
              </button>
            </div>
          )}
          {showUploadForm && dbUser?.resumeUrl && (
            <button
              type="button"
              onClick={() => { setShowUploadForm(false); setUploadError(""); }}
              className="text-xs px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition font-medium"
            >
              ✕ Cancel
            </button>
          )}
        </div>

        {/* PDF Preview — when resume exists and not replacing */}
        {dbUser?.resumeUrl && !showUploadForm ? (
          <div className="space-y-2">
            {/* object tag handles PDFs better than iframe cross-origin */}
            <object
              data={getInlineResumeUrl(dbUser.resumeUrl)}
              type="application/pdf"
              className="w-full rounded-xl border border-gray-200 shadow-inner"
              style={{ height: "680px" }}
            >
              {/* Fallback: shown when browser blocks inline PDF rendering */}
              <div className="flex flex-col items-center justify-center gap-4 p-12 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200" style={{ height: "680px" }}>
                <div className="text-6xl">📄</div>
                <div>
                  <p className="font-semibold text-gray-700">Resume uploaded successfully!</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Your browser cannot preview PDFs inline. Use the buttons below.
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={dbUser.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                  >
                    👁 View Resume
                  </a>
                  <a
                    href={dbUser.resumeUrl}
                    download
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
                  >
                    ⬇ Download
                  </a>
                </div>
              </div>
            </object>
            <div className="text-right">
              <a
                href={dbUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                Open in new tab ↗
              </a>
            </div>
          </div>
        ) : (
          /* Upload Form — when no resume OR replacing */
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
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600 text-center">{uploadProgress}% uploading...</p>
                </>
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
