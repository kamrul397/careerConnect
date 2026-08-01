"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiBriefcase, HiOfficeBuilding, HiInformationCircle } from "react-icons/hi";

export default function NavLinks({ user, role }) {
	const pathname = usePathname();

	const getLinkClasses = (href) => {
		const isActive = pathname === href;
		return `flex items-center gap-1.5 text-md font-medium transition-colors relative after:absolute after:-bottom-1.5 after:left-0 after:h-[3px] after:w-full after:bg-[#124d46] after:transition-transform after:duration-300 py-2 md:py-0 ${isActive
			? "text-[#124d46] after:scale-x-100 after:origin-bottom-left text-lg transition-1s"
			: "text-gray-600 after:scale-x-0 after:origin-bottom-right hover:text-[#124d46] hover:after:origin-bottom-left hover:after:scale-x-100"
			}`;
	};

	return (
		<div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
			<Link href="/" className={getLinkClasses("/")}><HiHome className="text-xl" /> Home</Link>

			{/* Guest + Candidate */}
			{role !== "recruiter" && role !== "admin" && (
				<>
					<Link href="/jobs" className={getLinkClasses("/jobs")}><HiBriefcase className="text-xl" /> Jobs</Link>
					<Link href="/companies" className={getLinkClasses("/companies")}><HiOfficeBuilding className="text-xl" /> Companies</Link>
				</>
			)}

			<Link href="/about" className={getLinkClasses("/about")}><HiInformationCircle className="text-xl" /> About</Link>
		</div>
	);
}