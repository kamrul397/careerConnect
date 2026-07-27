"use client";

import Link from "next/link";
import useCategories from "@/hooks/useCategories";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function Categories() {
  const { categories, loading } = useCategories();

  if (loading) return <LoadingSpinner />;

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            Browse Job Categories
          </h2>

          <p className="text-gray-600 mt-3">
            Explore opportunities from different industries.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/jobs?category=${encodeURIComponent(category.name)}`}
              className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition text-center block"
            >
              <h3 className="text-xl font-semibold">
                {category.name}
              </h3>

              <p className="text-gray-500 mt-2">
                {category.jobs} Jobs Available
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}