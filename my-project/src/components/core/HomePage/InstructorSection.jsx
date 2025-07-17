import Instructor from "../../../assets/Images/Instructor.png";
import React from "react";
import HighlightText from "./HighlightedText";
import CTAButton from "./Button";
import { FaArrowLeft, FaArrowRight, FaArrowUp } from "react-icons/fa";
export default function InstructorSection() {
  return (
    <div className="mt-16">
      <div className="flex flex-row gap-20 items-center">
        {/* {left part} */}
        <div className="w-[50%]">
          <img
            src={Instructor}
            alt="instructor_image"
            className="shadow-white"
          />
        </div>
        {/* {right part} */}
        <div className="w-[50%] flex flex-col gap-5">
          <div className="text-4xl font-semibold w-[50%]">
            Become an
            <HighlightText text={"Instructor"} />
          </div>
          <p className="text-richblack-300 text-[16px] w-[80%] font-medium">
            {" "}
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.{" "}
          </p>
          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
            <div className="flex flex-row gap-2 items-center">
              Start Learning Today
              <FaArrowRight />
            </div>
          </CTAButton>
          </div>
          
        </div>
      </div>
    </div>
  );
}
