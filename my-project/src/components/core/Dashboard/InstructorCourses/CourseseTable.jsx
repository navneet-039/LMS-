import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Thead,Tr,Td,Th } from "react-super-responsive-table";
import { formattedDate } from "../../../../utils/dateFormatter";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { deleteCourse, fetchInstructorCourses } from "../../../../services/operations/courseDetailsAPI";
import { setCourse } from "../../../../slices/courseSlice";

const CourseseTable = ({ courses, setCourses }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const handleCourseDelete=async(courseId)=>{
    setLoading(true);
    await deleteCourse({courseId:courseId},token);
    const result=await fetchInstructorCourses(token);
    if(result){
     setCourses(result);
    }
setConfirmationModal(null);
setLoading(false);
  }

  return (
    <div className="text-white">
      <Table>
        <Thead>
          <Tr>
            <Th>Courses</Th>
            <Th>Duration</Th>
            <Th>Price</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td>No courses Found</Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr
                key={course._id}
                className="flex gap-x-10 border-richblack-800 p-8"
              >
                <Td className="flex gap-x-4">
                  <img
                    src={course?.thumbnail}
                    className="h-[150px] w-[220px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <p>{course.courseName}</p>
                    <p>{course.courseDescription}</p>
                    <p>Created :</p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="text-pink-50">Drafted</p>
                    ) : (
                      <p className="text-yellow-50">Published</p>
                    )}
                  </div>
                </Td>
                <Td>
                  2hr 30 min
                </Td>
                <Td>
                  ${course.price}
                </Td>
                <Td>
                  <button disabled={loading} >EDIT</button>
                  <button disabled={loading} onClick={()=>setConfirmationModal({
                    text1:"Do you want to delete this Course",
                    text2:" All the data related to this Course will be deleted",
                    btn1Text:"Delete",
                    btn2Text: "Cancel",
                    btn1Handler: !loading ?()=>handleCourseDelete(course._id):()=>{},
                    btn2Handler:!loading ?()=>setConfirmationModal(null):()=>{}
                  }
                    
                  )}>DELETE</button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal}/>}
    </div>
  );
};

export default CourseseTable;
