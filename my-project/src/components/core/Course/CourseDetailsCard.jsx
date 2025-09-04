import React from "react";
import copy from "copy-to-clipboard";
import { toast } from "react-hot-toast";
import { BsFillCaretRightFill } from "react-icons/bs";
import { FaShareSquare } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addToCart } from "../../../slices/cartSlice";
import { ACCOUNT_TYPE } from "../../../utils/constants";

export default function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    thumbnail = "",
    price = 0,
    _id: courseId,
    instructions = [],
    studentsEnrolled = [],
    courseName = "",
  } = course?.data || {};

  const handleShare = () => {
    copy(window.location.href);
    toast.success("Link copied to clipboard");
  };

 const handleAddToCart = () => {
  console.log("Add to cart clicked");
  if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
    toast.error("You are an Instructor. You can't buy a course.");
    return;
  }
  if (token) {
    console.log("Current cart:", cart);
    // Check for duplicate using correct path
    const isAlreadyInCart = cart.some(item => item._id === courseId);

    if (isAlreadyInCart) {
      console.log("Course already in cart");
      toast.error("Course already in cart");
      return;
    } else {
      console.log("Dispatching addToCart");
      dispatch(addToCart(course));
      return;
    }
  }
  setConfirmationModal({
    text1: "You are not logged in!",
    text2: "Please login to add To Cart",
    btn1Text: "Login",
    btn2Text: "Cancel",
    btn1Handler: () => navigate("/login"),
    btn2Handler: () => setConfirmationModal(null),
  });
};


  const isEnrolled = user && studentsEnrolled.includes(user._id);

  return (
    <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5 max-w-sm">
      {/* Course Image */}
      <img
        src={thumbnail}
        alt={courseName}
        className="max-h-[300px] min-h-[180px] w-full overflow-hidden rounded-2xl object-cover"
      />

      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">Rs. {price}</div>

        <div className="flex flex-col gap-4">
          <button
            className="yellowButton"
            onClick={isEnrolled ? () => navigate("/dashboard/enrolled-courses") : handleBuyCourse}
          >
            {isEnrolled ? "Go To Course" : "Buy Now"}
          </button>

          {!isEnrolled && (
            <button onClick={handleAddToCart} className="blackButton">
              Add to Cart
            </button>
          )}
        </div>

        <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
          30-Day Money-Back Guarantee
        </p>

        <div>
          <p className="my-2 text-xl font-semibold">Prerequisite for this course </p>
          <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
            {instructions.length > 0 ? (
              instructions.map((item, i) => (
                <p className="flex gap-2" key={i}>
                  <BsFillCaretRightFill />
                  <span>{item}</span>
                </p>
              ))
            ) : (
              <p>No instructions provided</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
            onClick={handleShare}
          >
            <FaShareSquare size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}
