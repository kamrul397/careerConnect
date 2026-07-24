"use client";

import Link from "next/link";
import Logo from "../shared/Logo";
import { Button } from "../ui/button";
import NavLinks from "./NavLinks";
import UserDropdown from "./UserDropdown";
import useAuth from "@/hooks/useAuth";

// import Link from "next/link";

// import Logo from "../shared/Logo";
// import NavLinks from "./NavLinks";
// import UserDropdown from "./UserDropdown";

// import { Button } from "../ui/button";

// import useAuth from "@/hooks/useAuth";

export default function Navbar() {
	const { user, dbUser, loading } = useAuth();

	return (
		<header className="sticky top-0 z-50 border-b bg-white">
			<nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
				<Logo />

				<div className="hidden md:flex items-center gap-8">
					<NavLinks user={user} role={dbUser?.role} />
				</div>

				<div className="flex items-center gap-3">
					{loading ? (
						<div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
					) : user ? (
						<UserDropdown />
					) : (
						<>
							<Button asChild variant="ghost">
								<Link href="/login">Login</Link>
							</Button>

							<Button asChild>
								<Link href="/register">Register</Link>
							</Button>
						</>
					)}
				</div>
			</nav>
		</header>
	);
}
