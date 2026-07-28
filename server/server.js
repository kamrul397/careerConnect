import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import jobsRoutes from "./routes/jobs.routes.js";
import usersRoutes from "./routes/users.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	}),
);

const db = await connectDB();
app.locals.db = db;

app.use("/api/users", usersRoutes);

app.use("/api/jobs", jobsRoutes);

app.use("/api/applications", applicationsRoutes);

app.use("/api/auth", authRoutes);

// // Connect Database
// const db = await connectDB();

// Test Route
app.get("/", (req, res) => {
	res.json({
		success: true,
		message: "CareerConnect API is running 🚀",
	});
});

// Test Database Route
app.get("/test-db", async (req, res) => {
	const collections = await db.listCollections().toArray();

	res.json({
		success: true,
		collections,
	});
});

app.listen(PORT, () => {
	console.log(`🚀 Server running on http://localhost:${PORT}`);
});
