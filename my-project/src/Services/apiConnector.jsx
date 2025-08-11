import axios from "axios";

// Keep credentials setting if needed for session auth
export const axiosInstance = axios.create({
  withCredentials: true,
});

export const apiConnector = async (method, url, bodyData = null, headers = {}, params = {}) => {
  try {
    const response = await axiosInstance({
      method,
      url,
      data: bodyData,
      headers,  
      params,
    });

    return response;
  } catch (error) {
    console.error("API CONNECTOR ERROR:", error);
    throw error;
  }
};
