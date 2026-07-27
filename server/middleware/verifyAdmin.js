const verifyAdmin = (req, res, next) => {
    // Check the role attached to req.decoded by verifyToken
    if (req.decoded?.role !== "admin") {
        return res.status(403).send({
            success: false,
            message: "Forbidden access. Admin role required.",
        });
    }

    // User is an admin, proceed to the route controller
    next();
};

export default verifyAdmin;