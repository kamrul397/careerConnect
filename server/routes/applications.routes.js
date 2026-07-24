import express from "express";
import { applyJob, getApplicantsByJob, getCandidateApplications, hasApplied, updateApplicationStatus } from "../controllers/applications.controller.js";

const router = express.Router();

router.post("/", applyJob);
router.get("/check", hasApplied);


router.get("/:jobId/applicants", getApplicantsByJob);

router.patch("/:id/status", updateApplicationStatus);

router.get(
  "/candidate",
  getCandidateApplications
);

export default router;