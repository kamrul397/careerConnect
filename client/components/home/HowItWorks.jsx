import {
  FaUserPlus,
  FaSearch,
  FaPaperPlane,
  FaBriefcase,
} from "react-icons/fa";

const steps = [
  {
    id: 1,
    title: "Create Account",
    icon: <FaUserPlus />,
    description: "Sign up as a candidate or recruiter.",
  },
  {
    id: 2,
    title: "Search Jobs",
    icon: <FaSearch />,
    description: "Browse thousands of available jobs.",
  },
  {
    id: 3,
    title: "Apply",
    icon: <FaPaperPlane />,
    description: "Submit your application in one click.",
  },
  {
    id: 4,
    title: "Get Hired",
    icon: <FaBriefcase />,
    description: "Start your new career journey.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">
            How It Works
          </h2>

          <p className="text-gray-600 mt-3">
            Find your next job in four simple steps.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="text-center border rounded-xl p-6"
            >
              <div className="text-4xl text-blue-600 flex justify-center">
                {step.icon}
              </div>

              <h3 className="font-semibold text-xl mt-4">
                {step.title}
              </h3>

              <p className="text-gray-600 mt-3">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}