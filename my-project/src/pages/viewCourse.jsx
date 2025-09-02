// src/components/core/ViewCourse/VideoDetails.jsx
import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { markLectureAsComplete } from "../Services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../slices/viewCourseSlice"
import { AiFillPlayCircle } from "react-icons/ai";

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();

  const { token } = useSelector((state) => state.auth);
  const { courseSectionData } = useSelector((state) => state.viewCourse);

  const [ended, setEnded] = useState(false);

  // ✅ Find the current section and subsection
  const currentSection = courseSectionData.find(
    (section) => section._id === sectionId
  );
  const currentSubSection = currentSection?.subSection.find(
    (sub) => sub._id === subSectionId
  );

  // ✅ Extract video URL
  const videoUrl = currentSubSection?.videoUrl;

  // ✅ Mark as complete
  const handleLectureComplete = async () => {
    await markLectureAsComplete({ courseId, subSectionId }, token);
    dispatch(updateCompletedLectures(subSectionId));
  };

  // ✅ Next video navigation
  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSection.length;

    const subSectionIndex =
      courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
      );

    if (subSectionIndex < noOfSubSections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[subSectionIndex + 1]
          ._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else if (currentSectionIndex < courseSectionData.length - 1) {
      const nextSectionId = courseSectionData[currentSectionIndex + 1]._id;
      const nextSubsectionId =
        courseSectionData[currentSectionIndex + 1].subSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubsectionId}`
      );
    }
  };

  // ✅ Previous video navigation
  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );

    const subSectionIndex =
      courseSectionData[currentSectionIndex].subSection.findIndex(
        (data) => data._id === subSectionId
      );

    if (subSectionIndex > 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[subSectionIndex - 1]
          ._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else if (currentSectionIndex > 0) {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionId =
        courseSectionData[currentSectionIndex - 1].subSection.slice(-1)[0]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* ✅ Video Player */}
      {videoUrl ? (
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          controls
          width="100%"
          height="500px"
          onEnded={() => {
            setEnded(true);
            handleLectureComplete();
          }}
        />
      ) : (
        <p className="text-red-500">⚠️ No video available for this lecture.</p>
      )}

      {/* ✅ Control Buttons */}
      <div className="flex gap-4 mt-3">
        <button
          onClick={goToPrevVideo}
          className="px-4 py-2 rounded bg-gray-600 text-white"
        >
          Previous
        </button>

        {ended && (
          <button
            onClick={goToNextVideo}
            className="px-4 py-2 rounded bg-green-600 text-white flex items-center gap-2"
          >
            <AiFillPlayCircle /> Next
          </button>
        )}
      </div>
    </div>
  );
}
