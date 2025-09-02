import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import ReactStars from "react-stars";   // ✅ using react-stars
import IconBtn from "../../common/IconBtn";
import { createRating } from "../../../Services/operations/"
import { toast } from "react-hot-toast"; // ✅ for better feedback

const CourseReviewModal = ({ setReviewModal, courseId }) => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const rating = watch("courseRating");

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, [setValue]);

  const ratingChange = (newRating) => setValue("courseRating", newRating);

 const onSubmit = async (data) => {
  if (!data.courseRating || data.courseRating === 0) {
    alert("Please select a rating before submitting");
    return;
  }

  const payload = {
    courseId: String(courseId),              // ensure string
    rating: Number(data.courseRating),       // force number
    review: data.courseExperience.trim(),    // remove whitespace
    token,
  };

  console.log("Submitting rating payload:", payload);

  const success = await createRating(payload);

  if (success) setReviewModal(false);
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-richblack-800 text-white rounded-lg w-full max-w-md p-6 shadow-lg">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Add Review</p>
          <button
            onClick={() => setReviewModal(false)}
            className="text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* User Info */}
        <div className="flex items-center mb-4 gap-4">
          <img
            src={user?.image}
            alt="user"
            className="aspect-square w-[50px] rounded-full border border-gray-600"
          />
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-400">posting publicly</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* React Stars */}
          <div className="mb-2 flex flex-col items-center">
            <ReactStars
              count={5}
              onChange={ratingChange}
              size={30}
              color="#374151"       // gray-700 (inactive)
              activeColor="#facc15" // yellow-400 (active)
              half={false}
              value={rating || 0}   // ✅ controlled by react-hook-form
            />
            <span className="text-sm text-gray-300 mt-1">
              Rating: {rating || 0} / 5
            </span>
          </div>

          {/* Review Textarea */}
          <div className="mt-4">
            <label
              htmlFor="courseExperience"
              className="block mb-1 font-medium"
            >
              Add Your Experience
            </label>
            <textarea
              id="courseExperience"
              placeholder="Enter your experience"
              {...register("courseExperience", { required: true })}
              className="min-h-[130px] w-full p-2 border border-gray-600 bg-richblack-700 rounded-md text-white placeholder-gray-400"
            />
            {errors.courseExperience && (
              <span className="text-red-500 text-sm">
                Please add your experience
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setReviewModal(false)}
              className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <IconBtn
              text="Save"
              type="submit"
              customClasses="bg-yellow-50 text-richblack-900 hover:bg-yellow-100"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseReviewModal;
