"use client";

import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HiMenu, HiX, HiUserCircle } from "react-icons/hi";
import UserDropdown from "./UserDropdown";
import NavLinks from "./NavLinks";

// const navLinks = [
// 	{ name: "Home", href: "/" },
// 	{ name: "Jobs", href: "/jobs" },
// 	{ name: "Companies", href: "/companies" },
// 	{ name: "About", href: "/about" },
// 	// { name: "Contact", href: "/contact" },
// ];

export default function Navbar() {
	const { user, dbUser } = useAuth();
	const [open, setOpen] = useState(false);
	const pathname = usePathname();

	const [prevScrollPos, setPrevScrollPos] = useState(0);
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			const currentScrollPos = window.scrollY;
			setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
			setPrevScrollPos(currentScrollPos);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [prevScrollPos]);

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<header className={`fixed top-0 md:top-3 left-0 right-0 z-50 px-0 md:px-6 w-full flex justify-center transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-[150%]"}`}>
			{/* Main Outer Floating Container */}
			<nav className="w-full bg-white/95 backdrop-blur-md rounded-none md:rounded-full shadow-lg shadow-teal-900/5 border-b md:border border-slate-200/80 px-5 md:px-8 py-3 md:py-3 flex items-center justify-between transition-all duration-300">
				{/* --- LEFT SIDE --- */}
				<div className="flex items-center">
					{/* Brand / Logo (Mobile & Desktop) */}
					<Link
						href="/"
						className="text-2xl font-extrabold bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent px-2 tracking-tight"
					>
						CareerConnect
					</Link>
				</div>

				{/* --- CENTER SIDE --- */}
				{/* Desktop Menu */}
				<div className="hidden md:flex items-center gap-2">
					<NavLinks user={user} role={dbUser?.role} />
				</div>

				{/* --- RIGHT SIDE --- */}
				<div className="flex items-center gap-4">
					{/* Desktop Authentication / Action Buttons */}
					<div className="hidden md:flex items-center gap-2.5">
						{user ? (
							<div className="flex items-center gap-3">
								<UserDropdown />
								<Link
									href="/dashboard"
									className="px-6 py-2.5 rounded-full bg-[#124d46] text-white text-base font-semibold hover:bg-[#0e3c37] transition duration-200 shadow-md shadow-[#124d46]/20 active:scale-95"
								>
									Dashboard
								</Link>
							</div>
						) : (
							<>
								<Link
									href="/login"
									className={`px-6 py-2.5 rounded-full text-base font-semibold transition duration-200 ${pathname === "/login"
										? "bg-[#124d46] text-white shadow-md shadow-[#124d46]/20"
										: "border-2 border-[#124d46] text-[#124d46] hover:bg-[#124d46] hover:text-white"
										}`}
								>
									Login
								</Link>

								<Link
									href="/register"
									className={`px-6 py-2.5 rounded-full text-base font-semibold transition duration-200 ${pathname === "/register"
										? "bg-[#124d46] text-white shadow-md shadow-[#124d46]/20"
										: "border-2 border-[#124d46] text-[#124d46] hover:bg-[#124d46] hover:text-white"
										}`}
								>
									Register
								</Link>
							</>
						)}
					</div>

					{/* Mobile: UserDropdown + Menu Toggle Button */}
					<div className="flex md:hidden items-center gap-3">
						{user && <UserDropdown />}
						<button
							onClick={() => setOpen(!open)}
							aria-label="Toggle Navigation"
							className="text-2xl p-2 rounded-full text-slate-700 hover:bg-slate-100 transition cursor-pointer"
						>
							{open ? <HiX /> : <HiMenu />}
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Drawer Menu */}
			{open && (
				<div className="md:hidden absolute top-16 left-4 right-4 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-5 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
					<NavLinks user={user} role={dbUser?.role} onItemClick={() => setOpen(false)} />

					<hr className="w-full border-slate-100 my-0.5" />

					{/* Mobile Auth Buttons */}
					<div className="flex flex-col gap-2.5 w-full">
						{user ? (
							<Link
								href="/dashboard"
								onClick={() => setOpen(false)}
								className="w-full text-center bg-[#124d46] text-white rounded-xl py-2.5 text-[15px] font-bold shadow-xs active:scale-95 transition-all"
							>
								Dashboard
							</Link>
						) : (
							<div className="flex items-center gap-2.5 w-full">
								<Link
									href="/login"
									onClick={() => setOpen(false)}
									className="flex-1 text-center border-2 border-[#124d46] text-[#124d46] hover:bg-[#124d46] hover:text-white rounded-xl py-2.5 text-[15px] font-bold transition-all"
								>
									Login
								</Link>

								<Link
									href="/register"
									onClick={() => setOpen(false)}
									className="flex-1 text-center bg-[#124d46] text-white rounded-xl py-2.5 text-[15px] font-bold shadow-xs transition-all"
								>
									Register
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</header>
	);
}