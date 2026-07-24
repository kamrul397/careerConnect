"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function JobForm({
  mode = "create",
  initialData = {},
  onSubmit,
}) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      title: initialData.title || "",
      company: initialData.company || "",
      location: initialData.location || "",
      salary: initialData.salary || "",
      type: initialData.type || "",
      description: initialData.description || "",
      requirements: initialData.requirements || "",
    },
  });

  const submitHandler = (data) => {
    onSubmit(data);

    if (mode === "create") {
      reset();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 border rounded-xl bg-white shadow">
      <h1 className="text-3xl font-bold mb-2">
        {mode === "create" ? "Post New Job" : "Update Job"}
      </h1>

      <p className="text-gray-500 mb-8">
        Fill up the job information below.
      </p>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="space-y-5"
      >
        {/* Job Title */}
        <div>
          <label className="block mb-2 font-medium">
            Job Title
          </label>

          <Input
            placeholder="Frontend Developer"
            {...register("title")}
          />
        </div>

        {/* Company */}
        <div>
          <label className="block mb-2 font-medium">
            Company Name
          </label>

          <Input
            placeholder="Google"
            {...register("company")}
          />
        </div>

        {/* Location */}
        <div>
          <label className="block mb-2 font-medium">
            Location
          </label>

          <Input
            placeholder="Dhaka, Bangladesh"
            {...register("location")}
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block mb-2 font-medium">
            Salary
          </label>

          <Input
            placeholder="50000 BDT"
            {...register("salary")}
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block mb-2 font-medium">
            Job Type
          </label>

          <select
            {...register("type")}
            className="w-full border rounded-md p-2"
          >
            <option value="">Select Job Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-2 font-medium">
            Job Description
          </label>

          <Textarea
            rows={5}
            placeholder="Describe the job..."
            {...register("description")}
          />
        </div>

        {/* Requirements */}
        <div>
          <label className="block mb-2 font-medium">
            Requirements
          </label>

          <Textarea
            rows={5}
            placeholder="React, Next.js, MongoDB..."
            {...register("requirements")}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
        >
          {mode === "create"
            ? "Post Job"
            : "Update Job"}
        </Button>
      </form>
    </div>
  );
}