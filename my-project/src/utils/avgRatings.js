export default function GetAvgRating(ratingArr = []) {
  if (!Array.isArray(ratingArr) || ratingArr.length === 0) return 0;

  const total = ratingArr.reduce((acc, curr) => {
    const rating = Number(curr?.rating) || 0; // ensure number
    return acc + rating;
  }, 0);

  // Average rounded to 1 decimal place
  const avg = total / ratingArr.length;
  return Math.round(avg * 10) / 10;
}
