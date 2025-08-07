import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getFullDetailsOfCourse } from "../../../../services/operations/courseDetailsAPI";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { useEffect } from "react";
import RenderSteps from "../AddCourse/RenderSteps";
const EditCourse = () => {
  const dispatch = useDispatch();
  const { courseId } = useParams();
  const { course } = useSelector((state) => state.course);

  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
 useEffect(() => {
  const populateCourseDetails = async () => {
    setLoading(true); // ✅ set to true before fetch
    const result = await getFullDetailsOfCourse(courseId, token);
    console.log("herrrr",result);
    if (result?.courseDetails) {
      dispatch(setEditCourse(true));
      dispatch(setCourse(result.courseDetails));
    }
    setLoading(false); // ✅ move after fetch and dispatch
  };
  populateCourseDetails();
}, []);


  if(loading){
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div>
      <h1>Edit course</h1>
      <div>{course ? <RenderSteps /> : <p>Course Not Found</p>}</div>
    </div>
  );
};

export default EditCourse;
