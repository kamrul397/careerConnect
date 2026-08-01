import Link from "next/link";
import {
  FaBriefcase,
  FaUsers,
  FaBuilding,
  FaAward,
  FaRocket,
  FaShieldAlt,
  FaChartLine,
  FaHandshake,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";


export const metadata = {
  title: "About Us | CareerConnect",
  description:
    "Learn about CareerConnect, our mission, vision, and how we empower job seekers and companies worldwide.",
};

export default function AboutPage() {
  const stats = [
    {
      icon: FaBriefcase,
      value: "15,000+",
      label: "Active Job Listings",
      color: "from-teal-500 to-emerald-600",
    },
    {
      icon: FaUsers,
      value: "50,000+",
      label: "Talented Job Seekers",
      color: "from-emerald-500 to-teal-700",
    },
    {
      icon: FaBuilding,
      value: "2,500+",
      label: "Verified Employers",
      color: "from-teal-600 to-teal-800",
    },
    {
      icon: FaAward,
      value: "98%",
      label: "Hiring Success Rate",
      color: "from-emerald-600 to-teal-500",
    },
  ];

  const coreValues = [
    {
      icon: FaRocket,
      title: "Fast-Track Hiring",
      description:
        "Bypass traditional ATS blackholes. Directly connect candidates with hiring managers and active recruiters.",
    },
    {
      icon: FaShieldAlt,
      title: "Verified Opportunities",
      description:
        "Every job posting on CareerConnect is vetted for legitimacy, competitive compensation, and quality work environments.",
    },
    {
      icon: FaChartLine,
      title: "Career Advancement",
      description:
        "We empower developers and professionals with tools, salary insights, and resources to level up their careers.",
    },
    {
      icon: FaHandshake,
      title: "Transparent & Inclusive",
      description:
        "We advocate for pay transparency, remote work flexibility, and fair opportunities for talent globally.",
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Platform Inception",
      description: "Launched CareerConnect to simplify job discovery for tech talent.",
    },
    {
      year: "2025",
      title: "Rapid Community Growth",
      description: "Crossed 25,000 active job seekers and partnered with 1,000+ top startups.",
    },
    {
      year: "2026",
      title: "Global Ecosystem",
      description: "Expanded worldwide with real-time job matching, recruiter portals, and instant application tracking.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-24 pb-16 relative w-full max-w-full overflow-x-hidden">
      {/* Decorative Ambient Background Effects */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-[#124d46]/10 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-96 h-96 bg-teal-300/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none" />

      {/* 1. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-[#124d46] text-sm font-semibold mb-6 shadow-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          About CareerConnect
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Empowering Tech Careers. <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-[#124d46] via-teal-600 to-emerald-600 bg-clip-text text-transparent">
            Connecting Global Talent.
          </span>
        </h1>

        <p className="mt-6 text-slate-600 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
          CareerConnect is designed to transform how candidates find dream opportunities and how forward-thinking companies build high-performing teams.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200/80 shadow-md shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-sm`}>
                  <Icon className="text-xl" />
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-slate-900">{item.value}</div>
                <div className="text-xs md:text-sm font-medium text-slate-500 mt-1">{item.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Mission & Vision */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-[#124d46] to-[#0a2e2a] text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-teal-500/20 group-hover:text-teal-400/30 transition duration-500">
              <FaRocket className="text-9xl" />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 bg-teal-400/20 border border-teal-300/30 rounded-full text-teal-200 text-xs font-semibold uppercase tracking-wider">
                Our Mission
              </span>
              <h2 className="text-2xl md:text-3xl font-bold">Simplify Hiring & Career Growth</h2>
              <p className="text-teal-100/90 text-sm md:text-base leading-relaxed">
                To bridge the gap between ambitious job seekers and industry-leading employers through transparent, efficient, and intelligent hiring solutions.
              </p>
              <ul className="space-y-2 pt-2 text-sm text-teal-200">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-teal-400" />
                  <span>Eliminate hiring friction & lengthy wait times</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-teal-400" />
                  <span>Promote equal remote and local tech opportunities</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-slate-100 group-hover:text-slate-200 transition duration-500">
              <FaAward className="text-9xl" />
            </div>
            <div className="relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                Our Vision
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">A Borderless Career Ecosystem</h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                To become the world's most trusted recruitment platform where candidates showcase true capability and companies build diverse, elite teams seamlessly.
              </p>
              <ul className="space-y-2 pt-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-600" />
                  <span>Empower 100,000+ candidates by 2030</span>
                </li>
                <li className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-600" />
                  <span>Real-time talent matching & verified profiles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose CareerConnect */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
            Why Professionals & Employers Choose Us
          </h2>
          <p className="text-slate-600 text-base">
            Built with modern technology to deliver a superior candidate experience and recruiter workflow.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#124d46] flex items-center justify-center text-xl mb-4 font-bold">
                    <Icon />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600 text-xs md:text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Company Journey Timeline */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">Our Growth Journey</h2>
          <p className="text-slate-600 text-sm mt-2">Continuously building for job seekers worldwide.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-white/90 p-6 rounded-2xl border border-slate-200/80 shadow-md relative">
              <span className="text-2xl font-extrabold text-teal-600 block mb-1">{m.year}</span>
              <h3 className="text-base font-bold text-slate-900 mb-2">{m.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{m.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CTA Section */}
      <section className="max-w-7xl mx-auto px-6 mt-12">
        <div className="relative bg-gradient-to-r from-[#124d46] via-[#0d3c37] to-[#082824] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Take the Next Step in Your Career?
            </h2>
            <p className="text-teal-100 text-base md:text-lg">
              Explore thousands of developer and tech openings or start recruiting top talent today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/jobs"
                className="bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold px-8 py-3.5 rounded-full shadow-lg shadow-teal-900/40 hover:brightness-110 transition duration-200 flex items-center gap-2 text-sm md:text-base"
              >
                <span>Browse All Jobs</span>
                <FaArrowRight className="text-xs" />
              </Link>
              <Link
                href="/register"
                className="border border-teal-300/40 bg-teal-900/40 text-teal-100 hover:bg-teal-800/60 font-semibold px-8 py-3.5 rounded-full transition duration-200 text-sm md:text-base"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
