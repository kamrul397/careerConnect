// addCategories.js – One‑off script to back‑fill a `category` field on every job document
// ------------------------------------------------------------
// Prerequisites:
// 1. Install the Admin SDK in this project: `npm install firebase-admin` (run from the project root).
// 2. Obtain a service‑account JSON key from your Firebase console and place it
//    somewhere safe, e.g. `./serviceAccountKey.json` at the project root.
// 3. Ensure the service account has read/write access to Cloud Firestore.
// ------------------------------------------------------------
// Usage: `node scripts/addCategories.js`
// ------------------------------------------------------------

const admin = require("firebase-admin");
const path = require("path");

// --------------------------------------------------------------------
// Initialise Firebase Admin SDK
// --------------------------------------------------------------------
// You can either set the path via an environment variable or edit the line
// below to point directly at your key file.
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT
  ? path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT)
  : path.resolve(__dirname, "../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

const db = admin.firestore();

// --------------------------------------------------------------------
// Simple heuristic to map a job title to a category string.
// Extend or replace this mapping to suit your domain.
// --------------------------------------------------------------------
function inferCategory(title) {
  const lower = title.toLowerCase();
  if (/frontend|react|next\.js|angular|vue|javascript|typescript/.test(lower))
    return "Development";
  if (/design|ui|ux|graphic/.test(lower)) return "Design";
  if (/marketing|seo|social/.test(lower)) return "Marketing";
  if (/finance|account|cpa|tax/.test(lower)) return "Finance";
  if (/data|ml|machine learning|ai|science/.test(lower)) return "Data Science";
  if (/manager|lead|director|head/.test(lower)) return "Management";
  return "Other";
}

async function backfillCategories() {
  const jobsRef = db.collection("jobs");
  const snapshot = await jobsRef.get();

  if (snapshot.empty) {
    console.log("No job documents found.");
    return;
  }

  console.log(`Found ${snapshot.size} job document(s). Processing…`);

  const batch = db.batch();
  let counter = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    // Skip if already has a category field
    if (data.category) return;

    const title = data.title || "";
    const category = inferCategory(title);
    const docRef = jobsRef.doc(doc.id);
    batch.update(docRef, { category });
    counter++;
    console.log(`- ${doc.id}: "${title}" => ${category}`);
  });

  if (counter === 0) {
    console.log("All documents already contain a `category` field. No updates needed.");
    return;
  }

  console.log(`Committing batch update for ${counter} document(s)…`);
  await batch.commit();
  console.log("Batch commit complete.");
}

backfillCategories()
  .then(() => {
    console.log("Script finished successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error during back‑fill:", err);
    process.exit(1);
  });
