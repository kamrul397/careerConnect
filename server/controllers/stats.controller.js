export const getPublicStats = async (req, res) => {
  try {
    const db = req.app.locals.db;

    // Execute super-fast parallel count queries directly inside MongoDB
    const [approvedJobsCount, totalJobsCount, candidatesCount, usersCount, companiesCount] = await Promise.all([
      db.collection("jobs").countDocuments({ status: "approved" }),
      db.collection("jobs").countDocuments({}),
      db.collection("users").countDocuments({ role: { $in: ["candidate", "user"] } }),
      db.collection("users").countDocuments({}),
      db.collection("companies").countDocuments({}),
    ]);

    res.json({
      success: true,
      stats: {
        activeJobs: approvedJobsCount || totalJobsCount,
        jobSeekers: candidatesCount || usersCount,
        companies: companiesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
};
