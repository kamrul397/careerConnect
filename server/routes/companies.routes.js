import express from "express";
import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
} from "../controllers/companies.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

// Public routes
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);

// Admin protected routes
router.post("/", verifyToken, verifyAdmin, createCompany);
router.put("/:id", verifyToken, verifyAdmin, updateCompany);
router.delete("/:id", verifyToken, verifyAdmin, deleteCompany);

export default router;
