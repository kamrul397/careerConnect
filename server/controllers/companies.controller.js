import { ObjectId } from "mongodb";

// Create new company (Admin)
export const createCompany = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      name,
      logo,
      banner,
      website,
      location,
      industry,
      employeeCount,
      description,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    const newCompany = {
      name: name.trim(),
      logo: logo || "",
      banner: banner || "",
      bannerImage: banner || "",
      website: website || "",
      location: location || "Remote",
      industry: industry || "Technology",
      employeeCount: employeeCount || "10-50 employees",
      description: description || "",
      status: "approved",
      createdBy: req.decoded?.email || "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("companies").insertOne(newCompany);

    res.status(201).json({
      success: true,
      message: "Company created successfully.",
      company: {
        ...newCompany,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error("Create Company Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create company.",
    });
  }
};

// Get all companies (Public/Recruiter/Admin with optional search & job counts)
export const getAllCompanies = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { search, industry } = req.query;

    const filter = {};

    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [
        { name: searchRegex },
        { industry: searchRegex },
        { location: searchRegex },
      ];
    }

    if (industry && industry !== "All") {
      filter.industry = { $regex: industry, $options: "i" };
    }

    const companies = await db
      .collection("companies")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Safely attach active job count to each company
    const companiesWithJobsCount = await Promise.all(
      companies.map(async (company) => {
        const jobCount = await db.collection("jobs").countDocuments({
          $or: [
            { companyId: company._id.toString() },
            { companyId: company._id },
            { company: company.name },
          ],
          status: "approved",
        });

        return {
          ...company,
          jobsCount: jobCount,
        };
      })
    );

    res.json(companiesWithJobsCount);
  } catch (error) {
    console.error("Get Companies Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch companies.",
    });
  }
};

// Get single company by ID with its jobs
export const getCompanyById = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format.",
      });
    }

    const company = await db.collection("companies").findOne({
      _id: new ObjectId(id),
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    // Safely fetch jobs belonging to this company
    const jobs = await db
      .collection("jobs")
      .find({
        $or: [
          { companyId: company._id.toString() },
          { companyId: company._id },
          { company: company.name },
        ],
        status: "approved",
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      company: {
        ...company,
        jobs,
        jobsCount: jobs.length,
      },
    });
  } catch (error) {
    console.error("Get Company By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch company details.",
    });
  }
};

// Update company details (Admin)
export const updateCompany = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format.",
      });
    }

    const {
      name,
      logo,
      banner,
      website,
      location,
      industry,
      employeeCount,
      description,
    } = req.body;

    const updateFields = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateFields.name = name.trim();
    if (logo !== undefined) updateFields.logo = logo;
    if (banner !== undefined) {
      updateFields.banner = banner;
      updateFields.bannerImage = banner;
    }
    if (website !== undefined) updateFields.website = website;
    if (location !== undefined) updateFields.location = location;
    if (industry !== undefined) updateFields.industry = industry;
    if (employeeCount !== undefined) updateFields.employeeCount = employeeCount;
    if (description !== undefined) updateFields.description = description;

    const result = await db.collection("companies").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.json({
      success: true,
      message: "Company updated successfully.",
    });
  } catch (error) {
    console.error("Update Company Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update company.",
    });
  }
};

// Delete company (Admin)
export const deleteCompany = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID format.",
      });
    }

    const result = await db.collection("companies").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    res.json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Company Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete company.",
    });
  }
};
