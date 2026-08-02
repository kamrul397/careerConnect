import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import jobsRoutes from "./routes/jobs.routes.js";
import usersRoutes from "./routes/users.routes.js";
import applicationsRoutes from "./routes/applications.routes.js";
import authRoutes from "./routes/auth.routes.js";
import savedJobsRoutes from "./routes/savedJobs.routes.js";
import companiesRoutes from "./routes/companies.routes.js";
import statsRoutes from "./routes/stats.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
	"http://localhost:3000",
	process.env.CLIENT_URL,
].filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
				callback(null, true);
			} else {
				callback(null, true);
			}
		},
		credentials: true,
	})
);


const db = await connectDB();
app.locals.db = db;

app.use("/api/users", usersRoutes);

app.use("/api/jobs", jobsRoutes);

app.use("/api/applications", applicationsRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/saved-jobs", savedJobsRoutes);

app.use("/api/companies", companiesRoutes);

app.use("/api/stats", statsRoutes);





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
