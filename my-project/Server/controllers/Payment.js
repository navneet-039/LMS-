const mongoose = require("mongoose");
const crypto = require("crypto");
const User = require("../models/User");
const { instance } = require("../config/razorpay");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/template/courseEnrollmentEmail");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const { paymentSuccessEmail } = require("../mail/template/paymentSuccessEmail");

exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id;

    if (courses.length === 0) {
      return res.json({
        success: false,
        message: "Please provide Course id",
      });
    }

    let total_amount = 0;
    for (const course_id of courses) {
      try {
        const course = await Course.findById(course_id);
        if (!course) {
          return res.status(200).json({ success: false, message: "Could not find the course" });
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
        return res.status(500).json({ success: false, message: error.message });
      }
    }

    const options = {
      amount: total_amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    try {
      const paymentResponse = await instance.orders.create(options);
      res.json({
        success: true,
        data: paymentResponse,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Could not initiate order" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courses } = req.body;
    const userId = req.user.id;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
      return res.status(200).json({ success: false, message: "Payment failed" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
//Why crypto is used for verifying Razorpay signature

// Razorpay sends you back order_id, payment_id, and a signature.

// That signature is generated on Razorpay’s server using your secret key and an HMAC (hash-based message authentication code).

// On your backend, you must recompute the HMAC using the same algorithm (SHA256) and check if it matches.


    const expectedsignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedsignature === razorpay_signature) {
      await enrolledStudent(courses, userId, res);
      return res.status(200).json({
        success: true,
        message: "Payment successful and students enrolled",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid signature, payment verification failed",
      });
    }
  } catch (error) {
    return res.status(200).json({ success: false, message: "Payment failed" });
  }
};

const enrolledStudent = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide data for courses or UserId",
    });
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({ success: false, message: "Course not found" });
      }

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );

      // **Create initial course progress if not exists**
      const existingProgress = await CourseProgress.findOne({ courseID: courseId, userId });
      if (!existingProgress) {
        await CourseProgress.create({
          courseID: courseId,
          userId,
          completedVideos: [],
        });
      }

      await mailSender(
        enrolledStudent.email,
        `Successfully enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(enrolledCourse.courseName, enrolledStudent.firstName)
      );

    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  return res.status(200).json({ success: true, message: "Enrolled successfully" });
};


// send payment success email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
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
    return res.status(400).json({ success: false, message: "Could not send email" });
  }
};

