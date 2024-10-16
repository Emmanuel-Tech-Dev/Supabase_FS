const { hasPassword } = require("../services/hasPassWord.js");
const supabase = require("../supbase_config/config.js");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

// Get all users
const getUsers = async (req, res) => {
  try {
    const { sort, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    // Validate page and limit
    if (isNaN(parsedPage) || parsedPage < 1) {
      return res.status(400).json({ message: "Invalid page number" });
    }

    if (isNaN(parsedLimit) || parsedLimit < 1) {
      return res.status(400).json({ message: "Invalid limit number" });
    }

    const cacheKey = `users:${sort}:${parsedPage}:${parsedLimit}`;
    const cachedUsers = cache.get(cacheKey);
    if (cachedUsers) {
      return res.status(200).json({
        data: cachedUsers,
        message: "Users fetched successfully (from cache)",
      });
    }

    // Initialize the query
    let query = supabase.from("user").select("*");

    // Handle sorting if provided
    if (sort) {
      const sortBy = sort.split(",");
      sortBy.forEach((sortedField) => {
        const order = sortedField.startsWith("-") ? "desc" : "asc";
        const field = sortedField.replace("-", "");
        query = query.order(field, { ascending: order === "asc" });
      });
    }

    const offset = (parsedPage - 1) * parsedLimit;
    const { data, error } = await query.range(offset, offset + parsedLimit - 1);

    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    cache.set(cacheKey, data); // Cache the result

    return res.status(200).json({
      data,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Bad Request!" });
  }
};

// Get user by id
const getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `user:${id}`;
    const cachedUser = cache.get(cacheKey);

    if (cachedUser) {
      return res.status(200).json({
        data: cachedUser,
        message: "User fetched successfully (from cache)",
      });
    }

    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    cache.set(cacheKey, data); // Cache the user data

    return res
      .status(200)
      .json({ data: data[0], message: "User fetched successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get user by custom_id
const getUsersByCustomId = async (req, res) => {
  try {
    const { id: custom_id } = req.params;
    const cacheKey = `user:custom_id:${custom_id}`;
    const cachedUser = cache.get(cacheKey);

    if (cachedUser) {
      return res.status(200).json({
        data: cachedUser,
        message: "User fetched successfully (from cache)",
      });
    }

    const { data, error } = await supabase
      .from("user")
      .select("*")
      .eq("custom_id", custom_id);

    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    if (data.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    cache.set(cacheKey, data[0]); // Cache the user data

    return res
      .status(200)
      .json({ data: data[0], message: "User fetched successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Create a new user
const createUser = async (req, res) => {
  try {
    const { userData } = req.body;

    if (!userData) {
      return res.status(400).json({ message: "Bad Request: Data is required" });
    }

    const { data, error } = await supabase
      .from("user")
      .insert(userData)
      .select();

    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    cache.flushAll(); // Clear cache after creating a user

    return res
      .status(201)
      .json({ data: data[0], message: "User created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get users by query
const getUserByQuery = async (req, res) => {
  try {
    const { name, email, sort, page = 1, limit = 10 } = req.query;
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const cacheKey = `users:query:${name}:${email}:${sort}:${parsedPage}:${parsedLimit}`;
    const cachedUsers = cache.get(cacheKey);
    if (cachedUsers) {
      return res.status(200).json({
        data: cachedUsers,
        message: "Users fetched successfully (from cache)",
      });
    }

    let query = supabase.from("user").select("*");

    if (email) query = query.eq("email", email);
    if (name) query = query.ilike("name", `%${name}%`);

    if (sort) {
      const sortBy = sort.split(",");
      sortBy.forEach((sortedField) => {
        const order = sortedField.startsWith("-") ? "desc" : "asc";
        const field = sortedField.replace("-", "");
        query = query.order(field, { ascending: order === "asc" });
      });
    }

    const offset = (parsedPage - 1) * parsedLimit;
    const { data, error } = await query.range(offset, offset + parsedLimit - 1);

    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    cache.set(cacheKey, data); // Cache the result

    return res.status(200).json({
      data,
      message: "Users fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Bad Request" });
  }
};

// Update an existing user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const hashedPassword = await hasPassword(password);

    const { data, error } = await supabase
      .from("user")
      .update({ name, email, password: hashedPassword, updatedAt: new Date() })
      .eq("id", id);

    if (error) {
      return res.status(500).json({ message: "Internal Server Error", error });
    }

    cache.flushAll(); // Clear cache after updating a user

    return res.status(204).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Bad Request" });
  }
};

// Delete an existing user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error: fetchError } = await supabase
      .from("user")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: fetchError });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { error: deleteError } = await supabase
      .from("user")
      .delete()
      .eq("id", id);

    if (deleteError) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: deleteError });
    }

    cache.flushAll(); // Clear cache after deleting a user

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};



module.exports = {
  getUsers,
  getUsersById,
  getUsersByCustomId,
  createUser,
  getUserByQuery,
  updateUser,
  deleteUser,
};
