const verifyRecruiter = (req, res, next) => {
    // 1. Read role directly from req.decoded (no DB query!)
    if (req.decoded?.role !== "recruiter") {
        return res.status(403).send({
            message: "Forbidden access. Recruiter role required."
        });
    }

    // 2. Role is valid, proceed!
    next();
};

export default verifyRecruiter;