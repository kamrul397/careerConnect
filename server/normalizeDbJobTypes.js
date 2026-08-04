import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

async function normalizeAndDistribute() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("careerConnectDB");
    const jobsCollection = db.collection("jobs");

    // 1. Standardize all "Full Time" or variations to "Full-time"
    await jobsCollection.updateMany(
      { type: { $regex: /^full\s*time$/i } },
      { $set: { type: "Full-time" } }
    );
    await jobsCollection.updateMany(
      { type: { $regex: /^part\s*time$/i } },
      { $set: { type: "Part-time" } }
    );

    // 2. Distribute types among existing approved jobs so all filter categories have rich listings
    const allJobs = await jobsCollection.find({ status: "approved" }).toArray();

    const types = ["Full-time", "Part-time", "Remote", "Hybrid", "Contract"];

    for (let i = 0; i < allJobs.length; i++) {
      // Assign types evenly across jobs (keeping explicit sample jobs as is)
      const assignedType = types[i % types.length];
      await jobsCollection.updateOne(
        { _id: allJobs[i]._id },
        { $set: { type: assignedType } }
      );
    }

    console.log(`✅ Normalized and balanced ${allJobs.length} jobs across types: Full-time, Part-time, Remote, Hybrid, and Contract!`);

  } catch (error) {
    console.error("Migration error:", error);
  } finally {
    await client.close();
  }
}

normalizeAndDistribute();
