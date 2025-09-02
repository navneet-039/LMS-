import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FiArrowLeft, FiChevronDown } from "react-icons/fi"
import IconBtn from "../../common/IconBtn"

export const VideoDetailsSidebar = ({ setReviewModal }) => {
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState("")
  const [videobarActive, setVideobarActive] = useState("")
  const { sectionId, subsectionId } = useParams()
  const location = useLocation()

  const {
    courseSectionData,
    courseEntireData,
    completedLectures,
    totalNoOfLectures,
  } = useSelector((state) => state.viewCourse)

  useEffect(() => {
    if (!courseSectionData?.length) return

    const currentSectionIndex = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubsectionIndex =
      courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
        (data) => data._id === subsectionId
      )

    const activeSubSectionId =
      courseSectionData?.[currentSectionIndex]?.subSection?.[
        currentSubsectionIndex
      ]?._id

    if (currentSectionIndex !== -1) {
      setActiveStatus(courseSectionData[currentSectionIndex]._id)
    }
    if (activeSubSectionId) {
      setVideobarActive(activeSubSectionId)
    }
  }, [courseSectionData, courseEntireData, location.pathname, sectionId, subsectionId])

  return (
    <div className="w-64 bg-richblack-800 text-white flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <div
          onClick={() => navigate("/dashboard/enrolled-courses")}
          className="cursor-pointer text-yellow-50 flex items-center gap-2"
        >
          <FiArrowLeft size={20} />
        </div>
        <IconBtn text="Add Review" onClick={() => setReviewModal(true)} />
      </div>

      {/* Course Info */}
      <div className="p-4">
        <p className="font-bold">{courseEntireData?.courseName}</p>
        <p className="text-sm">
          {completedLectures?.length || 0}/{totalNoOfLectures} 
        </p>
      </div>
      

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {courseSectionData?.map((section) => {
          const isActive = activeStatus === section?._id
          return (
            <div key={section._id} className="border-b border-richblack-700">
              {/* Section Header */}
              <div
                onClick={() =>
                  setActiveStatus(isActive ? "" : section?._id) 
                }
                className="p-3 cursor-pointer bg-richblack-500 flex justify-between items-center"
              >
                <span>{section?.sectionName}</span>
                <FiChevronDown
                  className={`transition-transform duration-300 ${
                    isActive ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {/* SubSections */}
              {isActive &&
                section?.subSection?.map((topic) => (
                  <div
                    key={topic._id}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-all ${
                      videobarActive === topic._id
                        ? "bg-yellow-200 text-richblack-800"
                        : "bg-richblack-900 text-richblack-50"
                    }`}
                    onClick={() => {
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${section._id}/sub-section/${topic._id}`
                      )
                      setVideobarActive(topic._id)
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={completedLectures.includes(topic._id)}
                      readOnly
                    />
                    <span>{topic.title}</span>
                  </div>
                ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
