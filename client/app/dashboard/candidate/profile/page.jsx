"use client";

import { useState, useRef } from "react";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/services/userService";
import { toast } from "sonner";
import Image from "next/image";
import {
  Camera,
  User,
  Mail,
  MapPin,
  Phone,
  FileText,
  CheckCircle2,
  Pencil,
  X,
  Save,
  Maximize2,
} from "lucide-react";
import { HiUserCircle } from "react-icons/hi";

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
  const [isEditing, setIsEditing] = useState(false);
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [showUploadForm, setShowUploadForm] = useState(false);

  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // 1. Handle Profile Info Update (Name, Phone, Location, Bio)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!dbUser?.email) return;

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name");
      const phone = formData.get("phone");
      const location = formData.get("location");
      const bio = formData.get("bio");

      await updateUserProfile(dbUser.email, { name, phone, location, bio });
      await refreshDbUser(dbUser.email);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Profile Photo Upload / Update
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo size must be under 5MB.");
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      toast.error("Cloudinary is not configured. Check your .env.local file.");
      return;
    }

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append(
        "public_id",
        `profile_photos/${dbUser.email.replace("@", "_at_").replace(/\./g, "_")}/photo_${Date.now()}`
      );

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const cloudData = await uploadRes.json();
      const photoUrl = cloudData.secure_url;

      // Update MongoDB dbUser profile with new photo URL
      await updateUserProfile(dbUser.email, { photo: photoUrl });
      await refreshDbUser(dbUser.email);
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // 3. Handle Resume PDF Upload
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
    <div className="max-w-4xl space-y-7 pb-10">

      {/* Top Profile Summary Card (Original Full Header & Avatar) */}
      <div className="bg-gradient-to-r from-[#124d46] to-[#0a2e2a] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">

          {/* Avatar with Click-to-Enlarge Modal & Camera Button */}
          <div className="relative group shrink-0">
            <div
              onClick={() => dbUser?.photo && setPhotoModalOpen(true)}
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white/20 overflow-hidden relative shadow-lg bg-teal-900 flex items-center justify-center ${dbUser?.photo ? "cursor-pointer transition-transform duration-300 hover:scale-105" : ""
                }`}
              title={dbUser?.photo ? "Click to view full photo" : ""}
            >
              {dbUser?.photo ? (
                <>
                  <Image
                    src={dbUser.photo}
                    alt="Profile Photo"
                    fill
                    priority
                    sizes="112px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Maximize2 className="w-5 h-5" />
                  </div>
                </>
              ) : (
                <HiUserCircle className="w-full h-full text-slate-300" />
              )}
            </div>

            {/* Change Photo Trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                photoInputRef.current?.click();
              }}
              disabled={uploadingPhoto}
              className="absolute bottom-0 right-0 bg-white text-[#124d46] p-2 rounded-full shadow-md hover:bg-teal-50 transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer z-10"
              title="Change Profile Photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>

          {/* User Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="text-4xl font-bold">{dbUser?.name || "User"}</h2>
              {dbUser?.role && (
                <span className="px-3 py-1 rounded-full bg-teal-400/20 border border-teal-300/30 text-teal-200 text-xs font-extrabold uppercase tracking-wider">
                  {dbUser.role}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-md text-teal-100/90 font-medium">
              {dbUser?.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-300" />
                  {dbUser.email}
                </span>
              )}
              {dbUser?.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-300" />
                  {dbUser.location}
                </span>
              )}
              {dbUser?.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-300" />
                  {dbUser.phone}
                </span>
              )}
            </div>

            {uploadingPhoto && (
              <p className="text-xs text-teal-200 font-semibold animate-pulse pt-1">
                Uploading new photo...
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Resume Section */}
      <div className="border border-slate-200/90 rounded-3xl p-4 bg-white shadow-sm space-y-2">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Resume &amp; Portfolio</h2>
          </div>

          {dbUser?.resumeUrl && !showUploadForm && (
            <button
              type="button"
              onClick={() => setShowUploadForm(true)}
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-semibold"
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
              className="text-xs px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition font-semibold"
            >
              ✕ Cancel
            </button>
          )}
        </div>

        {/* Resume Display Card */}
        {dbUser?.resumeUrl && !showUploadForm ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl shrink-0 text-red-600">
                📄
              </div>
              <div>
                <p className="font-bold text-slate-900 text-base">
                  {dbUser.resumeName || "Resume.pdf"}
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Uploaded &amp; Verified
                </p>
                {dbUser.resumeUploadedAt && (
                  <p className="text-xs text-slate-500 mt-1">
                    Uploaded on: {formatResumeDate(dbUser.resumeUploadedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={dbUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#124d46] text-white text-xs font-semibold hover:bg-[#0a2e2a] transition text-center"
              >
                👁 View PDF
              </a>
              <a
                href={dbUser.resumeUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition text-center"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        ) : (
          /* Upload PDF Form */
          <div className="border-2 border-dashed border-slate-300 hover:border-teal-400 rounded-2xl p-6 text-center bg-slate-50/50 transition">
            <div className="text-4xl mb-2">📄</div>
            <p className="text-sm text-slate-700 mb-1 font-semibold">
              {dbUser?.resumeUrl
                ? "Upload a new PDF to replace your current resume"
                : "Upload your resume to get started"}
            </p>
            <p className="text-xs text-slate-400 mb-5">PDF document only · Max file size 5MB</p>

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
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-teal-700 text-center font-semibold">
                    {uploadProgress}% uploading...
                  </p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-[#124d46] hover:bg-[#0a2e2a] text-white rounded-xl py-2.5 font-semibold text-sm"
                disabled={uploadProgress !== null}
              >
                {uploadProgress !== null ? "Uploading..." : "Upload Resume"}
              </Button>
            </form>
          </div>
        )}
      </div>


      {/* Personal Information Card (Compact Padding & Tight Margins) */}
      <div
        className={`rounded-3xl p-3.5 transition-all duration-300 ${isEditing
          ? "bg-teal-50/30 border-[#124d46] ring-2 ring-[#124d46]/10 shadow-lg"
          : "bg-white border border-slate-200/90 shadow-sm"
          }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#124d46]" />
            <h2 className="text-xl font-bold text-slate-900">Personal Information</h2>
            {isEditing && (
              <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-[#124d46] text-xs font-extrabold tracking-wide uppercase flex items-center gap-1 border border-teal-300 animate-pulse ml-2">
                <Pencil className="w-3.5 h-3.5" /> Editing Mode
              </span>
            )}
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#124d46] text-xs font-bold transition-all shadow-xs border border-teal-200 active:scale-95 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit Edit Mode</span>
            </button>
          )}
        </div>

        {/* Read-Only View */}
        {!isEditing ? (
          <div className="space-y-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-xs text-slate-400 font-medium block">Full Name</span>
                <span className="text-slate-900 font-bold text-base block">{dbUser?.name || "Not provided"}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-xs text-slate-400 font-medium block">Email Address</span>
                <span className="text-slate-900 font-bold text-base block">{dbUser?.email || "Not provided"}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-xs text-slate-400 font-medium block">Phone Number</span>
                <span className="text-slate-900 font-bold text-base block">{dbUser?.phone || "Not provided"}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5">
                <span className="text-xs text-slate-400 font-medium block">Location</span>
                <span className="text-slate-900 font-bold text-base block">{dbUser?.location || "Not provided"}</span>
              </div>
            </div>

            {dbUser?.bio && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-xs text-slate-400 font-semibold block uppercase tracking-wider">About / Professional Bio</span>
                <p className="text-slate-800 text-base leading-relaxed whitespace-pre-line font-medium">
                  {dbUser.bio}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Edit Form */
          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div className="grid sm:grid-cols-2 gap-2.5">
              <div>
                <Label htmlFor="name" className="text-slate-900 font-bold text-xs uppercase tracking-wider block mb-1">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={dbUser?.name || ""}
                  className="bg-white border-2 border-slate-300 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-semibold text-slate-900 text-base h-10 px-3 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-900 font-bold text-xs uppercase tracking-wider block mb-1">
                  Email Address <span className="text-slate-400 font-normal text-xs">(Read only)</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue={dbUser?.email || ""}
                  disabled
                  className="bg-slate-100 border border-slate-300 text-slate-500 font-medium text-base h-10 px-3 rounded-xl cursor-not-allowed"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-900 font-bold text-xs uppercase tracking-wider block mb-1">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+880 1XXXXXXXXX"
                  defaultValue={dbUser?.phone || ""}
                  className="bg-white border-2 border-slate-300 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-semibold text-slate-900 text-base h-10 px-3 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="location" className="text-slate-900 font-bold text-xs uppercase tracking-wider block mb-1">
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. Dhaka, Bangladesh"
                  defaultValue={dbUser?.location || ""}
                  className="bg-white border-2 border-slate-300 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-semibold text-slate-900 text-base h-10 px-3 rounded-xl"
                />
              </div>
            </div>

            {/* Bio Textarea */}
            <div>
              <Label htmlFor="bio" className="text-slate-900 font-bold text-xs uppercase tracking-wider block mb-1">
                About / Professional Bio
              </Label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                placeholder="Tell recruiters about yourself, your skills, experience, and career goals..."
                defaultValue={dbUser?.bio || ""}
                className="w-full p-3 rounded-xl bg-white border-2 border-slate-300 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-semibold text-slate-900 text-base leading-snug outline-none transition-all shadow-xs resize-y min-h-[90px]"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="rounded-xl px-4 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#124d46] hover:bg-[#0a2e2a] text-white px-6 rounded-xl font-bold shadow-md shadow-[#124d46]/30 transition-all flex items-center gap-2 text-base h-9 active:scale-95"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Saving Profile..." : "Save Profile Details"}</span>
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* 4. Full-Screen Photo Preview Lightbox Modal */}
      {photoModalOpen && dbUser?.photo && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300 animate-in fade-in-0"
          onClick={() => setPhotoModalOpen(false)}
        >
          <div
            className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPhotoModalOpen(false)}
              className="absolute -top-12 right-0 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition cursor-pointer"
              title="Close Preview"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={dbUser.photo}
              alt={dbUser?.name || "Profile Photo"}
              className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border-2 border-white/20"
            />
            {dbUser?.name && (
              <p className="text-white text-sm font-semibold mt-3 bg-black/50 px-4 py-1.5 rounded-full border border-white/10">
                {dbUser.name}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}