import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";

const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  const isActive = currentCard === cardData?.heading;

  return (
    <div
      className={`max-w-[300px] w-[360px]  ${
        isActive
          ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
          : "bg-richblack-800"
      } text-richblack-25 h-[300px] box-border cursor-pointer hover:shadow-xl hover:border-brown-50 hover:scale-[1.07] transition-all ease-in-out`}
      onClick={() => setCurrentCard(cardData?.heading)}
    >
      {/* Top Section */}
      <div className="border-b-[2px] border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
        <h3
          className={`font-semibold text-[20px] ${
            isActive ? "text-richblack-800" : ""
          } hover:font-extrabold`}
        >
          {cardData?.heading}
        </h3>

        <p
          className={`text-richblack-400 transition-all ease-linear ${
            isActive ? "hover:text-black" : "hover:text-white"
          }`}
        >
          {cardData?.description}
        </p>
      </div>

      {/* Bottom Section */}
      <div
        className={`flex justify-between px-6 py-3 font-medium transition-all ease-linear ${
          isActive
            ? "text-blue-300 hover:text-blue-500"
            : "text-richblack-300 hover:text-white"
        }`}
      >
        {/* Level */}
        <div className="flex items-center gap-2 text-[16px]">
          <HiUsers />
          <p>{cardData?.level}</p>
        </div>

        {/* Lessons */}
        <div className="flex items-center gap-2 text-[16px]">
          <ImTree />
          <p>{cardData?.lessonNumber} Lessons</p>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
