import express from "express";
import {
  applyJob,
  getApplicantsByJob,
  getCandidateApplications,
  hasApplied,
  updateApplicationStatus,
} from "../controllers/applications.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyRecruiter from "../middleware/verifyRecruiter.js";

const router = express.Router();

// 1. Static routes FIRST
router.post("/", verifyToken, applyJob);
router.get("/check", verifyToken, hasApplied);
router.get("/candidate", verifyToken, getCandidateApplications); // ✅ Moved up above parameterized routes

// 2. Dynamic/Parameterized routes LAST
router.get("/:jobId/applicants", verifyToken, verifyRecruiter, getApplicantsByJob);
router.patch("/:id/status", verifyToken, verifyRecruiter, updateApplicationStatus);

export default router;