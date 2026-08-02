import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI missing in .env");
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
    description: "PixelCraft Studios is a premiere creative studio building high-performance web interfaces and next-generation digital brand experiences.",
  },
  {
    name: "CloudPulse Systems",
    logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    website: "https://cloudpulse.io",
    location: "Austin, TX (On-site)",
    industry: "Software Engineering & Cloud",
    employeeCount: "200-500 employees",
    description: "CloudPulse Systems engineers resilient microservice architectures, cloud infrastructure automation, and real-time distributed data backend systems.",
  },
  {
    name: "AppNexus",
    logo: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    website: "https://appnexus.dev",
    location: "Remote",
    industry: "Mobile Development",
    employeeCount: "20-50 employees",
    description: "AppNexus designs and crafts award-winning mobile apps for iOS & Android, leveraging React Native, Flutter, and native Swift/Kotlin stacks.",
  },
  {
    name: "NeuralMind Systems",
    logo: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    website: "https://neuralmind.ai",
    location: "Remote",
    industry: "Artificial Intelligence",
    employeeCount: "100-250 employees",
    description: "NeuralMind Systems specializes in machine learning research, LLM fine-tuning, RAG enterprise search, and predictive AI analytics.",
  },
  {
    name: "NextGen Digital",
    logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    website: "https://nextgendigital.com",
    location: "Seattle, WA (Hybrid)",
    industry: "Product Management & Strategy",
    employeeCount: "100-300 employees",
    description: "NextGen Digital partners with global enterprises to drive digital transformation, Agile product roadmaps, and high-impact technology strategies.",
  },
  {
    name: "CyberShield Defense",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop",
    website: "https://cybershield.security",
    location: "Remote",
    industry: "Cybersecurity",
    employeeCount: "50-150 employees",
    description: "CyberShield Defense delivers end-to-end threat intelligence, SIEM monitoring, penetration testing, and zero-trust security architecture.",
  },
  {
    name: "ScaleWorks",
    logo: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop",
    website: "https://scaleworks.io",
    location: "San Jose, CA (Hybrid)",
    industry: "DevOps & Infrastructure",
    employeeCount: "80-200 employees",
    description: "ScaleWorks empowers tech companies with automated Kubernetes clusters, Terraform infrastructure-as-code, and 99.99% uptime SRE practices.",
  },
  {
    name: "Vanguard Growth",
    logo: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1200&auto=format&fit=crop",
    website: "https://vanguardgrowth.agency",
    location: "Chicago, IL (Hybrid)",
    industry: "Marketing & SEO",
    employeeCount: "30-80 employees",
    description: "Vanguard Growth is a data-driven digital growth agency executing ROI-focused performance marketing, technical SEO, and CRO campaigns.",
  },
  {
    name: "TestSphere Solutions",
    logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop",
    website: "https://testsphere.qa",
    location: "Denver, CO (Hybrid)",
    industry: "Quality Assurance",
    employeeCount: "40-100 employees",
    description: "TestSphere Solutions provides continuous automated testing, Playwright & Cypress test suites, and load testing for mission-critical apps.",
  },
  {
    name: "DataSafe Corp",
    logo: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop",
    website: "https://datasafecorp.com",
    location: "Dallas, TX (On-site)",
    industry: "Database & Analytics",
    employeeCount: "150-350 employees",
    description: "DataSafe Corp specializes in high-speed data warehousing, PostgreSQL/Snowflake query optimization, and enterprise database security.",
  },
  {
    name: "SaaSify Systems",
    logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    website: "https://saasifysystems.com",
    location: "Boston, MA (Hybrid)",
    industry: "Human Resources & SaaS",
    employeeCount: "75-180 employees",
    description: "SaaSify Systems provides modern enterprise B2B workflows, customer success platforms, and automated employee onboarding solutions.",
  },
  {
    name: "Aura Labs",
    logo: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=300&auto=format&fit=crop",
    banner: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop",
    website: "https://auralabs.design",
    location: "Remote",
    industry: "Design & UX Strategy",
    employeeCount: "25-60 employees",
    description: "Aura Labs crafts delightful digital product designs, high-converting mobile wireframes, motion graphics, and sleek brand identities.",
  },
];

async function seedCompanies() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await client.connect();
    const db = client.db("careerConnectDB");
    const companiesCollection = db.collection("companies");
    const jobsCollection = db.collection("jobs");

    console.log("🏢 Seeding 12 Companies...");

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
        console.log(`ℹ️ Company already exists: ${compData.name} (_id: ${companyId})`);
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

    // Link any remaining jobs without companyId to fallback company (PixelCraft Studios)
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
