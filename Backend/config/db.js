const mongoose = require("mongoose");

const connectToDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Succesfully connected to DB");
  } catch (err) {
    console.log("error while connecting to DB", err);
  }
};

module.exports = connectToDB;
