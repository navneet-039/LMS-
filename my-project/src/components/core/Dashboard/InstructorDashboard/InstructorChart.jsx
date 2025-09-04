import { useState } from "react"
import { Chart, registerables } from "chart.js"
import { Pie } from "react-chartjs-2"

Chart.register(...registerables)

export default function InstructorChart({ courses }) {
  const [currChart, setCurrChart] = useState("students")
  const generateRandomColors = (numColors) => {
    const colors = []
    for (let i = 0; i < numColors; i++) {
      const r = Math.floor(Math.random() * 256)
      const g = Math.floor(Math.random() * 256)
      const b = Math.floor(Math.random() * 256)
      colors.push(`rgb(${r}, ${g}, ${b})`)
    }
    return colors
  }

  const colors = generateRandomColors(courses.length)

  // Chart data for Students
  const chartDataStudents = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalstudentEnrolled || 0),
        backgroundColor: colors,
      },
    ],
  }

  // Chart data for Income
  const chartIncomeData = {
    labels: courses.map((course) => course.courseName),
    datasets: [
      {
        data: courses.map((course) => course.totalAmountGenerated || 0),
        backgroundColor: colors,
      },
    ],
  }
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  const activeData =
    currChart === "students" ? chartDataStudents : chartIncomeData

  return (
    <div className="flex flex-1 flex-col gap-y-4 rounded-md bg-richblack-800 p-6">
      <p className="text-lg font-bold text-richblack-5">Visualize</p>

      {/* Chart toggle buttons */}
      <div className="space-x-4 font-semibold">
        <button
          onClick={() => setCurrChart("students")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "students"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Students
        </button>
        <button
          onClick={() => setCurrChart("income")}
          className={`rounded-sm p-1 px-3 transition-all duration-200 ${
            currChart === "income"
              ? "bg-richblack-700 text-yellow-50"
              : "text-yellow-400"
          }`}
        >
          Income
        </button>
      </div>

      {/* Chart container */}
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <div className="relative aspect-square w-[300px] max-w-full">
          <Pie data={activeData} options={options} />
        </div>

        {/* Custom Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          {activeData.labels.map((label, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span
                className="inline-block h-3 w-3 rounded"
                style={{ backgroundColor: colors[i] }}
              ></span>
              <span className="text-sm text-richblack-50">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
