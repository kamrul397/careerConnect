// "use client";

// import useAuth from "@/hooks/useAuth";
// import Link from "next/link";
// import { useState } from "react";
// import { HiMenu, HiX } from "react-icons/hi";

// const navLinks = [
// 	{ name: "Home", href: "/" },
// 	{ name: "Jobs", href: "/jobs" },
// 	{ name: "Companies", href: "/companies" },
// 	{ name: "About", href: "/about" },
// 	{ name: "Contact", href: "/contact" },
// ];

// export default function Navbar() {
// 	const { user, dbUser } = useAuth();

// 	console.log("firbase user", user);
// 	console.log("monogdb user", dbUser);
// 	const [open, setOpen] = useState(false);

// 	return (
// 		<header className="bg-white shadow-sm sticky top-0 z-50">
// 			<nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
// 				{/* Logo */}
// 				<Link href="/" className="text-2xl font-bold text-blue-600">
// 					CareerConnect
// 				</Link>

// 				{/* Desktop Menu */}
// 				<ul className="hidden md:flex items-center gap-8">
// 					{navLinks.map((link) => (
// 						<li key={link.name}>
// 							<Link
// 								href={link.href}
// 								className="text-gray-700 hover:text-blue-600 transition"
// 							>
// 								{link.name}
// 							</Link>
// 						</li>
// 					))}
// 				</ul>

// 				{/* Desktop Buttons */}
// 				<div className="hidden md:flex items-center gap-3">
// 					<Link
// 						href="/login"
// 						className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
// 					>
// 						Login
// 					</Link>

// 					<Link
// 						href="/register"
// 						className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
// 					>
// 						Register
// 					</Link>
// 				</div>

// 				{/* Mobile Button */}
// 				<button onClick={() => setOpen(!open)} className="md:hidden text-3xl">
// 					{open ? <HiX /> : <HiMenu />}
// 				</button>
// 			</nav>

// 			{/* Mobile Menu */}
// 			{open && (
// 				<div className="md:hidden border-t bg-white">
// 					<ul className="flex flex-col">
// 						{navLinks.map((link) => (
// 							<li key={link.name}>
// 								<Link
// 									href={link.href}
// 									onClick={() => setOpen(false)}
// 									className="block px-5 py-4 border-b hover:bg-gray-100"
// 								>
// 									{link.name}
// 								</Link>
// 							</li>
// 						))}

// 						<div className="flex flex-col gap-3 p-5">
// 							<Link
// 								href="/login"
// 								className="text-center border border-blue-600 text-blue-600 rounded-md py-2"
// 							>
// 								Login
// 							</Link>

// 							<Link
// 								href="/register"
// 								className="text-center bg-blue-600 text-white rounded-md py-2"
// 							>
// 								Register
// 							</Link>
// 						</div>
// 					</ul>
// 				</div>
// 			)}
// 		</header>
// 	);
// }
