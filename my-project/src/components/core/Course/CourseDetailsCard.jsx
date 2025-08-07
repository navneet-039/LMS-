import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import copy from "copy-to-clipboard";
import { ACCOUNT_TYPE } from "../../../utils/constants";
import { addToCart } from "../../../slices/cartSlice";

const CourseDetailsCard = ({
  course,
  setConfirmationModal,
  handleBuyCourse,
}) => {
  const {
    thumbnail: ThumbnailImg,
    price: CurrentPrice,
    studentsEnrolled,
  } = course.data;
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Proper enrolled check
  const isEnrolled = studentsEnrolled?.some((student) =>
    typeof student === "string"
      ? student === user?._id
      : student?._id === user?._id
  );
  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an instructor ,You cannot buy course");
    }
    if (token) {
      dispatch(addToCart(course.data));
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in",
      text2: "Please log in to add to cart",
      btn1Text: "Login",
      btn2Rext: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };
  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link Copied to Clipboard");
  };
  return (
    <div>
      <img
        src={ThumbnailImg}
        alt="Thumbnail"
        className="max-h-[300px] min-h-[180px] w-[400px]"
      />
      <div>Rs {CurrentPrice}</div>
      <div className="flex flex-col gap-y-4">
        <button
          className="bg-yellow-50 w-fit p-2 rounded-md"
          onClick={
            user && isEnrolled
              ? () => navigate("/dashboard/enrolled-courses")
              : handleBuyCourse
          }
        >
          {user && isEnrolled ? "Go to course" : "Buy now"}
        </button>
        {!isEnrolled && (
          <button
            className="bg-yellow-50 w-fit text-richblack-900 p-2 rounded-md"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>

      <div>
        <p>30-Day Money Back Guarantee</p>
        <p>This Course Includes:</p>
        <div className="flex flex-col gap-y-3">
          {course.data.instructions?.map((item, index) => (
            <p key={index} className="flex gap-x-2">
              <span>{item}</span>
            </p>
          ))}
        </div>
      </div>
      <div>
        <button
          className="m-auto flex item-centergap-2 p-6 text-yellow-25"
          onClick={handleShare}
        >
          Share
        </button>
      </div>
    </div>
  );
};

export default CourseDetailsCard;
