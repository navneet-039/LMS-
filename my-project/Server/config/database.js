const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Mongodb connected...");
    })
    .catch((error) => {
      console.log("Db connection failed");
      console.error(error);
      process.exit(1);
    });
};
