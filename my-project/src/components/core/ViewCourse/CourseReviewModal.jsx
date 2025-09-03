import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import StarRatings from "react-star-ratings";
import { useSelector } from "react-redux";
import { createRating } from "../../../Services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
  }, [setValue]);

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-white bg-opacity-10 backdrop-blur-sm px-2 sm:px-4">
      <div className="my-6 w-full max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800 shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-4 sm:p-5">
          <p className="text-lg sm:text-xl font-semibold text-richblack-5">
            Add Review
          </p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-xl sm:text-2xl text-richblack-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6">
          {/* User Info */}
          <div className="flex items-center justify-center gap-x-3 sm:gap-x-4">
            <img
              src={user?.image}
              alt={user?.firstName + " profile"}
              className="aspect-square w-[45px] sm:w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5 text-sm sm:text-base">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs sm:text-sm text-richblack-5">
                Posting Publicly
              </p>
            </div>
          </div>

          {/* Review Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            {/* Rating Stars */}
            <StarRatings
              rating={watch("courseRating") || 0}
              starRatedColor="#FFD700"
              starHoverColor="#FFD700"
              starEmptyColor="#4B5563"
              changeRating={(newRating) => setValue("courseRating", newRating)}
              numberOfStars={5}
              starDimension="28px"
              starSpacing="4px"
              name="rating"
            />

            {/* Review Textarea */}
            <div className="flex w-full sm:w-11/12 flex-col space-y-2 mt-4">
              <label
                className="text-sm text-richblack-5"
                htmlFor="courseExperience"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add Your Experience"
                {...register("courseExperience", { required: true })}
                className="form-style resize-none min-h-[100px] sm:min-h-[130px] w-full text-sm sm:text-base"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Please Add Your Experience
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex w-full sm:w-11/12 flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="flex w-full sm:w-auto cursor-pointer items-center justify-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
              >
                Cancel
              </button>
              <IconBtn text="Save" type="submit" customClasses="w-full sm:w-auto" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
