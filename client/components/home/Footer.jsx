import Link from "next/link";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-5 py-12 grid md:grid-cols-3 gap-10">
        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-blue-400">
            CareerConnect
          </h2>

          <p className="text-gray-400 mt-4">
            Helping job seekers connect with the
            world's best companies.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3">
            <Link href="/">Home</Link>
            <Link href="/jobs">Jobs</Link>
            <Link href="/companies">Companies</Link>
            <Link href="/about">About</Link>
          </div>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-semibold text-lg mb-4">
            Follow Us
          </h3>

          <div className="flex gap-5 text-2xl">
            <FaFacebook />
            <FaGithub />
            <FaLinkedin />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700 py-5 text-center text-gray-400">
        © 2026 CareerConnect. All Rights Reserved.
      </div>
    </footer>
  );
}