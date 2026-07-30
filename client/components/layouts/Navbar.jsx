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

	return (
		<header className={`fixed top-0 md:top-2 left-0 right-0 z-50 px-0 md:px-4 w-full flex justify-center transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-[150%]"}`}>
			{/* Main Outer Floating Container */}
			<nav className="w-full bg-white/90 backdrop-blur-md rounded-none md:rounded-full shadow-lg shadow-teal-900/5 border-b md:border border-slate-100 px-4 md:px-6 py-2 md:py-1.5 flex items-center justify-between transition-all duration-300">
				{/* --- LEFT SIDE --- */}
				<div className="flex items-center">
					{/* Desktop: Brand / Logo */}
					<Link
						href="/"
						className="hidden md:block text-xl font-bold bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent px-2"
					>
						CareerConnect
					</Link>

					{/* Mobile: Profile Icon */}
					<div className="md:hidden flex items-center">
						{user && <UserDropdown />}
					</div>
				</div>

				{/* --- CENTER SIDE --- */}
				{/* Desktop Menu */}
				<div className="hidden md:flex items-center gap-1">
					<NavLinks user={user} role={dbUser?.role} />
				</div>

				{/* --- RIGHT SIDE --- */}
				<div className="flex items-center gap-4">
					{/* Desktop Authentication / Action Buttons */}
					<div className="hidden md:flex items-center gap-2">
						{user ? (
							<div className="flex items-center gap-3">
								<UserDropdown />
								<Link
									href="/dashboard"
									className="px-5 py-2 rounded-full bg-[#124d46] text-white text-base font-medium hover:bg-[#0e3c37] transition duration-200"
								>
									Dashboard
								</Link>
							</div>
						) : (
							<>
								<Link
									href="/login"
									className={`px-5 py-2 rounded-full text-lg font-medium transition duration-200 ${pathname === "/login"
										? "bg-[#124d46] text-white"
										: "border border-[#124d46] text-[#124d46] hover:bg-[#124d46] hover:text-white"
										}`}
								>
									Login
								</Link>

								<Link
									href="/register"
									className={`px-5 py-2 rounded-full text-lg font-medium transition duration-200 ${pathname === "/register"
										? "bg-[#124d46] text-white"
										: "border border-[#124d46] text-[#124d46] hover:bg-[#124d46] hover:text-white"
										}`}
								>
									Register
								</Link>
							</>
						)}
					</div>

					{/* Mobile: Logo + Menu Toggle Button */}
					<div className="flex md:hidden items-center gap-3">
						<Link
							href="/"
							className="text-xl font-bold bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent"
						>
							CareerConnect
						</Link>
						<button
							onClick={() => setOpen(!open)}
							aria-label="Toggle Navigation"
							className="text-2xl p-2 rounded-full text-slate-700 hover:bg-slate-100 transition"
						>
							{open ? <HiX /> : <HiMenu />}
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Drawer Menu */}
			{open && (
				<div className="md:hidden absolute top-16 left-4 right-4 bg-white rounded-3xl shadow-xl border border-slate-100 p-5 flex flex-col gap-3 transition-all duration-300">
					<NavLinks user={user} role={dbUser?.role} />

					<hr className="border-slate-100 my-1" />

					{/* Mobile Auth Buttons */}
					<div className="flex flex-col gap-2">
						{user ? (
							<Link
								href="/dashboard"
								onClick={() => setOpen(false)}
								className="text-center bg-[#124d46] text-white rounded-2xl py-2.5 text-lg font-medium"
							>
								Dashboard
							</Link>
						) : (
							<>
								<Link
									href="/login"
									onClick={() => setOpen(false)}
									className="text-center border border-[#124d46] text-[#124d46] rounded-2xl py-2.5 text-lg font-medium"
								>
									Login
								</Link>

								<Link
									href="/register"
									onClick={() => setOpen(false)}
									className="text-center bg-[#124d46] text-white rounded-2xl py-2.5 text-lg font-medium"
								>
									Register
								</Link>
							</>
						)}
					</div>
				</div>
			)}
		</header>
	);
}