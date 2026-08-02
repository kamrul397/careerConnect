
import { ObjectId } from "mongodb";

export const createUser = async (req, res) => {
  try {
    const db = req.app.locals.db;

    const usersCollection = db.collection("users");

    const user = req.body;

    // Check if user already exists
    const existingUser = await usersCollection.findOne({
      email: user.email,
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
      });
    }

    const result = await usersCollection.insertOne(user);

    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getUserByEmail = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");

    const { email } = req.params;

    const user = await usersCollection.findOne({ email });

    return res.status(200).json({
      success: true,
      user: user || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");
    const { email } = req.params;
    const updateData = req.body;

    // Prevent updating sensitive fields like _id, role, or email itself
    delete updateData._id;
    delete updateData.role;
    delete updateData.email;

    const result = await usersCollection.updateOne(
      { email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all users for admin// Get all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");

    const users = await usersCollection.find().toArray();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a user (Admin only)
export const deleteUser = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");
    const { id } = req.params;

    // 1. Find the user first
    const targetUser = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2. Block deletion if the user is an admin 🛑
    if (targetUser.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Action forbidden: Admin accounts cannot be deleted.",
      });
    }

    // 3. Proceed with deletion for non-admins
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get public candidates count
export const getCandidatesCount = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const usersCollection = db.collection("users");

    const candidatesCount = await usersCollection.countDocuments({
      role: { $in: ["candidate", "user"] }
    });

    const totalUsers = await usersCollection.countDocuments({});

    res.status(200).json({
      success: true,
      count: candidatesCount || totalUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};