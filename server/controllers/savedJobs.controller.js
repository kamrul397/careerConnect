import { ObjectId } from "mongodb";

export const getSavedJobs = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const savedJobsCollection = db.collection("savedJobs");

        const candidateEmail = req.decoded.email;

        if (req.decoded.role !== "candidate") {
            return res.status(403).send({
                success: false,
                message: "Only candidates can view saved jobs.",
            });
        }

        // Fetch saved jobs and join with jobs collection
        const savedJobs = await savedJobsCollection
            .aggregate([
                {
                    $match: { candidateEmail },
                },
                {
                    $lookup: {
                        from: "jobs",
                        localField: "jobId",
                        foreignField: "_id",
                        as: "jobDetails",
                    },
                },
                {
                    $unwind: "$jobDetails",
                },
                {
                    $sort: { savedAt: -1 },
                },
                {
                    $project: {
                        _id: 1,
                        savedAt: 1,
                        jobId: 1,
                        "jobDetails._id": 1,
                        "jobDetails.title": 1,
                        "jobDetails.company": 1,
                        "jobDetails.location": 1,
                        "jobDetails.type": 1,
                        "jobDetails.salary": 1,
                        "jobDetails.category": 1,
                        "jobDetails.status": 1,
                    },
                },
            ])
            .toArray();

        res.send({
            success: true,
            savedJobs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};

export const saveJob = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const savedJobsCollection = db.collection("savedJobs");

        const candidateEmail = req.decoded.email;
        if (req.decoded.role !== "candidate") {
            return res.status(403).send({
                success: false,
                message: "Only candidates can save jobs.",
            });
        }
        const { jobId } = req.body;

        // Validate jobId
        if (!ObjectId.isValid(jobId)) {
            return res.status(400).send({
                success: false,
                message: "Invalid job ID",
            });
        }

        // Check if already saved
        const alreadySaved = await savedJobsCollection.findOne({
            candidateEmail,
            jobId: new ObjectId(jobId),
        });

        if (alreadySaved) {
            return res.status(409).send({
                success: false,
                message: "Job already saved",
            });
        }

        // Save job
        const result = await savedJobsCollection.insertOne({
            candidateEmail,
            jobId: new ObjectId(jobId),
            savedAt: new Date(),
        });

        res.status(201).send({
            success: true,
            message: "Job saved successfully",
            insertedId: result.insertedId,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};

export const removeSavedJob = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const savedJobsCollection = db.collection("savedJobs");

        const candidateEmail = req.decoded.email;

        if (req.decoded.role !== "candidate") {
            return res.status(403).send({
                success: false,
                message: "Only candidates can remove saved jobs.",
            });
        }

        const { jobId } = req.params;

        // Validate jobId
        if (!ObjectId.isValid(jobId)) {
            return res.status(400).send({
                success: false,
                message: "Invalid job ID",
            });
        }

        // Delete by both candidateEmail + jobId (ownership check)
        const result = await savedJobsCollection.deleteOne({
            candidateEmail,
            jobId: new ObjectId(jobId),
        });

        if (result.deletedCount === 0) {
            return res.status(404).send({
                success: false,
                message: "Saved job not found.",
            });
        }

        res.send({
            success: true,
            message: "Job removed from saved list.",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};