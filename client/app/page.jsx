import Categories from "@/components/home/Categories";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
	return (
		<>
			<Hero></Hero>
			<FeaturedJobs></FeaturedJobs>
			<Categories />
			<HowItWorks />
		</>
	);
}
