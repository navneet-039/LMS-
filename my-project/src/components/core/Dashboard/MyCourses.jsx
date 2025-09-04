import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchInstructorCourses } from "../../../Services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";
import CourseseTable from "./InstructorCourses/CourseseTable";

const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await fetchInstructorCourses(token);
      if (result) {
        setCourses(result);
      }
    };
    fetchCourses();
  }, [token]);

  return (
    <div className="text-white w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-xl font-semibold">My Courses</h1>
        <IconBtn
          text="Add Course"
          onClick={() => navigate("/dashboard/add-course")}
          customClasses="self-start sm:self-auto"
        />
      </div>

      {/* Courses Table */}
      {courses && <CourseseTable courses={courses} setCourses={setCourses} />}
    </div>
  );
};

export default MyCourses;
