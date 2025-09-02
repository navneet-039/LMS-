const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");


exports.createRating = async (req, res) => {
  try {
    const { rating, review, courseId } = req.body;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid courseId format",
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Validate review
    if (!review || review.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Review text is required",
      });
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    console.log("Incoming rating request:", { userId, courseId, rating, review });

    // Ensure student is enrolled
    const courseDetails = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId),
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: "Student not enrolled in this course",
      });
    }

    // Ensure not already reviewed
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: new mongoose.Types.ObjectId(courseId),
    });

    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "You have already reviewed this course.",
      });
    }

    // Create review
    const ratingReview = await RatingAndReview.create({
      rating: Number(rating),
      review: review.trim(),
      course: new mongoose.Types.ObjectId(courseId),
      user: userId,
    });

    // Push into course
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { ratingAndReview: ratingReview._id } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating and review created successfully",
      ratingReview,
    });
  } catch (error) {
    console.error("Error in createRating controller:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Error while creating rating and review",
    });
  }
};


// Get average rating
exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Average rating calculated successfully",
        averageRating: result[0].averageRating,
      });
    }

    return res.status(200).json({
      success: true,
      message: "No one has rated this course, Average rating is 0",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error while calculating average rating",
    });
  }
};

// Get all ratings and reviews
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName image email",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
