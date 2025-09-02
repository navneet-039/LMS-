const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// ----------------- AUTH MIDDLEWARE -----------------
exports.auth = async (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    // safely extract token from multiple sources
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.body?.token) {
      token = req.body.token;
    } else if (req.headers?.authorization) {
      // "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decode);
      req.user = decode; // attach decoded user info
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// ----------------- ROLE CHECK MIDDLEWARES -----------------

// Only Student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// Only Instructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Instructors only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// Only Admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admins only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
