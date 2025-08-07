import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { buyCourse } from "../Services/operations/StudentsFeatureApi";

const CourseDetails = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const handleBuyCourse = async () => {
    if (token) {
      await buyCourse({
        token,
        courses: [courseId],
        userDetails: user,
        navigate,
        dispatch,
      });
    }
  };

  return (
    <div className="flex items-center">
      <button className="bg-yellow-50 p-6 mt-10" onClick={handleBuyCourse}>
        Buy Now
      </button>
    </div>
  );
};

export default CourseDetails;
