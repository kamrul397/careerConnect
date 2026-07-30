
import Navbar from "@/components/layouts/Navbar";
import Link from "next/link";

export default function AuthLayout({ children }) {
	return (
		<div className="h-screen flex w-full overflow-hidden">
			{/* LEFT SIDE - Visuals */}
			<Navbar></Navbar>
			<div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#124d46] to-[#0a2e2a] relative items-center justify-center p-12 overflow-hidden">
				{/* Decorative Glows */}
				<div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#1a7066] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
				<div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-teal-400 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

				<div className="relative z-10 text-white max-w-lg">
					<Link href="/" className="inline-block mb-8">
						<h2 className="text-3xl font-bold tracking-tight">CareerConnect</h2>
					</Link>
					<h1 className="text-4xl font-extrabold tracking-tight mb-4 leading-tight">
						Unlock your true potential.
					</h1>
					<p className="text-lg text-teal-50/80 leading-relaxed mb-6">
						Join thousands of professionals finding their dream jobs, connecting
						with top employers, and building their careers.
					</p>

					<div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
						<div className="flex -space-x-4">
							{/* Just some fake avatar circles to look premium */}
							<div className="w-10 h-10 rounded-full bg-teal-100 border-2 border-[#124d46] flex items-center justify-center text-[#124d46] font-bold text-xs">
								J
							</div>
							<div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-[#124d46] flex items-center justify-center text-[#124d46] font-bold text-xs">
								A
							</div>
							<div className="w-10 h-10 rounded-full bg-cyan-100 border-2 border-[#124d46] flex items-center justify-center text-[#124d46] font-bold text-xs">
								S
							</div>
						</div>
						<div className="text-sm">
							<p className="font-semibold text-white">Join 10,000+ users</p>
							<p className="text-teal-100/70">Trusted by professionals</p>
						</div>
					</div>
				</div>
			</div>

			{/* RIGHT SIDE - Form */}
			<div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-6 bg-white lg:bg-blue-50/50 overflow-y-auto lg:overflow-hidden">

				{children}
			</div>
		</div>
	);
}