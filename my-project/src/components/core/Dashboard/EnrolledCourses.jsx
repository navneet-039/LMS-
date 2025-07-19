import React, { useState,useEffect} from "react";
import { useSelector } from "react-redux";
import { getUserEnrolledCourses } from "../../../Services/operations/profileAPI";
export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);

  const getEnrolledCourses = async () => {
    try {
      const response = await getUserEnrolledCourses(token);
      setEnrolledCourses(response);
    } catch (error) {
      console.log("unable to fetch Enrolled courses");
    }
  };

  useEffect(() => {
    getEnrolledCourses();
  }, []);

  return (
    <div className="text-richblack-200">
      <div>Enrolled Courses</div>
      {!enrolledCourses ? (
        <div>Loading....</div>
      ) : !enrolledCourses.length ? (
        <p>You are not enrolled in any courses yet</p>
      ) : (
        <div>
          <div>
            <p>Course Name</p>
            <p>Durations</p>
            <p>Progress</p>
          </div>
          {/* {cards} */}
          {enrolledCourses.map((course, index) => (
            <div>
              <div>
                <img src={course.thumbnail} />
                <div>
                  <p>{course.courseName}</p>
                  <p>{course.courseDescription}</p>
                </div>
              </div>
              <div>{course?.totalDuration}</div>
              <div>
                <p>Progress :{course.progressPercentage || 0}</p>
                <ProgressBar completed={course.progressPercentage || 0}
                height={"8px"}
                isLabelVisible={false}
                />
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
