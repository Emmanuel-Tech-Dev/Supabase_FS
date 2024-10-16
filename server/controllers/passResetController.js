const supabase = require("../supbase_config/config.js");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { hasPassword } = require("../services/hasPassWord.js");
const sendResetLink = require("../services/sendEmailLink.js");
const {
  generateToken,
  generateRefreshToken,
} = require("../services/jwtToken.js");

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    console.log(email);

    const { data: user, error } = await supabase
      .from("user")
      .select("id, email")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token and expiry in the user's record
    await supabase
      .from("user")
      .update({ reset_token: resetToken, token_expiry: tokenExpiry })
      .eq("email", email);

    
    const html = utils.passwordResetTemplate( resetToken);
   
          
    const subject = "Password Reset";

    // Send reset email
    await sendResetLink(email, resetToken, html, subject);

    return res
      .status(200)
      .json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { token } = req.params;

    console.log("Received token:", token);

    // Find user by reset token and ensure token hasn't expired
    const { data: user, error } = await supabase
      .from("user")
      .select("*")
      .ilike("reset_token", token)
      .single();

    console.log("Supabase query result:", { user, error });

    if (!user) {
      console.log("No user found with the provided token");
      return res.status(400).json({ message: "Invalid reset token" });
    }

    if (error) {
      console.error("Supabase error:", error);
      return res
        .status(400)
        .json({ message: "Error querying database", error: error.message });
    }

    console.log("User found:", user);

    // Check if token is expired
    if (new Date(user.token_expiry) < new Date()) {
      console.log("Token expired. Expiry:", user.token_expiry);
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Hash the new password
    const hashedPassword = await hasPassword(newPassword);

    // Update the user's password and clear the reset token and expiry
    const { data: updateResult, error: updateError } = await supabase
      .from("user")
      .update({
        password: hashedPassword,
        reset_token: null,
        token_expiry: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating user:", updateError);
      return res.status(500).json({
        message: "Error updating password",
        error: updateError.message,
      });
    }

    console.log("Password updated successfully");
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res
      .status(500)
      .json({ message: `"Internal Server Error : ${erorr.message}"` });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
