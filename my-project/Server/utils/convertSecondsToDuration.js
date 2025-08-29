// utils/convertSecondsToDuration.js
// function convertSecondsToDuration(seconds) {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   return `${hours}h ${minutes}m`;
// }

// module.exports = convertSecondsToDuration;
function convertSecondsToDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours === 0) {
    return `${minutes}m`;
  }
  return `${hours}h ${minutes}m`;
}

module.exports = convertSecondsToDuration;

