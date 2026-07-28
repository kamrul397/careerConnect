import express from "express";
import { createUser, deleteUser, getAllUsers, getUserByEmail, updateUser } from "../controllers/users.controller.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyRecruiter from "../middleware/verifyRecruiter.js";


const router = express.Router();

// Admin routes
router.get("/", verifyToken, verifyAdmin, getAllUsers);
router.delete("/:id", verifyToken, verifyAdmin, deleteUser);


router.post("/", createUser);
router.get("/:email", getUserByEmail);
router.patch("/:email", verifyToken, updateUser);
export default router;