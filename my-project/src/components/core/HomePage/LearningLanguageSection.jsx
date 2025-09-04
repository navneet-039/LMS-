import HighlightText from "./HighlightedText";
import React from "react";
import Know_Your_progress from "../../../assets/Images/Know_your_progress.png";
import compare_with_others from "../../../assets/Images/Compare_with_others.png";
import plan_your_lessons from "../../../assets/Images/plan_your_lessons.png";
import CTAButton from "./Button";

export default function LearningLanguageSection() {
  return (
    <div className="mt-[130px] mb-32">
      <div className="flex flex-col gap-5 items-center">
        {/* Heading */}
        <div className="text-4xl font-semibold text-center">
          Your Swiss Knife for{" "}
          <HighlightText text={"learning any language"} />
        </div>

        {/* Subheading */}
        <div className="text-center text-richblack-600 mx-auto text-base mt-3 font-medium w-[90%] md:w-[70%]">
          Using spin making learning multiple languages easy. With 20+ languages,
          realistic voice-over, progress tracking, custom schedule and more.
        </div>

        {/* Images Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center mt-5 gap-6 lg:gap-0">
          <img
            src={Know_Your_progress}
            alt="know_your_progressImage"
            className="object-contain lg:-mr-32 w-[250px] sm:w-[300px] lg:w-auto"
          />
          <img
            src={compare_with_others}
            alt="compare_with_othersImage"
            className="object-contain lg:-mb-10 lg:mt-0 -mt-12 w-[250px] sm:w-[300px] lg:w-auto"
          />
          <img
            src={plan_your_lessons}
            alt="plan_your_lessonsImage"
            className="object-contain lg:-ml-36 lg:-mt-5 -mt-16 w-[250px] sm:w-[300px] lg:w-auto"
          />
        </div>

        {/* CTA Button */}
        <div className="w-fit mt-6">
          <CTAButton active={true} linkto={"/signup"}>
            <div>Learn more</div>
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
