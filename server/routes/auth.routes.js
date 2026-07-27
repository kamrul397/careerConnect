import express from "express";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/jwt", async (req, res) => {
	try {
		const { email, uid } = req.body;
		const db = req.app.locals.db;
		const usersCollection = db.collection("users");

		// Fetch user from DB to get authoritative role
		const existingUser = await usersCollection.findOne({ email });
		const userRole = existingUser?.role || "applicant";

		// Build verified JWT payload
		const tokenPayload = {
			email,
			uid,
			role: userRole,
		};
		// console.log("tokenPayload ", tokenPayload);

		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.cookie("token", token, {
			httpOnly: true,
			secure: false, // true in production
			sameSite: "lax",
		});

		res.send({ success: true });
	} catch (error) {
		res.status(500).send({ success: false, message: error.message });
	}
});


router.get("/private", verifyToken, (req, res) => {
	res.send({
		message: "Welcome to Private Route",
		user: req.decoded,
	});
});

router.post("/logout", (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		secure: false,
		sameSite: "lax",
	});

	res.send({
		success: true,
	});
});

export default router;
