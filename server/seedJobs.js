import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("MONGODB_URI is missing in .env file");
  process.exit(1);
}

const sampleJobs = [
  {
    title: "Senior Full Stack Engineer",
    company: "TechVerse Inc",
    category: "Software Development",
    type: "Full-time",
    location: "San Francisco, CA (Hybrid)",
    salary: "$130,000 - $160,000 / year",
    description: "Looking for an experienced Full Stack Engineer proficient in Next.js, React, Node.js, and MongoDB. You will architect high-availability services and scalable cloud infrastructure.",
    requirements: "• 5+ years with JavaScript / TypeScript\n• Strong experience in Next.js & Node.js\n• Mastery of MongoDB / PostgreSQL\n• Experience with AWS/Docker",
    recruiterEmail: "hiring@techverse.com",
    recruiterName: "Sarah Jenkins",
    status: "approved",
    createdAt: new Date(),
  },
  {
    title: "Frontend UI/UX Developer",
    company: "Designify Studio",
    category: "Software Development",
    type: "Part-time",
    location: "Remote",
    salary: "$45 - $65 / hour",
    description: "Join our dynamic team part-time to build stunning, responsive user interfaces and Tailwind CSS design systems.",
    requirements: "• 3+ years experience with React / Next.js\n• Deep expertise in Tailwind CSS & animations\n• Eye for pixel-perfect design & micro-interactions",
    recruiterEmail: "recruiter@designify.io",
    recruiterName: "Alex Rivera",
    status: "approved",
    createdAt: new Date(),
  },
  {
    title: "Lead DevOps & Cloud Engineer",
    company: "CloudScale Systems",
    category: "IT & Software",
    type: "Remote",
    location: "Remote (Global)",
    salary: "$140,000 - $175,000 / year",
    description: "Manage fully remote Kubernetes clusters, CI/CD pipelines, and infrastructure automation across multi-region deployments.",
    requirements: "• Experience with Kubernetes, Docker & Terraform\n• Expertise in AWS or GCP\n• CI/CD pipeline automation (GitHub Actions / Jenkins)",
    recruiterEmail: "devops-careers@cloudscale.net",
    recruiterName: "Marcus Vance",
    status: "approved",
    createdAt: new Date(),
  },
  {
    title: "Product Marketing Manager",
    company: "GrowthPulse",
    category: "Marketing",
    type: "Hybrid",
    location: "New York, NY (Hybrid)",
    salary: "$110,000 - $135,000 / year",
    description: "Drive product positioning, launch campaigns, and user acquisition strategies for our B2B SaaS platform.",
    requirements: "• 4+ years product marketing experience in Tech/SaaS\n• Data-driven growth mindset & campaign management\n• Outstanding written and verbal communication",
    recruiterEmail: "careers@growthpulse.com",
    recruiterName: "Emily Watson",
    status: "approved",
    createdAt: new Date(),
  },
  {
    title: "Senior Data Scientist",
    company: "DataMind AI",
    category: "Data Science",
    type: "Full-time",
    location: "Austin, TX (On-site)",
    salary: "$150,000 - $185,000 / year",
    description: "Build predictive machine learning models and NLP data pipelines for enterprise AI solutions.",
    requirements: "• Master's or Ph.D. in CS, Math, or Data Science\n• Strong Python (PyTorch / TensorFlow / Pandas)\n• Experience with SQL & Vector Databases",
    recruiterEmail: "ai-jobs@datamind.ai",
    recruiterName: "Dr. Alan Turing",
    status: "approved",
    createdAt: new Date(),
  },
  {
    title: "Technical Support Specialist",
    company: "SupportFlow Hub",
    category: "Customer Support",
    type: "Part-time",
    location: "Remote",
    salary: "$30 - $40 / hour",
    description: "Help customers troubleshoot technical issues, guide integrations, and maintain high customer satisfaction.",
    requirements: "• Great communication skills\n• Basic understanding of APIs and web tech\n• Flexible part-time hours",
    recruiterEmail: "support-hiring@supportflow.com",
    recruiterName: "Jessica Alba",
    status: "approved",
    createdAt: new Date(),
  },
  {
    title: "UI/UX Product Designer",
    company: "Creative Labs",
    category: "Design",
    type: "Hybrid",
    location: "Chicago, IL (Hybrid)",
    salary: "$95,000 - $120,000 / year",
    description: "Design intuitive user journeys, wireframes, and design components in Figma for web and mobile apps.",
    requirements: "• Strong portfolio demonstrating end-to-end UX process\n• Proficiency in Figma & prototyping tools\n• Collaboration with frontend development teams",
    recruiterEmail: "design@creativelabs.design",
    recruiterName: "David Miller",
    status: "approved",
    createdAt: new Date(),
  },
  {
    title: "Backend Go Developer",
    company: "StreamByte Security",
    category: "Software Development",
    type: "Contract",
    location: "Remote",
    salary: "$80 - $100 / hour",
    description: "Looking for a contract Go backend engineer to build high-performance microservices and RESTful API endpoints.",
    requirements: "• 4+ years hands-on experience with Golang\n• Deep understanding of concurrency, gRPC, and REST\n• Experience with PostgreSQL & Redis caching",
    recruiterEmail: "contracting@streambyte.com",
    recruiterName: "Brian Armstrong",
    status: "approved",
    createdAt: new Date(),
  }
];

async function seed() {
  const client = new MongoClient(uri);

  try {
    console.log("Connecting to MongoDB...");
    await client.connect();
    const db = client.db("careerConnectDB");

    const jobsCollection = db.collection("jobs");

    // Insert sample jobs for each type
    const result = await jobsCollection.insertMany(sampleJobs);
    console.log(`✅ Successfully added ${result.insertedCount} jobs with types: Full-time, Part-time, Remote, Hybrid, and Contract!`);

    // Also update any existing jobs with missing types to 'Full-time' as a fallback
    const updateResult = await jobsCollection.updateMany(
      { type: { $exists: false } },
      { $set: { type: "Full-time" } }
    );
    if (updateResult.modifiedCount > 0) {
      console.log(`Updated ${updateResult.modifiedCount} existing jobs to have type 'Full-time'.`);
    }

  } catch (error) {
    console.error("Error seeding jobs:", error);
  } finally {
    await client.close();
    console.log("MongoDB connection closed.");
  }
}

seed();
