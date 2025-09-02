import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { markLectureAsComplete } from "../../../Services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { AiFillPlayCircle } from "react-icons/ai";
import IconBtn from "../../common/IconBtn";

export const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const playerRef = useRef();
  const { token } = useSelector((state) => state.auth);
  const location = useLocation();

  const {
    courseSectionData,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  const [videoData, setVideoData] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setVideoSpecificDetails = async () => {
      if (!courseSectionData.length) return;

      if (!courseId || !sectionId || !subSectionId) {
        navigate("/dashboard/enrolled-courses");
        return;
      }

      const filteredData = courseSectionData.find(
        (course) => course._id === sectionId
      );

      const filterVideoData = filteredData?.subSection?.find(
        (data) => data._id === subSectionId
      );

      setVideoData(filterVideoData || null);
      setVideoEnded(false);
    };

    setVideoSpecificDetails();
  }, [courseSectionData, courseId, sectionId, subSectionId, navigate, location.pathname]);

  const isFirstVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const subSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
      (data) => data._id === subSectionId
    );

    return currentSectionIndex === 0 && subSectionIndex === 0;
  };

  const isLastVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubSections =
      courseSectionData[currentSectionIndex]?.subSection.length;
    const subSectionIndex = courseSectionData[currentSectionIndex]?.subSection.findIndex(
      (data) => data._id === subSectionId
    );

    return (
      currentSectionIndex === courseSectionData.length - 1 &&
      subSectionIndex === noOfSubSections - 1
    );
  };

  const goToNextVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const noOfSubSections =
      courseSectionData[currentSectionIndex].subSection.length;
    const subSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    );

    if (subSectionIndex < noOfSubSections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndex].subSection[subSectionIndex + 1]._id;
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

  const goToPrevVideo = () => {
    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const subSectionIndex = courseSectionData[currentSectionIndex].subSection.findIndex(
      (data) => data._id === subSectionId
    );

    if (subSectionIndex > 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndex].subSection[subSectionIndex - 1]._id;
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      );
    } else if (currentSectionIndex > 0) {
      const prevSectionId = courseSectionData[currentSectionIndex - 1]._id;
      const prevSubSectionLength =
        courseSectionData[currentSectionIndex - 1].subSection.length;
      const prevSubsectionId =
        courseSectionData[currentSectionIndex - 1].subSection[prevSubSectionLength - 1]._id;
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubsectionId}`
      );
    }
  };

  const handleLectureCompletion = async () => {
    setLoading(true);
    const res = await markLectureAsComplete(
      { courseId: courseId, subSectionId: subSectionId },
      token
    );
    if (res) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  return (
    <div>
      {!videoData ? (
        <div>No data found</div>
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <AiFillPlayCircle />
          {videoEnded && (
            <div>
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onClick={handleLectureCompletion}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                />
              )}
              <IconBtn
                disabled={loading}
                onClick={() => {
                  if (playerRef?.current) {
                    playerRef.current.seek(0);
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
              />
              <div>
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}
      <p>{videoData?.title}</p>
      <p>{videoData?.description}</p>
    </div>
  );
};
