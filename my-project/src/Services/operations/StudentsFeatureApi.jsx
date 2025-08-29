// src/Services/operations/StudentsFeatureApi.js

import { toast } from "react-hot-toast";
import { studentEndpoints } from "../api";
import { apiConnector } from "../apiConnector";
import logoFullDark from "../../assets/Logo/Logo-Full-Dark.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

// Load Razorpay SDK
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function buyCourse({ token, courses, userDetails, navigate, dispatch }) {
  const toastId = toast.loading("Loading....");
  try {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      toast.error("Razorpay SDK failed to load");
      return;
    }

    // Step 1: Create order
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    // Step 2: Configure Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank You for purchasing the course",
      image: logoFullDark,
      prefill: {
        name: `${userDetails.firstName}`,
        email: userDetails.email,
      },
      handler: function (response) {
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          courses: courses,
        };

        console.log("Frontend sending for verification:", paymentData);

        sendPaymentSuccessfullEmail(
          paymentData,
          orderResponse.data.data.amount,
          token
        );
        verifyPayment({ bodyData: paymentData, token, navigate, dispatch });
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops, payment failed");
      console.error("Payment Failed Details:", response.error);
    });
  } catch (error) {
    console.error("PAYMENT API ERROR:", error.message);
    toast.error("Could not make payment");
  } finally {
    toast.dismiss(toastId);
  }
}

// Send email
async function sendPaymentSuccessfullEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.error("PAYMENT SUCCESS EMAIL ERROR", error);
  }
}

// Verify payment
async function verifyPayment({ bodyData, token, navigate, dispatch }) {
  const toastId = toast.loading("Verifying payment.....");
  dispatch(setPaymentLoading(true));

  console.log("Frontend verifying with data:", bodyData);

  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    console.log("Verification response:", response.data);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment successful, you are enrolled!");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR", error?.response?.data || error.message);
    toast.error("Could not verify payment");
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}
