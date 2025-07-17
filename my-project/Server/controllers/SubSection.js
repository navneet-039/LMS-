const Section = require("../models/Section");
const SubSection = require("../models/SubSection"); // ✅ capitalized as per naming convention
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


// Create a new SubSection
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;

    if (!sectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required while creating a subsection.",
      });
    }

    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    const subsectionDetails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    const updatedSection = await Section.findByIdAndUpdate(
      sectionId, // ✅ fixed: was `{ sectionId }`
      {
        $push: {
          subSection: subsectionDetails._id,
        },
      },
      { new: true }
    ).populate("subSection");

    return res.status(200).json({
      success: true,
      message: "Subsection created successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while creating a subsection.",
    });
  }
};

// Update SubSection
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body;

    const subSectionDoc = await SubSection.findById(subSectionId); // ✅ renamed to avoid shadowing
    if (!subSectionDoc) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found to update.",
      });
    }

    if (title !== undefined) {
      subSectionDoc.title = title;
    }

    if (description !== undefined) {
      subSectionDoc.description = description;
    }

    if (req.files && req.files.videoFile !== undefined) {
      const videoFile = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        videoFile, // ✅ fixed: was undefined `video`
        process.env.FOLDER_NAME
      );
      subSectionDoc.videoUrl = uploadDetails.secure_url;
      subSectionDoc.timeDuration = `${uploadDetails.duration}`; // ✅ matched to field used in creation
    }

    await subSectionDoc.save();

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.json({
      success: true,
      message: "Section updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section.",
    });
  }
};

// Delete SubSection
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    await Section.findByIdAndUpdate(sectionId, {
      $pull: {
        subSection: subSectionId,
      },
    });

    const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId); // ✅ avoid shadowing

    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found.",
      });
    }

    const updatedSection = await Section.findById(sectionId).populate("subSection");

    return res.json({
      success: true,
      message: "Subsection deleted successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the subsection.",
    });
  }
};
