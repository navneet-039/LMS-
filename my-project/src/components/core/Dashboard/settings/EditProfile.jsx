import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { updateProfile } from "../../../../Services/operations/settingApi";
import IconBtn from "../../../common/IconBtn";

const genders = ["Male", "Female", "Non-Binary", "Prefer not to say", "Other"];

export default function EditProfile() {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitProfileForm = async (data) => {
    try {
      dispatch(updateProfile(token, data));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitProfileForm)} className="space-y-6 w-full">
      {/* Profile Information */}
      <div className="my-6 flex flex-col gap-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-6 sm:p-8 md:px-12">
        <h2 className="text-lg font-semibold text-richblack-5">
          Profile Information
        </h2>

        {/* First & Last Name */}
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col gap-2 w-full md:w-[48%] text-richblack-300">
            <label htmlFor="firstName" className="lable-style">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              className="form-style w-full p-3"
              {...register("firstName", { required: true })}
              defaultValue={user?.firstName}
            />
            {errors.firstName && (
              <span className="text-[12px] text-yellow-100">
                Please enter your first name.
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[48%] text-richblack-300">
            <label htmlFor="lastName" className="lable-style">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter last name"
              className="form-style w-full p-3"
              {...register("lastName", { required: true })}
              defaultValue={user?.lastName}
            />
            {errors.lastName && (
              <span className="text-[12px] text-yellow-100">
                Please enter your last name.
              </span>
            )}
          </div>
        </div>

        {/* DOB & Gender */}
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col gap-2 w-full md:w-[48%] text-richblack-300">
            <label htmlFor="dateOfBirth" className="lable-style">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              className="form-style w-full p-3"
              {...register("dateOfBirth", {
                required: {
                  value: true,
                  message: "Please enter your Date of Birth.",
                },
                max: {
                  value: new Date().toISOString().split("T")[0],
                  message: "Date of Birth cannot be in the future.",
                },
              })}
              defaultValue={user?.additionalDetails?.dateOfBirth}
            />
            {errors.dateOfBirth && (
              <span className="text-[12px] text-yellow-100">
                {errors.dateOfBirth.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[48%] text-richblack-300">
            <label htmlFor="gender" className="lable-style">
              Gender
            </label>
            <select
              id="gender"
              className="form-style w-full p-3"
              {...register("gender", { required: true })}
              defaultValue={user?.additionalDetails?.gender}
            >
              {genders.map((ele, i) => (
                <option key={i} value={ele}>
                  {ele}
                </option>
              ))}
            </select>
            {errors.gender && (
              <span className="text-[12px] text-yellow-100">
                Please select your gender.
              </span>
            )}
          </div>
        </div>

        {/* Contact & About */}
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex flex-col gap-2 w-full md:w-[48%] text-richblack-300">
            <label htmlFor="contactNumber" className="lable-style">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNumber"
              placeholder="Enter Contact Number"
              className="form-style w-full p-3"
              {...register("contactNumber", {
                required: {
                  value: true,
                  message: "Please enter your Contact Number.",
                },
                maxLength: { value: 12, message: "Invalid Contact Number" },
                minLength: { value: 10, message: "Invalid Contact Number" },
              })}
              defaultValue={user?.additionalDetails?.contactNumber}
            />
            {errors.contactNumber && (
              <span className="text-[12px] text-yellow-100">
                {errors.contactNumber.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full md:w-[48%] text-richblack-300">
            <label htmlFor="about" className="lable-style">
              About
            </label>
            <input
              type="text"
              id="about"
              placeholder="Enter Bio Details"
              className="form-style w-full p-3"
              {...register("about", { required: true })}
              defaultValue={user?.additionalDetails?.about}
            />
            {errors.about && (
              <span className="text-[12px] text-yellow-100">
                Please enter your About.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/dashboard/my-profile")}
          className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
        >
          Cancel
        </button>
        <IconBtn type="submit" text="Save" />
      </div>
    </form>
  );
}
