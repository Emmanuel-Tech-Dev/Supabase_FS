const supabase = require("../supbase_config/config.js");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { hasPassword } = require("../services/hasPassWord.js");
const sendResetLink = require("../services/sendEmailLink.js");
const {
  generateToken,
  generateRefreshToken,
} = require("../services/jwtToken.js");
const utils = require("../utils/utils.js");

const requestOtp = async (req, res) => {
  try {
    const { email, name } = req.body;

    const { data: existingUser, erorr: userCheckError } = await supabase
      .from("user")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      const otp = crypto.randomInt(100000, 999999);

      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 25);

      const { error: updateError } = await supabase
        .from("user")
        .update({ otp, otp_expiration: otpExpiration })
        .eq("email", email);

      if (updateError) {
        return res
          .status(422)
          .json({ message: `"Error generating OTP : ${updateError.message}"` });
      }

      const html = utils.otpTemplate(otp);

      const subject = "OTP Request";

      await sendResetLink(email, otp, html, subject);
      return res.status(200).json({ message: "OTP sent to registered email" });
    } else {
      if (!name) {
        return res
          .status(400)
          .json({ message: "Name is required for new users" });
      }

      const otp = crypto.randomInt(100000, 999999);
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 25);

      // Insert the new user into the database with email and name
      const { error: insertError } = await supabase
        .from("user")
        .insert([{ email, name, otp: otp, otp_expiration: otpExpiration }]);

      if (insertError) {
        return res.status(500).json({ message: "Error registering new user" });
      }

      const html = utils.otpTemplate(otp);
      const subject = "OTP Request";
      // Send OTP via email
      await sendResetLink(email, otp, html, subject);

      return res.status(200).json({
        message: "OTP sent to your email. You are registered as a new user.",
      });
    }
  } catch (erorr) {
    console
      .log(erorr.message)
      .json({ message: `"Internal Server Error : ${erorr.message}"` });
  }
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  try {
    // Fetch user by email and OTP
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("*")

      .eq("otp", otp)
      .single();

    if (!user) {
      return res.status(401).json({ message: "Invalid OTP or user not found" });
    }

    // Check if the OTP is still valid
    const currentTime = new Date();
    if (currentTime > new Date(user.otp_expiration)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Clear the OTP after successful verification (to prevent reuse)
    await supabase
      .from("user")
      .update({ otp: null, otp_expiration: null })
      .eq("email", user?.email);

    // Generate accessToken and refreshToken
    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Set tokens in cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  requestOtp,
  verifyOtp,
};
