import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is missing in server/.env");
  process.exit(1);
}

const client = new MongoClient(uri);

// Curated distinct logo images for tech companies
const DISTINCT_LOGOS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572021335469-31706a17aaef?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=300&auto=format&fit=crop",
];

// Curated distinct high-resolution hero banner covers
const DISTINCT_BANNERS = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531973576160-7125cd663d86?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1400&auto=format&fit=crop",
];

const SAMPLE_JOB_TEMPLATES = [
  {
    title: "Senior Full Stack Engineer (React & Node.js)",
    category: "Web Development",
    type: "Full Time",
    salary: "$120,000 - $155,000 / year",
    location: "Remote / Hybrid",
    description: "Lead end-to-end web application development using React, Next.js, and Node.js microservices. Architect scalable database schemas, optimize API latency, and mentor junior engineers.",
    requirements: "4+ years TypeScript/React, experience with MongoDB/SQL databases, RESTful & GraphQL APIs, and AWS/Vercel deployment pipelines.",
  },
  {
    title: "Lead UI/UX Product Designer",
    category: "Design",
    type: "Full Time",
    salary: "$105,000 - $135,000 / year",
    location: "San Francisco, CA (Hybrid)",
    description: "Design modern, pixel-perfect user interfaces and intuitive interaction flows for our flagship web and mobile products. Collaborate closely with engineering and product management.",
    requirements: "3+ years Figma experience, design systems creation, user research expertise, and basic understanding of frontend HTML/CSS constraints.",
  },
  {
    title: "Cloud DevOps & Platform Engineer",
    category: "DevOps",
    type: "Full Time",
    salary: "$130,000 - $165,000 / year",
    location: "Austin, TX (Remote)",
    description: "Manage scalable Kubernetes clusters, Automated CI/CD pipelines, and cloud infrastructure monitoring to ensure 99.99% system availability.",
    requirements: "Experience with Docker, Kubernetes, Terraform, AWS/GCP cloud services, GitHub Actions, and Prometheus/Grafana monitoring.",
  },
  {
    title: "Senior Mobile Developer (React Native)",
    category: "Mobile Development",
    type: "Full Time",
    salary: "$115,000 - $145,000 / year",
    location: "Remote",
    description: "Develop high-performance cross-platform mobile apps for iOS and Android using React Native and native module integrations.",
    requirements: "3+ years React Native experience, proficiency in Redux/Zustand, Xcode/Android Studio native toolchains, and App Store deployment.",
  },
];

async function run() {
  try {
    await client.connect();
    const db = client.db("careerConnectDB");
    const companiesColl = db.collection("companies");
    const jobsColl = db.collection("jobs");

    const companies = await companiesColl.find().toArray();
    console.log(`Found ${companies.length} companies in database.`);

    let jobsAdded = 0;
    let companiesUpdated = 0;

    for (let i = 0; i < companies.length; i++) {
      const comp = companies[i];
      const compIdStr = comp._id.toString();

      // Check existing approved jobs for this company
      const existingJobsCount = await jobsColl.countDocuments({
        $or: [
          { companyId: compIdStr },
          { companyId: comp._id },
          { company: { $regex: `^${comp.name}$`, $options: "i" } },
        ],
        status: "approved",
      });

      // Update company profile pic (logo) and distinct hero banner
      const assignedLogo = DISTINCT_LOGOS[i % DISTINCT_LOGOS.length];
      const assignedBanner = DISTINCT_BANNERS[i % DISTINCT_BANNERS.length];

      await companiesColl.updateOne(
        { _id: comp._id },
        {
          $set: {
            logo: comp.logo || assignedLogo,
            banner: assignedBanner,
            updatedAt: new Date(),
          },
        }
      );
      companiesUpdated++;

      // If company has 0 jobs, insert 1 to 2 jobs for this company
      if (existingJobsCount === 0) {
        console.log(`Company "${comp.name}" has 0 active jobs. Generating new jobs...`);

        const template1 = SAMPLE_JOB_TEMPLATES[i % SAMPLE_JOB_TEMPLATES.length];
        const template2 = SAMPLE_JOB_TEMPLATES[(i + 1) % SAMPLE_JOB_TEMPLATES.length];

        const newJob1 = {
          title: template1.title,
          company: comp.name,
          companyId: compIdStr,
          location: comp.location || template1.location,
          salary: template1.salary,
          type: template1.type,
          category: template1.category,
          description: template1.description,
          requirements: template1.requirements,
          recruiterEmail: comp.createdBy || "recruiter@careerconnect.com",
          recruiterName: `${comp.name} Hiring Team`,
          status: "approved",
          createdAt: new Date(),
        };

        const newJob2 = {
          title: template2.title,
          company: comp.name,
          companyId: compIdStr,
          location: comp.location || template2.location,
          salary: template2.salary,
          type: template2.type,
          category: template2.category,
          description: template2.description,
          requirements: template2.requirements,
          recruiterEmail: comp.createdBy || "recruiter@careerconnect.com",
          recruiterName: `${comp.name} Talent Acquisition`,
          status: "approved",
          createdAt: new Date(),
        };

        await jobsColl.insertMany([newJob1, newJob2]);
        jobsAdded += 2;
        console.log(`Inserted 2 new jobs for "${comp.name}".`);
      }
    }

    console.log(`✅ Completed! Updated ${companiesUpdated} company profile logos/hero banners, added ${jobsAdded} new jobs.`);
  } catch (err) {
    console.error("Error populating database:", err);
  } finally {
    await client.close();
  }
}

run();
