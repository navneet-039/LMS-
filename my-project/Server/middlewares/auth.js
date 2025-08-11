const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);
    const token =
      req.cookies.token ||
      req.body.token ||
      req.headers["authorization"]?.replace("Bearer ", "") ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decode);
      req.user = decode;
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// isStudent middleware
// auth.js

exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Students only",
      });
    }
    next(); // ✅ Move forward if valid
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Instructors only",
      });
    }
    next(); // ✅
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for Admin only",
      });
    }
    next(); // ✅
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
