/* eslint-disable no-unused-vars */
const mongoose = require("mongoose");
const config = require("../utils/config.js");
const logger = require("../utils/logger.js");

mongoose.set("strictQuery", false);

const url = config.MONGODB_URI;

logger.info("connecting to", url);

mongoose
  .connect(url)
  .then((res) => {
    logger.info("connected to MongoDB");
  })
  .catch((err) => {
    logger.error("error connecting to MongoDB", err.message);
  });

const validatePhoneNumber = (phoneNumber) => {
  const regex = /^(?:\d{2,3}-\d+)$/;
  return regex.test(phoneNumber);
};

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (v) => validatePhoneNumber(v),
      message: (props) =>
        "Invalid phone number format. Please provide a phone number in the format XX-XXXXXXX or XXX-XXXXXXXX",
    },
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
