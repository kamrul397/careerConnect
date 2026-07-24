import express from "express";
import {
  createJob,
  deleteJob,
  getApprovedJobs,
  getApproveJobById,
  getJobById,
  getPendingJobs,
  getRecruiterJobs,
  updateJob,
  updateJobStatus,
} from "../controllers/jobs.controller.js";

const router = express.Router();

// 1. Static / Specific path routes FIRST
router.post("/", createJob);
router.get("/recruiter", getRecruiterJobs);
router.get("/pending", getPendingJobs); // ✅ Moved above /:id
router.get("/", getApprovedJobs);

// 2. Specific sub-path parameter routes NEXT
router.patch("/:id/status", updateJobStatus);

// 3. Generic dynamic /:id routes LAST
router.get("/:id", getApproveJobById);
router.get("/:id", getJobById);
router.patch("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;