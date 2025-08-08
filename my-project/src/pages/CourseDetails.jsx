import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from "../components/common/Footer";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar.jsx";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard.jsx";
import { fetchCourseDetails } from "../Services/operations/courseDetailsAPI";
import { buyCourse } from "../Services/operations/StudentsFeatureApi";
import GetAvgRating from "../utils/avgRatings";
import Error from "./Error";

export default function CourseDetails() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);

  const [courseData, setCourseData] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isActive, setIsActive] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCourseDetails(courseId);
        setCourseData(data);
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

    // Call buyCourse function directly (not dispatching)
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
      <div className="text-white text-center p-10">Loading course details...</div>
    );
  }

  if (!courseData.success) {
    return <Error />;
  }

  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = courseData.data;

  const avgRating = GetAvgRating(ratingAndReviews || []);

  return (
    <>
      <div className="w-full bg-richblack-900 text-white">
        <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{courseName}</h1>
            <p className="text-richblack-300 mb-6">{courseDescription}</p>
            <p className="text-sm text-richblack-200 mb-2">
              Created by{" "}
              <span className="text-yellow-50">
                {instructor?.firstName} {instructor?.lastName}
              </span>
            </p>
            <p className="text-sm text-richblack-200 mb-4">
              Category:{" "}
              <span className="text-yellow-50">
                {courseData.data?.category?.name}
              </span>
            </p>
            <p className="text-yellow-50 font-semibold mb-6">
              Avg Rating: {avgRating}/5 ({ratingAndReviews?.length || 0} reviews)
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
              handleBuyCourse={handleBuyCourse}  // pass handler down
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
