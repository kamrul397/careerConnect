import express from "express";
import {
	createJob,
	deleteJob,
	getApprovedJobs,
	getApproveJobById,
	getPendingJobs,
	getRecruiterJobs,
	updateJob,
	updateJobStatus,
} from "../controllers/jobs.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyRecruiter from "../middleware/verifyRecruiter.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

//		1. Static / Specific path routes FIRST
router.post("/", verifyToken, verifyRecruiter, createJob);
router.get("/recruiter", verifyToken, verifyRecruiter, getRecruiterJobs);
router.get("/pending", verifyToken, verifyAdmin, getPendingJobs); // ✅ Moved above /:id
router.get("/", getApprovedJobs);

// 2. Specific sub-path parameter routes NEXT
router.patch("/:id/status", verifyToken, verifyAdmin, updateJobStatus);

// 3. Generic dynamic /:id routes LAST
router.get("/:id", getApproveJobById);
// router.get("/:id", getJobById);
router.patch("/:id", verifyToken, verifyRecruiter, updateJob);
router.delete("/:id", verifyToken, verifyRecruiter, deleteJob);

export default router;
