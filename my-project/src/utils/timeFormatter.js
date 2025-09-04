// utils/timeFormatter.js
export function calculateTotalDuration(course) {
  if (!course?.courseContent) return "0 min";

  let totalSeconds = 0;

  course.courseContent.forEach((section) => {
    section.subSection.forEach((sub) => {
      if (sub.timeDuration) {
        const [hh, mm, ss] = sub.timeDuration.split(":").map(Number);
        totalSeconds += hh * 3600 + mm * 60 + ss;
      }
    });
  });

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}hr ${minutes}min`;
  }
  return `${minutes}min`;
}
