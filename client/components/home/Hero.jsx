import Link from "next/link";
import { FaSearch } from "react-icons/fa";

import Image from "next/image";



export default function Hero() {
  return (
    <section className="bg-slate-50">
      <div className="max-w-7xl mx-auto px-5 py-20 grid lg:grid-cols-2 gap-10 items-center">
        {/* Left */}
        <div>
          <span className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            #1 Job Portal for Developers
          </span>

          <h1 className="text-5xl font-bold text-slate-900 leading-tight">
            Find Your Dream Job
            <span className="text-blue-600"> Faster.</span>
          </h1>

          <p className="text-gray-600 mt-6 text-lg">
            Discover thousands of verified job opportunities from top
            companies around the world.
          </p>

          <div className="mt-8 bg-white shadow rounded-lg p-4 flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Job title"
              className="border rounded-md px-4 py-3 flex-1"
            />

            <input
              type="text"
              placeholder="Location"
              className="border rounded-md px-4 py-3 flex-1"
            />

            <button className="bg-blue-600 text-white px-6 rounded-md flex items-center justify-center gap-2">
              <FaSearch />
              Search
            </button>
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              href="/jobs"
              className="bg-blue-600 text-white px-6 py-3 rounded-md"
            >
              Browse Jobs
            </Link>

            <Link
              href="/register"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="flex justify-center">
          <Image
            src="/hero.svg"
            alt="Job Search Illustration"
            width={600}
            height={600}
            className="w-full max-w-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
}