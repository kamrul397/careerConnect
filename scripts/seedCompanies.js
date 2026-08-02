import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI missing in server/.env");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const initialCompanies = [
  {
    name: "PixelCraft Studios",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1542744094-3a317272018a?q=80&w=1200&auto=format&fit=crop",
    website: "https://pixelcraftstudios.com",
    location: "San Francisco, CA (Hybrid)",
    industry: "Design & Web Development",
    employeeCount: "50-200 employees",
    description:
      "PixelCraft Studios is a premier global creative technology studio building high-performance web interfaces, immersive digital products, and next-generation brand experiences.\n\nFounded by product designers and senior engineers, our team partners with ambitious startups and Fortune 500 enterprises to engineer seamless digital products. We specialize in modern React, Next.js, Tailwind CSS, WebGL animations, and design system architecture. We foster an open, innovative culture focused on craftsmanship and continuous growth.",
  },
  {
    name: "CloudPulse Systems",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    website: "https://cloudpulse.io",
    location: "Austin, TX (On-site)",
    industry: "Software Engineering & Cloud",
    employeeCount: "200-500 employees",
    description:
      "CloudPulse Systems is an enterprise cloud engineering firm specializing in resilient microservice architectures, automated cloud infrastructure, and real-time distributed data backends.\n\nOur mission is to help high-growth technology companies achieve enterprise-grade scalability, zero downtime, and optimal cloud cost efficiency across AWS, Google Cloud, and Azure. We foster an SRE-driven engineering culture built on continuous deployment, automated testing, and blameless post-mortems.",
  },
  {
    name: "AppNexus",
    logo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    website: "https://appnexus.dev",
    location: "Remote",
    industry: "Mobile Development",
    employeeCount: "20-50 employees",
    description:
      "AppNexus is a mobile-first software studio designing award-winning iOS and Android applications for millions of global users.\n\nWe leverage cutting-edge technologies including React Native, Flutter, Swift, and Kotlin alongside cloud-native backend services. Our cross-functional teams of mobile developers, UI/UX strategists, and QA engineers build frictionless mobile experiences from initial concept to App Store launch.",
  },
  {
    name: "NeuralMind Systems",
    logo: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    website: "https://neuralmind.ai",
    location: "Remote",
    industry: "Artificial Intelligence",
    employeeCount: "100-250 employees",
    description:
      "NeuralMind Systems is an artificial intelligence research and engineering company building state-of-the-art machine learning models, LLM fine-tuning pipelines, and intelligent enterprise search engines.\n\nWe empower modern businesses with predictive analytics, natural language processing, and RAG architectures that convert complex data into actionable insights. We are passionate about responsible AI, algorithmic performance, and pushing the boundaries of machine intelligence.",
  },
  {
    name: "NextGen Digital",
    logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    website: "https://nextgendigital.com",
    location: "Seattle, WA (Hybrid)",
    industry: "Product Management & Strategy",
    employeeCount: "100-300 employees",
    description:
      "NextGen Digital is a strategic digital transformation agency partnering with global enterprise leadership to architect Agile product roadmaps, modernize legacy platforms, and drive tech innovation.\n\nOur multidisciplinary team spans technical product managers, solution architects, and UX researchers. Together, we bridge the gap between strategic vision and execution, delivering measurable business growth for clients across finance, healthcare, and retail.",
  },
  {
    name: "CyberShield Defense",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    website: "https://cybershield.security",
    location: "Remote",
    industry: "Cybersecurity",
    employeeCount: "50-150 employees",
    description:
      "CyberShield Defense delivers enterprise-grade cybersecurity operations, threat intelligence, continuous SIEM monitoring, and zero-trust security architecture.\n\nIn an evolving digital threat landscape, CyberShield protects critical assets through proactive penetration testing, cloud security hardening, and rapid incident response. Our team of certified security engineers and ethical hackers ensures continuous compliance and data integrity.",
  },
  {
    name: "ScaleWorks",
    logo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    website: "https://scaleworks.io",
    location: "San Jose, CA (Hybrid)",
    industry: "DevOps & Infrastructure",
    employeeCount: "80-200 employees",
    description:
      "ScaleWorks is a DevOps and Site Reliability Engineering Consultancy empowering high-scale technology companies with automated Kubernetes clusters, GitOps pipelines, and Terraform infrastructure-as-code.\n\nWe specialize in high-availability systems, disaster recovery planning, and automated CI/CD workflows. ScaleWorks enables engineering teams to ship code faster, safer, and with 99.99% operational uptime.",
  },
  {
    name: "Vanguard Growth",
    logo: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1200&auto=format&fit=crop",
    website: "https://vanguardgrowth.agency",
    location: "Chicago, IL (Hybrid)",
    industry: "Marketing & SEO",
    employeeCount: "30-80 employees",
    description:
      "Vanguard Growth is a data-driven performance marketing and SEO agency focused on accelerating user acquisition, revenue scaling, and technical SEO dominance.\n\nBy blending deep analytics with creative storytelling and conversion rate optimization (CRO), Vanguard Growth executes high-impact campaigns across digital channels. We partner with tech founders and marketing executives to build sustainable, compound growth engines.",
  },
  {
    name: "TestSphere Solutions",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    website: "https://testsphere.qa",
    location: "Denver, CO (Hybrid)",
    industry: "Quality Assurance",
    employeeCount: "40-100 employees",
    description:
      "TestSphere Solutions is a software quality assurance & test automation engineering firm dedicated to ensuring seamless software delivery.\n\nWe engineer robust end-to-end automated test suites using Playwright, Cypress, and Selenium, alongside API load testing and accessibility auditing. TestSphere helps software organizations eliminate bugs early in the release pipeline and achieve rapid release cycles.",
  },
  {
    name: "DataSafe Corp",
    logo: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
    website: "https://datasafecorp.com",
    location: "Dallas, TX (On-site)",
    industry: "Database & Analytics",
    employeeCount: "150-350 employees",
    description:
      "DataSafe Corp is an enterprise database & big data management company specializing in high-speed data warehousing, PostgreSQL & Snowflake query optimization, and secure data storage.\n\nOur data engineers and database administrators build resilient data pipelines, real-time analytics dashboards, and encrypted backup infrastructures for mission-critical applications.",
  },
  {
    name: "SaaSify Systems",
    logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    website: "https://saasifysystems.com",
    location: "Boston, MA (Hybrid)",
    industry: "Human Resources & SaaS",
    employeeCount: "75-180 employees",
    description:
      "SaaSify Systems builds modern enterprise SaaS solutions, customer success platforms, and automated workflow software for growing B2B organizations.\n\nOur cloud platform streamlines employee onboarding, cross-department communication, and customer retention metrics. We are dedicated to intuitive design, rapid feature deployment, and high customer satisfaction.",
  },
  {
    name: "Aura Labs",
    logo: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
    website: "https://auralabs.design",
    location: "Remote",
    industry: "Design & UX Strategy",
    employeeCount: "25-60 employees",
    description:
      "Aura Labs is a digital design agency crafting human-centered UI/UX design systems, interactive prototypes, and modern brand identities.\n\nOur design philosophy combines user research with aesthetic excellence and micro-interactions. We work hand-in-hand with engineering teams to ensure design fidelity and responsive experiences across desktop, tablet, and mobile platforms.",
  },
];

async function seedCompanies() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("careerConnectDB");
    const companiesCollection = db.collection("companies");
    const jobsCollection = db.collection("jobs");

    console.log("🏢 Seeding / Updating 12 Companies with long descriptions...");

    for (const compData of initialCompanies) {
      const existing = await companiesCollection.findOne({ name: compData.name });
      let companyId;

      if (!existing) {
        const insertRes = await companiesCollection.insertOne({
          ...compData,
          status: "approved",
          createdBy: "admin@careerconnect.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        companyId = insertRes.insertedId;
        console.log(`✅ Created company: ${compData.name} (_id: ${companyId})`);
      } else {
        companyId = existing._id;
        await companiesCollection.updateOne(
          { _id: companyId },
          {
            $set: {
              description: compData.description,
              updatedAt: new Date(),
            },
          }
        );
        console.log(`🔄 Updated description for: ${compData.name}`);
      }

      // Link jobs matching this company name
      const updateJobsRes = await jobsCollection.updateMany(
        { company: { $regex: `^${compData.name}$`, $options: "i" } },
        {
          $set: {
            companyId: companyId.toString(),
            company: compData.name,
            companyLogo: compData.logo,
          },
        }
      );
      if (updateJobsRes.modifiedCount > 0) {
        console.log(`   🔗 Linked ${updateJobsRes.modifiedCount} job(s) to ${compData.name}`);
      }
    }

    // Link any remaining jobs without companyId to a default company (e.g. PixelCraft Studios)
    const fallbackCompany = await companiesCollection.findOne({ name: "PixelCraft Studios" });
    if (fallbackCompany) {
      const fallbackRes = await jobsCollection.updateMany(
        { companyId: { $exists: false } },
        {
          $set: {
            companyId: fallbackCompany._id.toString(),
            companyLogo: fallbackCompany.logo,
          },
        }
      );
      if (fallbackRes.modifiedCount > 0) {
        console.log(`🔗 Linked ${fallbackRes.modifiedCount} orphan job(s) to fallback company.`);
      }
    }

    console.log("🎉 Company seeding & job migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedCompanies();
