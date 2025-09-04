import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../../Services/operations/settingApi";

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleDeleteAccount() {
    try {
      await dispatch(deleteProfile(token, navigate));
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message);
    }
  }

  return (
    <div className="my-10 flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-md border border-pink-700 bg-pink-900 p-6 sm:p-8 text-richblack-5">
      {/* Icon */}
      <div className="flex aspect-square h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-pink-700 mx-auto sm:mx-0">
        <FiTrash2 className="text-2xl sm:text-3xl text-pink-200" />
      </div>

      {/* Text content */}
      <div className="flex flex-col space-y-3 text-center sm:text-left">
        <h2 className="text-base sm:text-lg font-semibold">Delete Account</h2>
        <div className="w-full sm:w-3/5 text-pink-25 space-y-1 mx-auto sm:mx-0">
          <p>Would you like to delete your account?</p>
          <p>
            This account may contain Paid Courses. Deleting your account is
            permanent and will remove all content associated with it.
          </p>
        </div>
        <button
          type="button"
          className="w-fit cursor-pointer italic text-pink-300 mx-auto sm:mx-0"
          onClick={handleDeleteAccount}
        >
          I want to delete my account.
        </button>
      </div>
    </div>
  );
}
