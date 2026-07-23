"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{
		name: "Home",
		href: "/",
	},
	{
		name: "Jobs",
		href: "/jobs",
	},
	{
		name: "Companies",
		href: "/companies",
	},
	{
		name: "About",
		href: "/about",
	},
];

export default function NavLinks() {
	const pathname = usePathname();

	return (
		<>
			{links.map((link) => (
				<Link
					key={link.href}
					href={link.href}
					className={`font-medium transition-colors ${
						pathname === link.href ? "text-blue-600" : "hover:text-blue-600"
					}`}
				>
					{link.name}
				</Link>
			))}
		</>
	);
}
