import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import { Briefcase, Building2, MapPin, DollarSign, FileText, CheckCircle, Tag, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import useCategories from "@/hooks/useCategories";

const JOB_TYPES = ["Full Time", "Part Time", "Remote", "Internship"];

export default function JobForm({ mode = "create", initialData = {}, onSubmit }) {
	const { categories } = useCategories();
	const {
		control,
		handleSubmit,
		setValue,
		watch,
	} = useForm({
		defaultValues: {
			title: initialData?.title || "",
			category: initialData?.category || "",
			company: initialData?.company || "",
			location: initialData?.location || "",
			salary: initialData?.salary || "",
			type: initialData?.type || "",
			description: initialData?.description || "",
			requirements: initialData?.requirements || "",
		},
	});

	const watchCategory = watch("category");
	const watchType = watch("type");

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
			{/* Basic Info Section */}
			<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
				<div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
					<Briefcase className="w-5 h-5 text-[#124d46]" />
					<h3 className="text-lg font-bold text-slate-900">Basic Information</h3>
				</div>

				<div className="grid sm:grid-cols-2 gap-6">
					{/* Title */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
							Job Title <span className="text-red-500">*</span>
						</label>
						<Controller
							name="title"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Input
									placeholder="e.g. Senior Frontend Developer"
									className="bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-semibold text-slate-900 h-12 rounded-xl px-4 w-full truncate"
									{...field}
								/>
							)}
						/>
					</div>

					{/* Location */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
							<MapPin className="w-4 h-4 text-slate-400" /> Location <span className="text-red-500">*</span>
						</label>
						<Controller
							name="location"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Input
									placeholder="e.g. Dhaka, Bangladesh"
									className="bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-medium h-12 rounded-xl px-4 truncate w-full"
									{...field}
								/>
							)}
						/>
					</div>



					{/* Company */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
							<Building2 className="w-4 h-4 text-slate-400" /> Company Name <span className="text-red-500">*</span>
						</label>
						<Controller
							name="company"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Input
									placeholder="e.g. Google"
									className="bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-medium h-12 rounded-xl px-4 truncate w-full"
									{...field}
								/>
							)}
						/>
					</div>



					{/* Salary Range (Moved to Top Right) */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
							<DollarSign className="w-4 h-4 text-slate-400" /> Salary Range
						</label>
						<Controller
							name="salary"
							control={control}
							render={({ field }) => (
								<Input
									placeholder="e.g. $50k - $70k / year (Optional)"
									className="bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-medium h-12 rounded-xl px-4 truncate w-full"
									{...field}
								/>
							)}
						/>
					</div>
				</div>
			</div>
			{/* Job Details Section (Category & Type Selects) */}
			<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
				<div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
					<Layers className="w-5 h-5 text-[#124d46]" />
					<h3 className="text-lg font-bold text-slate-900">Job Classification</h3>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
					{/* Job Category Dropdown */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
							<Tag className="w-4 h-4 text-slate-400" /> Job Category <span className="text-red-500">*</span>
						</label>
						<Controller
							name="category"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<select
									{...field}
									className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-medium text-slate-900 h-12 rounded-xl px-4 outline-none transition-all cursor-pointer"
								>
									<option value="" disabled>Select Job Category</option>
									{categories.map((cat) => (
										<option key={cat.name} value={cat.name}>
											{cat.name}
										</option>
									))}
								</select>
							)}
						/>
					</div>

					{/* Employment Type Dropdown */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
							<Briefcase className="w-4 h-4 text-slate-400" /> Employment Type <span className="text-red-500">*</span>
						</label>
						<Controller
							name="type"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<select
									{...field}
									className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-medium text-slate-900 h-12 rounded-xl px-4 outline-none transition-all cursor-pointer"
								>
									<option value="" disabled>Select Employment Type</option>
									{JOB_TYPES.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>
							)}
						/>
					</div>
				</div>
			</div>
			{/* Description & Requirements Section */}
			<div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
				<div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
					<FileText className="w-5 h-5 text-[#124d46]" />
					<h3 className="text-lg font-bold text-slate-900">Description & Requirements</h3>
				</div>

				<div className="space-y-6">
					{/* Description */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
							Job Description <span className="text-red-500">*</span>
						</label>
						<Controller
							name="description"
							control={control}
							rules={{ required: true }}
							render={({ field }) => (
								<Textarea
									rows={6}
									placeholder="Describe the responsibilities, day-to-day tasks, and impact of this role..."
									className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-medium rounded-xl resize-y min-h-[120px] p-4"
									{...field}
								/>
							)}
						/>
					</div>

					{/* Requirements */}
					<div className="space-y-2">
						<label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 block">
							<CheckCircle className="w-4 h-4 text-slate-400" /> Requirements & Qualifications
						</label>
						<Controller
							name="requirements"
							control={control}
							render={({ field }) => (
								<Textarea
									rows={5}
									placeholder="e.g. 3+ years experience with React, Next.js, and MongoDB..."
									className="w-full bg-slate-50 border-2 border-slate-200 focus:border-[#124d46] focus:ring-2 focus:ring-[#124d46]/20 font-medium rounded-xl resize-y min-h-[100px] p-4"
									{...field}
								/>
							)}
						/>
					</div>
				</div>
			</div>

			{/* Submit Button */}
			<div className="pt-2">
				<Button
					type="submit"
					className="w-full bg-[#124d46] hover:bg-[#0a2e2a] text-white h-14 rounded-2xl text-lg font-bold shadow-lg shadow-[#124d46]/30 active:scale-[0.98] transition-all cursor-pointer"
				>
					{mode === "create" ? "Post Job for Approval" : "Update Job Details"}
				</Button>
			</div>
		</form>
	);
}