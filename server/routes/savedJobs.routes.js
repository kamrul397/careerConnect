
import express from "express";
import { saveJob, getSavedJobs, removeSavedJob } from "../controllers/savedJobs.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getSavedJobs);
router.post("/", verifyToken, saveJob);
router.delete("/:jobId", verifyToken, removeSavedJob);

export default router;
