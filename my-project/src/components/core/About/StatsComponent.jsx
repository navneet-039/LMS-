import React from "react";
const Stats = [
  { count: "5K", label: "Active Students" },
  { count: "10+", label: "Mentors" },
  { count: "200+", label: "Courses" },
  { count: "50+", label: "Awards" },
];
export default function StatsComponent() {
  return (
    <section className="mt-4 bg-richblack-700 border-b-2 border-b-richblack-700  mx-auto px-3 py-8 rounded-sm">
      <div className="text-center items-center ">
        <div className="flex gap-x-5  text-center items-center justify-evenly w-8/9">
          {Stats.map((data, index) => (
            <div key={index} >
              <h1 className="font-semibold text-2xl  text-richblack-5">
                {data.count}
              </h1>
              <h2 className="text-pure-greys-100">{data.label}</h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
