import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }) {
	return (
		<Link
			href="/"
			className={cn("hidden md:block text-xl font-bold bg-gradient-to-r from-teal-700 to-teal-500 bg-clip-text text-transparent px-2", className)}
		>
			CareerConnect
		</Link>
	);
}
