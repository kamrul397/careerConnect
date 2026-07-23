import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
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

export default function UserDropdown() {
	const router = useRouter();
	const { user, logoutUser } = useAuth();
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
	// Get first letter of user's display name or email for fallback avatar
	const avatarFallbackLetter =
		user?.displayName?.charAt(0).toUpperCase() ||
		user?.email?.charAt(0).toUpperCase() ||
		"U";

	return (
		<DropdownMenu>
			{/* TRIGGER BUTTON */}
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-2"
				>
					<Avatar className="h-10 w-10">
						<AvatarImage
							src={user?.photoURL || ""}
							alt={user?.displayName || "User Avatar"}
						/>
						<AvatarFallback>{avatarFallbackLetter}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			{/* DROPDOWN MENU CONTENT */}
			<DropdownMenuContent align="end" className="w-60 p-2">
				{/* User Info Section */}
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user?.displayName || "User"}
						</p>
						<p className="text-xs leading-none text-muted-foreground truncate">
							{user?.email || "user@example.com"}
						</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				{/* Action Links */}
				<DropdownMenuGroup>
					<DropdownMenuItem asChild className="cursor-pointer">
						<Link href="/profile" className="flex w-full items-center">
							<User className="mr-2 h-4 w-4" />
							<span>Profile</span>
						</Link>
					</DropdownMenuItem>

					<DropdownMenuItem asChild className="cursor-pointer">
						<Link href="/settings" className="flex w-full items-center">
							<Settings className="mr-2 h-4 w-4" />
							<span>Settings</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				{/* Logout Option */}
				<DropdownMenuItem
					onClick={handleLogout}
					className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950"
				>
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
