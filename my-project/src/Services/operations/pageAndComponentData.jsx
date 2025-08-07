// pageAndComponentData.jsx
import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { catalogData } from "../api";

export const GetCatalogPageData = async (categoryId) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector(
      "POST",
      catalogData.CATALOGPAGEDATA_API,
      { categoryId: categoryId }
    );

    if (!response?.data?.success) {
      throw new Error("could not fetch category page data");
    }

    result = response?.data;
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR", error);
    toast.error(error.message);
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};
