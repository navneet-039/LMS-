const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto"); // ✅ Required for crypto.randomUUID()

// reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // check user for email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({  // ✅ Added status code
        success: false,
        message: "Your email is not registered with us.",
      });
    }

    // generate token
    const token = crypto.randomUUID();

    // update user with token and expiry
    const updatedDetails = await User.findOneAndUpdate(
      { email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    // create reset URL
    const url = `http://localhost:3000/update-password/${token}`;

    // send email with reset URL
    await mailSender(email, "Password Reset Link", `Password reset link: ${url}`);

    return res.json({
      success: true,
      message: "Email sent successfully. Please check your inbox to reset your password.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while sending reset password email.",
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // find user by token
    const userDetails = await User.findOne({ token });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // check if token expired
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired. Please request a new one.",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password and remove token fields
    await User.findOneAndUpdate(
      { token },
      {
        password: hashedPassword,
        token: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while resetting password.",
    });
  }
};
