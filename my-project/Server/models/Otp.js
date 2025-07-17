const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate = require("../mail/template/emailVerificationTemplate");
const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 5 * 60,
  },
});

//a function-->email send

async function sendVerificationEmail(email, otp) {
  try {
    const mailresponse = await mailSender(
      email,
      "Verification Email from StudyNotion",
      otpTemplate(otp)
    );
    console.log("Email sent successfully", mailresponse);
  } catch (e) {
    console.error("error occured while sending otp : ", e);
    throw e;
  }
}
OTPSchema.pre("save", async function (next) {
  console.log("Running pre-save hook for OTP");

  if (this.isNew) {
    console.log("New OTP detected. Sending email to:", this.email);
    await sendVerificationEmail(this.email, this.otp);
  } else {
    console.log("Not a new OTP. Skipping email.");
  }

  next();
});


module.exports = mongoose.model("OTP", OTPSchema);
