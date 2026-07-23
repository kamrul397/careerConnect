import express from "express";
import { createUser, getUserByEmail } from "../controllers/users.controller.js";

const router = express.Router();

router.post("/", createUser);
router.get("/:email", getUserByEmail);



export default router;