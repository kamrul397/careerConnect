"use client";

import Link from "next/link";
import { LogOut, User, Shield } from "lucide-react";
import { HiUserCircle } from "react-icons/hi";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import Image from "next/image";

export default function UserDropdown() {
	const router = useRouter();
	const { dbUser, logoutUser } = useAuth();

	const handleLogout = async () => {
		try {
			await logoutUser();
			toast.success("Logged out successfully.");
			router.replace("/");
		} catch (error) {
			console.error(error);
			toast.error("Logout failed.");
		}
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<button className="relative flex items-center justify-center h-9 w-9 rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 hover:ring-2 hover:ring-teal-500/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 shadow-sm hover:shadow-md cursor-pointer shrink-0">
					{dbUser?.photo ? (
						<Image
							src={dbUser.photo}
							alt="User Avatar"
							fill
							priority
							sizes="36px"
							className="rounded-full object-cover transition-transform duration-300 hover:scale-110"
						/>
					) : (
						<HiUserCircle className="w-full h-full text-slate-600 hover:text-teal-700 transition-colors duration-200" />
					)}
				</button>
			</DropdownMenuTrigger>

			{/* DROPDOWN MENU CONTENT */}
			<DropdownMenuContent align="end" className="w-64 p-2 mt-2 bg-white/95 backdrop-blur-xl border border-gray-100 shadow-xl rounded-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-200">
				{/* User Info Section */}
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1.5 p-1">
						<div className="flex items-center justify-between gap-2">
							<p className="text-sm font-bold text-slate-900 leading-none truncate">
								{dbUser?.name || "User"}
							</p>
							{dbUser?.role && (
								<span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-[#124d46] border border-teal-200">
									{dbUser.role}
								</span>
							)}
						</div>
						<p className="text-xs leading-none text-muted-foreground truncate">
							{dbUser?.email || "No email available"}
						</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Action Links */}
				<DropdownMenuGroup>
					<DropdownMenuItem asChild className="cursor-pointer focus:bg-gray-50 hover:bg-gray-50 rounded-lg transition-colors mb-1">
						<Link href="/dashboard/candidate/profile" className="flex w-full items-center">
							<User className="mr-2 h-4 w-4 text-teal-700" />
							<span>My Profile</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Logout Option */}
				<DropdownMenuItem
					onClick={handleLogout}
					className="cursor-pointer text-red-600 focus:bg-red-50/50 focus:text-red-700 hover:bg-red-50/50 rounded-lg transition-colors mt-1"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}