import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from "../components/common/Footer";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar.jsx";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { fetchCourseDetails } from "../Services/operations/courseDetailsAPI.jsx";
import { buyCourse } from "../Services/operations/StudentsFeatureApi";
import GetAvgRating from "../utils/avgRatings.js";
import Error from "./Error.jsx";
import RatingStars from "../components/common/RatingStars.jsx";

import {
  FaUserGraduate,
  FaCalendarAlt,
  FaListUl,
  FaVideo,
} from "react-icons/fa";

export default function CourseDetails() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);

  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isActive, setIsActive] = useState([]);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        setCourseData(data);
        console.log(data);
        if (data?.data?.courseContent) {
          let lectures = 0;
          data.data.courseContent.forEach((sec) => {
            lectures += sec.subSection?.length || 0;
          });
          setTotalNoOfLectures(lectures);
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
      }
    })();
  }, [courseId]);

  const handleBuyCourse = () => {
    if (!token) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to purchase this course.",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
      return;
    }

    buyCourse({
      token,
      courses: [courseId],
      userDetails: user,
      navigate,
      dispatch,
    });
  };

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? [...isActive, id]
        : isActive.filter((activeId) => activeId !== id)
    );
  };

  if (!courseData) {
    return (
      <div className="text-white text-center p-10">
        Loading course details...
      </div>
    );
  }

  if (!courseData.success) {
    return <Error />;
  }

  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    courseContent,
    ratingAndReview,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData.data;

  const avgRating = GetAvgRating(ratingAndReview || []);

  return (
    <>
      <div className="w-full bg-richblack-900 text-white">
        <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{courseName}</h1>
            <p className="text-richblack-300 mb-6">{courseDescription}</p>

            {/* Stars + Reviews + Students + Created By + Created At */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex items-center gap-4">
                <RatingStars Review_Count={avgRating} Star_Size={22} />
                <span className="text-yellow-50 font-medium">
                  {avgRating}/5 ({ratingAndReview?.length || 0} reviews)
                </span>
                <span className="flex items-center gap-1 text-sm text-richblack-200">
                  <FaUserGraduate /> {studentsEnrolled?.length || 0} Students
                  Enrolled
                </span>
              </div>

              <p className="text-sm text-richblack-200">
                Created by{" "}
                {instructor ? (
                  <span>
                    {instructor.firstName} {instructor.lastName}
                  </span>
                ) : (
                  <span className="italic text-red-400">Deleted User</span>
                )}
              </p>

              <p className="flex items-center gap-2 text-sm text-richblack-200">
                <FaCalendarAlt /> Created At:{" "}
                {new Date(createdAt).toDateString()}
              </p>
            </div>

            <p className="text-sm text-richblack-200 mb-4">
              Category:{" "}
              <span className="text-yellow-50">
                {courseData.data?.category?.name}
              </span>
            </p>

            {/* What you'll learn */}
            <div className="mb-8 border border-richblack-600 p-6 rounded">
              <h2 className="text-2xl font-semibold mb-4">What you'll learn</h2>
              <div className="prose max-w-none text-richblack-100">
                <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
              </div>
            </div>

            {/* Course Content Accordion */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>

              {/* Sections + Lectures */}
              <div className="mt-6 text-sm text-richblack-200 flex items-center gap-x-6">
                <p className="flex items-center gap-2">
                  <FaListUl /> {courseContent?.length || 0} Sections
                </p>
                <p className="flex items-center gap-2">
                  <FaVideo /> {totalNoOfLectures} Lectures
                </p>
              </div>

              {/* Accordion Bars */}
              {courseContent?.map((section) => (
                <CourseAccordionBar
                  key={section._id}
                  course={section}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div>
            <CourseDetailsCard
              course={courseData}
              handleBuyCourse={handleBuyCourse}
              setConfirmationModal={setConfirmationModal}
            />
          </div>
        </div>
      </div>

      <Footer />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}
