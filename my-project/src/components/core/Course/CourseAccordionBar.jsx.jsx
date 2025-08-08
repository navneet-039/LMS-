import { useEffect, useRef, useState } from "react";
import { AiOutlineDown } from "react-icons/ai";
import CourseSubSectionAccordion from "./CourseSubSectionAccordian";

export default function CourseAccordionBar({ course, isActive, handleActive }) {
  const contentEl = useRef(null);
  const [active, setActive] = useState(false);
  const [sectionHeight, setSectionHeight] = useState(0);

  useEffect(() => {
    if (course?._id) {
      setActive(isActive?.includes(course._id));
    }
  }, [isActive, course?._id]);

  useEffect(() => {
    setSectionHeight(active ? contentEl.current?.scrollHeight || 0 : 0);
  }, [active]);

  if (!course) return null;

  return (
    <div className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0">
      {/* Accordion Header */}
      <div
        className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-all duration-300"
        onClick={() => handleActive(course._id)}
      >
        <div className="flex items-center gap-2">
          <i
            className={
              active
                ? "rotate-180 transition-transform"
                : "rotate-0 transition-transform"
            }
          >
            <AiOutlineDown />
          </i>
          <p>{course?.sectionName}</p>
        </div>
        <div className="space-x-4">
          <span className="text-yellow-25">
            {`${course?.subSection?.length || 0} lecture(s)`}
          </span>
        </div>
      </div>

      {/* Accordion Content */}
      <div
        ref={contentEl}
        className="relative overflow-hidden bg-richblack-900 transition-[height] duration-[0.35s] ease-in-out"
        style={{ height: sectionHeight }}
      >
        <div className="flex flex-col gap-2 px-7 py-6 font-semibold text-textHead">
          {course?.subSection?.map((subSec, index) => (
            <CourseSubSectionAccordion subSec={subSec} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
