const verifyRecruiter = (req, res, next) => {
    // 1. Read role directly from req.decoded (permits recruiter and admin)
    if (req.decoded?.role !== "recruiter" && req.decoded?.role !== "admin") {
        return res.status(403).send({
            message: "Forbidden access. Recruiter or Admin role required."
        });
    }

    // 2. Role is valid, proceed!
    next();
};

export default verifyRecruiter;