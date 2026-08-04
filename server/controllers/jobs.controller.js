import { ObjectId } from "mongodb";

export const createJob = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      title,
      category,
      company,
      location,
      salary,
      type,
      description,
      requirements,
      recruiterEmail,
      recruiterName,
    } = req.body;

    const newJob = {
      title,
      category,
      company,
      location,
      salary,
      type,
      description,
      requirements,

      recruiterEmail,
      recruiterName,

      status: "pending", // <-- server decides

      createdAt: new Date(),
    };

    const result = await db
      .collection("jobs")
      .insertOne(newJob);

    res.status(201).json({
      success: true,
      message: "Job submitted for approval.",
      job: {
        ...newJob,
        _id: result.insertedId,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create job",
    });
  }
};

// get recruter all jobs (myjobs)

export const getRecruiterJobs = async (req, res) => {
  try {
    const db = req.app.locals.db;

    // console.log("req.decoded =", req.decoded);
    const { email } = req.query;
    // const email = req.decoded.email;

    // console.log("email =", email);

    const jobs = await db
      .collection("jobs")
      .find({ recruiterEmail: email })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(jobs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter jobs",
    });
  }
};

// get job by id
// export const getJobById = async (req, res) => {
//   try {
//     const db = req.app.locals.db;

//     const { id } = req.params;

//     const job = await db.collection("jobs").findOne({
//       _id: new ObjectId(id),
//     });

//     if (!job) {
//       return res.status(404).send({
//         message: "Job not found",
//       });
//     }

//     res.send(job);
//   } catch (error) {
//     console.error(error);

//     res.status(500).send({
//       message: "Failed to fetch job",
//     });
//   }
// };


// update job
export const updateJob = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { id } = req.params;

    const updatedJob = req.body;

    const result = await db
      .collection("jobs")
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: updatedJob,
        }
      );

    res.send(result);
  } catch (error) {
    res.status(500).send({
      message: "Update failed",
    });
  }
};

// delete job
export const deleteJob = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { id } = req.params;

    const result = await db
      .collection("jobs")
      .deleteOne({
        _id: new ObjectId(id),
      });

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Delete failed",
    });
  }
};



// get pending jobs for admin
export const getPendingJobs = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const jobs = await db
      .collection("jobs")
      .find({ status: "pending" })
      .sort({ createdAt: -1 })
      .toArray();

    res.send(jobs);
  } catch (err) {
    res.status(500).send({
      message: "Failed to fetch pending jobs",
    });
  }
};

// update job status by admin
export const updateJobStatus = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { id } = req.params;

    const { status } = req.body;

    const result = await db.collection("jobs").updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
        },
      }
    );

    res.send(result);

  } catch (err) {

    res.status(500).send({
      message: "Status update failed",
    });

  }
};

// get approve job
export const getApprovedJobs = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { category, type, search } = req.query;

    const filterQuery = { status: "approved" };

    if (category && category !== "All") {
      filterQuery.category = category;
    }

    if (type && type !== "All") {
      filterQuery.type = { $regex: type, $options: "i" };
    }

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filterQuery.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
        { category: searchRegex },
        { type: searchRegex },
      ];
    }

    const jobs = await db
      .collection("jobs")
      .find(filterQuery)
      .sort({ createdAt: -1 })
      .toArray();

    res.send(jobs);
  } catch (error) {
    res.status(500).send({
      message: "Failed to fetch jobs",
    });
  }
};

// get a single approve job
export const getApproveJobById = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const { id } = req.params;

    // console.log("id =", id);

    const job = await db.collection("jobs").findOne({
      _id: new ObjectId(id),
    });

    if (!job) {
      return res.status(404).send({
        message: "Job not found",
      });
    }

    res.send(job);
  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to fetch job",
    });
  }
};

// Get all job categories with job counts
export const getJobCategories = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const categories = await db.collection("jobs").aggregate([
      {
        $match: {
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$category",
          jobs: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          jobs: 1,
        },
      },
      {
        $sort: {
          jobs: -1,
        },
      },
    ]).toArray();

    // console.log("categories =>", categories);
    res.send(categories);

  } catch (error) {
    console.error(error);

    res.status(500).send({
      message: "Failed to fetch categories",
    });
  }
};

// get all jobs for admin (all statuses: approved, pending, rejected)
export const getAllJobsAdmin = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const jobs = await db
      .collection("jobs")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.send(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Failed to fetch all jobs for admin",
    });
  }
};