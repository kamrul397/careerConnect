import jobs from "@/app/data/jobs";
import Link from "next/link";


export default function FeaturedJobs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">
            Featured Jobs
          </h2>

          <p className="text-gray-600 mt-3">
            Explore some of the latest opportunities from top companies.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border rounded-xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold">{job.title}</h3>

              <p className="text-blue-600 mt-2">{job.company}</p>

              <p className="text-gray-600 mt-2">
                📍 {job.location}
              </p>

              <p className="text-gray-600">
                💰 {job.salary}
              </p>

              <span className="inline-block mt-4 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                {job.type}
              </span>

              <Link
                href={`/jobs/${job.id}`}
                className="block mt-6 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mt-12">
          <Link
            href="/jobs"
            className="inline-block border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            View All Jobs
          </Link>
        </div>
      </div>
    </section>
  );
}