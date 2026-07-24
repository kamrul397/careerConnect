import { ObjectId } from "mongodb";

export const applyJob = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const application = req.body;

    // Check duplicate application
    const alreadyApplied = await db
      .collection("applications")
      .findOne({
        jobId: application.jobId,
        candidateEmail: application.candidateEmail,
      });

    if (alreadyApplied) {
      return res.status(400).send({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    const result = await db
      .collection("applications")
      .insertOne(application);

    res.status(201).send({
      success: true,
      insertedId: result.insertedId,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Application failed.",
    });
  }
};

// Backend API to Check Application
export const hasApplied = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { jobId, email } = req.query;

    const application = await db
      .collection("applications")
      .findOne({
        jobId,
        candidateEmail: email,
      });

    res.send({
      applied: !!application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      applied: false,
    });
  }
};


// getApplicantsByJob
export const getApplicantsByJob = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { jobId } = req.params;

    const applicants = await db
      .collection("applications")
      .find({ jobId })
      .sort({ appliedAt: -1 })
      .toArray();

    res.send(applicants);
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to load applicants",
    });
  }
};


// update applicants status

export const updateApplicationStatus = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { id } = req.params;
    const { status } = req.body;

    const validStatus = [
      "pending",
      "shortlisted",
      "interview",
      "hired",
      "rejected",
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid status",
      });
    }

    const result = await db.collection("applications").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "Application not found.",
      });
    }

    res.send({
      success: true,
      message: "Application status updated.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Failed to update application.",
    });
  }
};

// Get all applications of a candidate
export const getCandidateApplications = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { email } = req.query;

    const applications = await db
      .collection("applications")
      .find({
        candidateEmail: email,
      })
      .sort({
        appliedAt: -1,
      })
      .toArray();

    res.send(applications);
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to load applications.",
    });
  }
};