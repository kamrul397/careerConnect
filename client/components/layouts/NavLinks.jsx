"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiBriefcase, HiOfficeBuilding, HiInformationCircle } from "react-icons/hi";

export default function NavLinks({ user, role, onItemClick }) {
	const pathname = usePathname();

	const getLinkClasses = (href) => {
		const isActive = pathname === href;
		return `flex items-center justify-center gap-2 text-[15px] md:text-sm font-bold transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-[2.5px] after:w-full after:bg-[#124d46] after:transition-transform after:duration-300 py-2 md:py-0 ${isActive
			? "text-[#124d46] after:scale-x-100 after:origin-bottom-left font-extrabold"
			: "text-slate-700 after:scale-x-0 after:origin-bottom-right hover:text-[#124d46] hover:after:origin-bottom-left hover:after:scale-x-100"
			}`;
	};

	return (
		<div className="flex flex-col md:flex-row items-center justify-center gap-3.5 md:gap-8 w-full md:w-auto text-center">
			<Link href="/" onClick={onItemClick} className={getLinkClasses("/")}>
				<HiHome className="text-xl text-[#124d46]" /> <span>Home</span>
			</Link>

			{/* Guest + Candidate */}
			{role !== "recruiter" && role !== "admin" && (
				<>
					<Link href="/jobs" onClick={onItemClick} className={getLinkClasses("/jobs")}>
						<HiBriefcase className="text-xl text-[#124d46]" /> <span>Jobs</span>
					</Link>
					<Link href="/companies" onClick={onItemClick} className={getLinkClasses("/companies")}>
						<HiOfficeBuilding className="text-xl text-[#124d46]" /> <span>Companies</span>
					</Link>
				</>
			)}

			<Link href="/about" onClick={onItemClick} className={getLinkClasses("/about")}>
				<HiInformationCircle className="text-xl text-[#124d46]" /> <span>About</span>
			</Link>
		</div>
	);
}