import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Table, Tbody, Thead, Tr, Td, Th } from "react-super-responsive-table";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";

import {
  FaEdit,
  FaTrash,
  FaClock,
  FaCheckCircle,
  FaRegClock,
} from "react-icons/fa";

import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

const CourseseTable = ({ courses, setCourses }) => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div className="text-white w-full mt-5">
      <Table className="w-full border border-richblack-800 rounded-lg overflow-hidden table-fixed">
        {/* HEADER */}
        <Thead>
          <Tr className="bg-richblack-800 text-richblack-25">
            <Th className="w-[50%] p-4 text-left">Courses</Th>
            <Th className="w-[15%] p-4 text-center">Duration</Th>
            <Th className="w-[15%] p-4 text-center">Price</Th>
            <Th className="w-[20%] p-4 text-center">Actions</Th>
          </Tr>
        </Thead>

        {/* BODY */}
        <Tbody>
          {courses.length === 0 ? (
            <Tr>
              <Td className="p-6 text-center" colSpan={4}>
                No courses Found
              </Td>
            </Tr>
          ) : (
            courses.map((course) => (
              <Tr key={course._id} className="border-b border-richblack-700">
                {/* Course Column */}
                <Td className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={course?.thumbnail}
                      className="h-[100px] w-[160px] rounded-lg object-cover border border-richblack-700 flex-shrink-0"
                      alt="Course Thumbnail"
                    />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">
                        {course.courseName}
                      </p>
                      <p className="text-sm text-richblack-200 line-clamp-2">
                        {course.courseDescription}
                      </p>
                      <p className="mt-1 text-xs text-richblack-400 flex items-center gap-2">
                        <FaClock /> Created:{" "}
                        {new Date(course.createdAt).toLocaleDateString()}
                      </p>

                      {/* Status */}
                      {course.status === COURSE_STATUS.DRAFT ? (
                        <span className="mt-2 flex items-center gap-2 text-pink-400 font-medium">
                          <FaRegClock className="text-pink-400" /> Drafted
                        </span>
                      ) : (
                        <span className="mt-2 flex items-center gap-2 text-yellow-400 font-medium">
                          <FaCheckCircle className="text-yellow-400" /> Published
                        </span>
                      )}
                    </div>
                  </div>
                </Td>

                {/* Duration */}
                <Td className="p-4 text-center text-richblack-200">
                  2hr 30 min
                </Td>

                {/* Price */}
                <Td className="p-4 text-center font-semibold text-richblack-25">
                    ₹{course.price}
                </Td>

                {/* Actions */}
                <Td className="p-4 text-center">
                  <div className="flex justify-center gap-3">
                    {/* EDIT BUTTON */}
                    <button
                      className="flex items-center gap-2 rounded-md bg-yellow-500 px-3 py-1 text-black hover:bg-yellow-400 transition"
                      disabled={loading}
                      onClick={() =>
                        navigate(`/dashboard/edit-course/${course._id}`)
                      }
                    >
                      <FaEdit /> Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      className="flex items-center gap-2 rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-500 transition"
                      disabled={loading}
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Do you want to delete this Course?",
                          text2:
                            "All the data related to this course will be permanently deleted.",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: !loading
                            ? () => handleCourseDelete(course._id)
                            : () => {},
                          btn2Handler: !loading
                            ? () => setConfirmationModal(null)
                            : () => {},
                        })
                      }
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>

      {/* Confirmation Modal */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseseTable;
