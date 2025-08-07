import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../Services/operations/StudentsFeatureApi";
import { fetchCourseDetails } from "../Services/operations/courseDetailsAPI";
import GetAvgRating from "../utils/avgRatings";
import Error from "./Error";
import ConfirmationModal from "../components/common/ConfirmationModal";
import RatingStars from "../components/common/RatingStars";
import { formattedDate } from "../utils/dateFormatter";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [confirmationModal, setConfirmationModal] = useState(null);

  const [courseData, setCourseData] = useState(null);
  useEffect(() => {
    const getCourseFullDetails = async () => {
      try {
        const result = await fetchCourseDetails(courseId);
        setCourseData(result);
      } catch (error) {
        console.log("Could not fetch Course Data");
      }
    };
    getCourseFullDetails();
  }, [courseId]);

  const [avgReviewCount, setAvgReviewCount] = useState(0);
  useEffect(() => {
    const count = GetAvgRating(courseData?.data?.ratingAndReview);
    setAvgReviewCount(count);
  }, [courseData]);

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  useEffect(() => {
    let lectures = 0;
    courseData?.data?.courseContent?.forEach((section) => {
      lectures += section?.subSection?.length || 0;
    });
    setTotalNoOfLectures(lectures);
  }, [courseData]);

  const [isActive, setIsActive] = useState(Array[0]);
  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat(id)
        : isActive.filter((e) => e != id)
    );
  };

  const handleBuyCourse = async () => {
    if (token) {
      await buyCourse({
        token,
        courses: [courseId],
        userDetails: user,
        navigate,
        dispatch,
      });
    } else {
      setConfirmationModal({
        text1: "You are not logged in",
        text2: "please log in to purchase the course",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };

  if (loading || !courseData) {
    return <div>Loading....</div>;
  }
  if (!courseData?.data) {
    return (
      <div>
        <Error />
      </div>
    );
  }

  const {
    _id: cours_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReview,
    instructor,
    studentsEnrolled,
    createdAt,
    totalDuration,
  } = courseData.data;

  return (
    <div className="flex flex-col  text-white">
      <div className="relative flex flex-col justify-start p-8">
        <p>{courseName}</p>
        <p>{courseDescription}</p>
        <div className="flex gap-x-2">
          <span>{avgReviewCount}</span>
          <RatingStars Review_Count={avgReviewCount} />
          <span>({`${ratingAndReview.length} reviews`})</span>
          <span>({`${studentsEnrolled.length} students enrolled`})</span>
        </div>
        <div>
          <p>Created By :{`${instructor.firstName}`}</p>
        </div>
        <div className="flex gap-x-3 ">
          <p>Created At :{formattedDate(createdAt)}</p>
          <p>{""} English</p>
        </div>
        <div>
          <CourseDetailsCard
            course={courseData}
            setConfirmationModal={setConfirmationModal}
            handleBuyCourse={handleBuyCourse}
          />
        </div>
      </div>

      <div>
        <p>What You Will Learn</p>
        <div>{whatYouWillLearn}</div>
      </div>
      <div>
        <div>
          <p>Course Content</p>
        </div>
        <div className="flex gap-x-3  justify-between">
          <div>
            <span>{courseContent.length}section(s)</span>
            <span> {totalNoOfLectures} lectures</span>
            <span>{totalDuration} total length</span>
          </div>
          <div>
            <button onClick={()=>setIsActive([])}>Collapse all sections</button>
          </div>
        </div>
      </div>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseDetails;
