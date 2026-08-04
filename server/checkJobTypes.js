import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

async function checkTypes() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("careerConnectDB");
    const jobsCollection = db.collection("jobs");

    const allApprovedJobs = await jobsCollection.find({ status: "approved" }).toArray();
    console.log("Total approved jobs:", allApprovedJobs.length);

    const typeCounts = {};
    allApprovedJobs.forEach(job => {
      const type = job.type || "MISSING / UNDEFINED";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      console.log(`- Title: "${job.title}", Company: "${job.company}", Type: "${job.type}"`);
    });

    console.log("\nSummary of Job Types:", typeCounts);

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

checkTypes();
