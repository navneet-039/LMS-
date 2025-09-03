import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/autoplay"; // ✅ removed navigation css
import { FreeMode, Pagination, Autoplay } from "swiper/modules"; // ✅ removed Navigation
import StarRatings from "react-star-ratings";
import { apiConnector } from "../../Services/apiConnector";
import { ratingEndPoints } from "../../Services/api";
import { useSelector } from "react-redux";

const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const { user } = useSelector((state) => state.profile);
  const truncateWords = 15;

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await apiConnector(
          "GET",
          ratingEndPoints.REVIEW_DETAILS_API
        );
        if (response?.data?.success) {
          setReviews(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchAllReviews();
  }, []);

  // Function to truncate review text
  const truncateText = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  // Function to get user avatar with fallbacks
  const getUserAvatar = (reviewUser) => {
    if (reviewUser?.image) return reviewUser.image;
    if (user?.image) return user.image;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
      reviewUser?.firstName + " " + reviewUser?.lastName
    )}`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-10">
      {/* <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Student Reviews
      </h2> */}

      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-yellow-400",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-white",
        }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="pb-12"
      >
        {reviews.length > 0 ? (
          reviews.map((rev, index) => (
            <SwiperSlide key={index}>
              <div className="bg-richblack-800 text-richblack-25 p-6 rounded-xl shadow-lg min-h-[220px] flex flex-col gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={getUserAvatar(rev?.user)}
                    alt={rev?.user?.firstName}
                    className="w-12 h-12 aspect-square rounded-full object-cover border border-richblack-700 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3
                      className="font-semibold truncate"
                      title={`${rev?.user?.firstName} ${rev?.user?.lastName}`}
                    >
                      {rev?.user?.firstName} {rev?.user?.lastName}
                    </h3>
                    <p
                      className="text-sm text-richblack-400 truncate"
                      title={rev?.course?.courseName}
                    >
                      {rev?.course?.courseName}
                    </p>
                  </div>
                </div>

                {/* Rating + Count */}
                <div className="flex items-center gap-2">
                  <StarRatings
                    rating={rev?.rating || 0}
                    starRatedColor="#fbbf24"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name="rating"
                  />
                  <span className="text-sm text-richblack-200 font-medium">
                    {rev?.rating?.toFixed(1) || "0.0"} / 5
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-richblack-100 leading-relaxed">
                  {truncateText(rev?.review, truncateWords)}
                </p>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <p className="text-center text-richblack-400">No reviews yet</p>
        )}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
