import { useEffect, useState } from "react"
import { BsChevronDown } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { FiMenu } from "react-icons/fi"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"

import IconBtn from "../../common/IconBtn"

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("")
  const [videoBarActive, setVideoBarActive] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { sectionId, subSectionId } = useParams()
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    ;(() => {
      if (!courseSectionData.length) return
      const currentSectionIndx = courseSectionData.findIndex(
        (data) => data._id === sectionId
      )
      const currentSubSectionIndx =
        courseSectionData?.[currentSectionIndx]?.subSection.findIndex(
          (data) => data._id === subSectionId
        )
      const activeSubSectionId =
        courseSectionData[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id)
      setVideoBarActive(activeSubSectionId)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname])

  return (
    <>
      {/* Burger menu button (mobile only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-[110] flex items-center justify-center rounded-full bg-richblack-700 p-3 text-richblack-25 shadow-lg"
      >
        <FiMenu size={22} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-[3.5rem] z-[100] h-[calc(100vh-3.5rem)] w-[280px] max-w-[380px] transform bg-richblack-800 border-r border-richblack-700 transition-transform duration-300 lg:static lg:translate-x-0 lg:flex lg:w-[380px]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ overflowX: "hidden" }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="mx-5 flex flex-col gap-2 border-b border-richblack-600 py-5 text-richblack-25">
            <div className="flex w-full items-center justify-between">
              <div
                onClick={() => navigate(`/dashboard/enrolled-courses`)}
                className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                title="back"
              >
                <IoIosArrowBack size={30} />
              </div>
              <IconBtn
                text="Add Review"
                customClasses="ml-auto text-xs sm:text-sm md:text-base"
                onClick={() => setReviewModal(true)}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-sm sm:text-base md:text-lg font-semibold break-words leading-snug">
                {courseEntireData?.courseName}
              </p>
              <p className="text-xs sm:text-sm font-medium text-richblack-500">
                {completedLectures?.length} / {totalNoOfLectures}
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="overflow-y-auto px-2 py-2 flex-1">
            {courseSectionData.map((course, index) => (
              <div
                className="mt-2 cursor-pointer text-xs sm:text-sm md:text-base text-richblack-5"
                key={index}
              >
                {/* Section */}
                <div
                  className="flex justify-between bg-richblack-600 px-4 py-3"
                  onClick={() =>
                    setActiveStatus(
                      activeStatus === course?._id ? "" : course?._id
                    )
                  }
                >
                  <div className="w-[70%] font-semibold text-xs sm:text-sm md:text-base break-words leading-snug">
                    {course?.sectionName}
                  </div>
                  <span
                    className={`${
                      activeStatus === course?._id ? "rotate-0" : "rotate-180"
                    } transition-all duration-500`}
                  >
                    <BsChevronDown />
                  </span>
                </div>

                {/* Sub Sections */}
                {activeStatus === course?._id && (
                  <div className="transition-[height] duration-500 ease-in-out">
                    {course.subSection.map((topic, i) => (
                      <div
                        className={`flex gap-2 px-4 py-2 items-center ${
                          videoBarActive === topic._id
                            ? "bg-yellow-200 font-semibold text-richblack-800"
                            : "hover:bg-richblack-900"
                        }`}
                        key={i}
                        onClick={() => {
                          navigate(
                            `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                          )
                          setVideoBarActive(topic._id)
                          setIsOpen(false)
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={completedLectures.includes(topic?._id)}
                          onChange={() => {}}
                          className="min-w-[14px] min-h-[14px]"
                        />
                        <span className="text-xs sm:text-sm md:text-base break-words leading-snug">
                          {topic.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
