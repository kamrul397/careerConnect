import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).send({
			message: "Unauthorized Access",
		});
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).send({
				message: "Invalid Token",
			});
		}

		req.decoded = decoded;

		next();
	});
};

export default verifyToken;
