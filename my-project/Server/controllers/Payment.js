const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/User");
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/template/courseEnrollmentEmail");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { paymentSuccessEmail } = require("../mail/template/paymentSuccessEmail");

exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id;
    if (courses.length === 0) {
      return res.json({
        success: "false",
        message: "please provide Course id",
      });
    }
    let total_amount = 0;
    for (const course_id of courses) {
      let course;
      try {
        course = await Course.findById(course_id);
        if (!course) {
          return res
            .status(200)
            .json({ success: "false", message: "Could not find the course" });
        }
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
          return res.json({
            success: false,
            message: "Student is already enrolled",
          });
        }
        total_amount += course.price;
      } catch (error) {
        console.log(error);
        return res
          .status(500)
          .json({ success: "false", message: error.message });
      }
    }
    let currency="INR";
    const options = {
      amount: total_amount * 100,
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
    };
    try {
      const paymentResponse = await instance.orders.create(options);
      res.json({
        success: true,
        data: paymentResponse,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: "false", message: "Could not initiate order" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: "false", message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return res
        .status(200)
        .json({ success: "false", message: "Payment failed" });
    }
    crypto.createHmac("sha256", secret)

// crypto: This is Node.js's built-in module for cryptography. It provides methods to create hashes, HMACs, ciphers, etc.
// createHmac(algorithm, key): This creates an HMAC object using:
// algorithm: "sha256" in your case.
// key: A secret key used for HMAC.
// HMAC: Stands for Hash-based Message Authentication Code.
// It’s a type of message authentication code that uses a cryptographic hash function (like SHA-256) plus a secret key.


// .update(data) adds the data that you want to hash.

// body.toString() converts the body (could be a buffer or object) into a string so it can be hashed.


// .digest() finalizes the HMAC computation and returns the result.
// "hex" specifies the output format:
// Hexadecimal string (common for signatures and checksums)
// Other options: 'base64', 'latin1', etc.

// SHA-256 is part of the SHA-2 (Secure Hash Algorithm 2) family.
// It is a cryptographic hash function, which:
// Takes an input of any size.
// Produces a fixed 256-bit (32-byte) output called the hash.

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedsignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");
    if (expectedsignature === razorpay_signature) {
      //enroll them
      await enrolledStudent(courses, userId, res);

      return res.status(200).json({
        success: true,
        message: "Payment successfull and students enrolled",
      });
    }
  } catch (error) {
    return res
      .status(200)
      .json({ success: false, message: "payment failed" });
  }
};

const enrolledStudent = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: "false",
      message: "Please provide data for courses or Userid",
    });
  }
  for (const courseId of courses) {
    try {
      //find the course and enroll student
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: "false", message: "course not found" });
      }
      //find the student and add the course
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );
      //send mail

      const emailResponse = await mailSender(
        enrolledStudent.email,
        `successfully enrolled into ${enrolledCourse.courseName} `,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          enrolledStudent.firstName
        )
      );
      console.log("Email sent successfully", emailResponse);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, message: error.message });
    }
  }
};





// send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};


