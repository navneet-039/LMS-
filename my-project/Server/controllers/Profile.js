const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress"); // ✅ Required for deleteAccount

// update profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetail = await User.findById(id);
    if (!userDetail) {
      return res.status(404).json({
        success: false,
        message: "phle login karo delete karne se phle ..not found user",
      });
    }

    await Profile.findByIdAndDelete(userDetail.additionalDetails);

    for (const courseId of userDetail.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        {
          $pull: {
            studentsEnrolled: id,
          },
        },
        { new: true }
      );
    }

    await User.findByIdAndDelete(id);
    await CourseProgress.deleteMany({ userId: id });

    res.status(200).json({
      success: true,
      message: "user deleted successfully..",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while deleting the user",
    });
  }
};

// get user details
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetail = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User details fetched successfully..",
      userDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while fetching the userDetail",
    });
  }
};

// update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const id = req.user.id;

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const updatedprofile = await User.findByIdAndUpdate(
      { _id: id },
      { image: image.secure_url },
      { new: true }
    );

    res.send({
      success: true,
      message: "image updated successfully",
      data: updatedprofile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// instructor dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id });

    const courseData = courseDetails.map((course) => {
      const totalstudentEnrolled = course.studentsEnrolled.length;
      const totalAmountGenerated = totalstudentEnrolled * course.price;

      return {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        totalstudentEnrolled,
        totalAmountGenerated,
      };
    });

    res.status(200).json({ course: courseData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
