"use client";

import { useQuery } from "@tanstack/react-query";
import { getJobCategories } from "@/services/jobService";

export default function useCategories() {
  const {
    data: categories = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["jobCategories"],
    queryFn: getJobCategories,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  return {
    categories,
    loading,
    error,
  };
}