import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import { markLectureAsComplete } from "../../../Services/operations/courseDetailsAPI";
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import IconBtn from "../../common/IconBtn";

const VideoDetails = ({ isSidebarOpen = false }) => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!courseSectionData.length) return;

    if (!courseId && !sectionId && !subSectionId) {
      navigate(`/dashboard/enrolled-courses`);
    } else {
      const filteredSection = courseSectionData.find(
        (sec) => sec._id === sectionId
      );
      const filteredVideo = filteredSection?.subSection.find(
        (sub) => sub._id === subSectionId
      );

      if (filteredVideo) setVideoData(filteredVideo);
      else setVideoData(null);

      setPreviewSource(courseEntireData.thumbnail);
      setVideoEnded(false);
    }
  }, [courseSectionData, courseEntireData, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    );
    const currentSubSectionIndx =
      courseSectionData[currentSectionIndx].subSection.findIndex(
        (sub) => sub._id === subSectionId
      );
    return currentSectionIndx === 0 && currentSubSectionIndx === 0;
  };

  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    );
    const currentSubSectionIndx =
      courseSectionData[currentSectionIndx].subSection.findIndex(
        (sub) => sub._id === subSectionId
      );
    return (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx ===
        courseSectionData[currentSectionIndx].subSection.length - 1
    );
  };

  const goToNextVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    );
    const currentSubSectionIndx =
      courseSectionData[currentSectionIndx].subSection.findIndex(
        (sub) => sub._id === subSectionId
      );

    if (
      currentSubSectionIndx <
      courseSectionData[currentSectionIndx].subSection.length - 1
    ) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      );
    } else if (currentSectionIndx < courseSectionData.length - 1) {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id;
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id;
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      );
    }
  };

  const goToPrevVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (sec) => sec._id === sectionId
    );
    const currentSubSectionIndx =
      courseSectionData[currentSectionIndx].subSection.findIndex(
        (sub) => sub._id === subSectionId
      );

    if (currentSubSectionIndx > 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else if (currentSectionIndx > 0) {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id;
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection.slice(-1)[0]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    try {
      const res = await markLectureAsComplete(
        { courseId, subsectionId: subSectionId },
        token
      );
      if (res) dispatch(updateCompletedLectures(subSectionId));
    } catch (err) {
      console.error("Error marking lecture as complete:", err);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-5 text-white px-2 md:px-6">
      {/* Video / Thumbnail */}
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="w-full h-auto max-h-[400px] rounded-md object-cover"
        />
      ) : (
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <video
            ref={playerRef}
            src={videoData.videoUrl}
            controls
            className="w-full h-full object-contain"
            onEnded={() => setVideoEnded(true)}
          />

          {videoEnded && (
            <div
              className={`absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 text-center transition-all duration-300 ${
                isSidebarOpen ? "opacity-30 pointer-events-none" : "opacity-100"
              }`}
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1))",
              }}
            >
              {/* Center buttons */}
              <div className="flex flex-col items-center gap-3">
                {!completedLectures.includes(subSectionId) && (
                  <IconBtn
                    onClick={handleLectureCompletion}
                    disabled={loading}
                    text={!loading ? "Mark As Completed" : "Loading..."}
                    customClasses="text-base md:text-lg max-w-max px-4"
                  />
                )}

                <IconBtn
                  onClick={() => {
                    if (playerRef.current) {
                      playerRef.current.currentTime = 0;
                      playerRef.current
                        .play()
                        .catch(() => console.log("Autoplay blocked"));
                      setVideoEnded(false);
                    }
                  }}
                  disabled={loading}
                  text="Rewatch"
                  customClasses="text-base md:text-lg max-w-max px-4"
                />
              </div>

              {/* Navigation Buttons */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="flex items-center gap-2 rounded-md bg-richblack-700 px-4 py-2 text-sm md:text-base hover:bg-richblack-600"
                  >
                    <FaArrowLeft /> Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="flex items-center gap-2 rounded-md bg-richblack-700 px-4 py-2 text-sm md:text-base hover:bg-richblack-600 ml-auto"
                  >
                    Next <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Title + Description */}
      <h1 className="mt-2 text-xl md:text-2xl font-semibold break-words">
        {videoData?.title}
      </h1>
      <p className="pt-2 pb-6 text-sm md:text-base leading-relaxed break-words">
        {videoData?.description}
      </p>
    </div>
  );
};

export default VideoDetails;
