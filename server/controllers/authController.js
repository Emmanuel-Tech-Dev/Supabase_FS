const { hasPassword, comparePassword } = require("../services/hasPassWord");
const { generateToken, generateRefreshToken } = require("../services/jwtToken");
const supabase = require("../supbase_config/config.js");
const jwt = require("jsonwebtoken");


// Helper function for error response
const handleErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

// Helper function for fetching a user by email
const getUserByEmail = async (email) => {
  return await supabase.from("user").select("*").eq("email", email).single();
};

// Register User Controller
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user exists
    const { data: existingUser, error: findUserError } = await supabase
      .from("user")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (findUserError) {
      return handleErrorResponse(res, 500, "Error checking user existence");
    }

    if (existingUser) {
      return handleErrorResponse(res, 400, "User already exists");
    }

    // Hash the password and insert the new user
    const hashedPassword = await hasPassword(password);
    const { data: newUser, error: insertUserError } = await supabase
      .from("user")
      .insert({ name, email, password: hashedPassword })
      .select('*')
      .single()

    if (insertUserError) {
      return handleErrorResponse(res, 500, "Error creating user");
    }

    // Success response
    return res
      .status(201)
      .json({ data: newUser, message: "User created successfully" });
  } catch (error) {
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Login User Controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user by email
    const { data: user, error: userError } = await getUserByEmail(email);

    if (userError) {
      console.error("Error fetching user:", userError.message);
      return handleErrorResponse(res, 500, "Error fetching user");
    }

    if (!user) {
      return handleErrorResponse(res, 404, "User not found");
    }

    // Compare provided password with the stored hashed password
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) {
      return handleErrorResponse(res, 401, "Invalid password");
    }

    // Generate JWT token if password matches
    const accesstoken = generateToken(user);
    const refreshtoken = generateRefreshToken(user)

    res.cookie("accessToken", accesstoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, 
      path : '/'// 15 minutes
    });
    
    res.cookie("refreshToken", refreshtoken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/", // 7 days
    });
    return res
      .status(200)
      .json({ accesstoken, message: "User logged in successfully" });
  } catch (error) {
    console.error("Login error:", error.message);
    return handleErrorResponse(res, 500, "Internal Server Error");
  }
};

// Refresh Token Controller
const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
 

  if (!token) {
    return handleErrorResponse(res, 401, "Unauthorized: No refresh token provided");
  }

  // Verify refreshToken
  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return handleErrorResponse(res, 403, "Forbidden: Invalid refresh token");
    }

    // Generate a new accessToken
    const accessToken = jwt.sign(
      { email: user.email ,name : user.name  , id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Send new accessToken in an HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
      path: "/", // 15 minutes
    });

    // Send the response
    res.status(200).json({ message: "Access token refreshed successfully" });
  });
};


const logOut = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "User logged out successfully" });
};


const changePassword = async (req, res) => {
   try{
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const accessToken = req.cookies.accessToken;
  if(!accessToken) return res.status(401).json({ message: "Unauthorized" });

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
  const userID = decoded.id

  const { data: user, error: userError } = await supabase
    .from("user")
    .select("*")
    .eq("id", userID)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError.message);
    return res.status(500).json({ message: userError.message });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const passwordMatch = await comparePassword(oldPassword, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const hashedPassword = await hasPassword(newPassword);
  const { data: updatedUser, error: updateError } = await supabase
    .from("user")
    .update({ password: hashedPassword })
    .eq("id", userID)
    .single();

  if (updateError) {  
    console.error("Error updating user:", updateError.message);
    return res.status(500).json({ message: updateError.message });
  }

  return res.status(200).json({ message: "Password updated successfully" });

} catch(error){
  console.log(error);
  return res.status(500).json({ message: "Internal Server Error" });
}
}
module.exports = { registerUser, loginUser, refreshToken  , logOut , changePassword};
