import React, { useState } from "react";
import { HomePageExplore } from "../../../data/homepage-explore";
import HighlightText from "./HighlightedText";
import CourseCard from "./CourseCard";

const tabName = ["Free", "New to coding", "Most popular", "Skills paths","Career paths"];

export default function ExploreMore() {
  const [currentTab, setCurrentTab] = useState(tabName[0]);
  const [courses, setCourses] = useState(HomePageExplore[0].courses);
  const [CurrentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  const setMyCards = (value) => {
    const result = HomePageExplore.filter((course) => course.tag === value);
    if (result.length > 0) {
      setCourses(result[0].courses);
      setCurrentCard(result[0].courses[0].heading);
      setCurrentTab(value);
    }
  };

  return (
    <div>
      <div className="text-4xl font-semibold text-center">
        Unlock the
        <HighlightText text={"Power of code"}></HighlightText>
      </div>
      <p className="text-center text-richblack-300 text-lg  mt-3">
        Learn to build anything you can imagine
      </p>

      {/* Tab Buttons */}
      <div className="flex flex-row rounded-full bg-richblack-800 mb-5 border-richblack-100 mt-5 px-1 py-1 ">
        {tabName.map((element, index) => (
          <div
            key={index}
            className={` text-[16px] flex flex-row items-center text-center  ${
              currentTab === element
                ? "bg-richblue-900 text-richblack-5  font-medium"
                : "text-richblack-200"
            } rounded-full transition-all duration-200 cursor-pointer hover:bg-richblue-900 hover:text-richblack-5 px-2 lg:px-20  py-1 lg:py-4`}
            onClick={() => setMyCards(element)}
          >
            {element}
          </div>
        ))}
      </div>

      {/* Course Cards */}
      <div className="w-full  mt-6 flex   flex-row  justify-center  mb-[200px] ">
        <div className=" flex  flex-col   lg:flex-row  gap-6 justify-between">
          {courses.map((element, index) => (
            <CourseCard
              key={index}
              cardData={element}
              CurrentCard={CurrentCard}
              setCurrentCard={setCurrentCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
