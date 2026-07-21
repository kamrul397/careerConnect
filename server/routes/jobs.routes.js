import express from "express";
import { getAllJobs } from "../controllers/jobs.controller.js";

const router = express.Router();

router.get("/", getAllJobs);

export default router;
