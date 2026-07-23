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