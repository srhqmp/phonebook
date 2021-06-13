const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

//connect to mongodb
const url = process.env.MONGODB_URI;

//connect to db
mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(err.message));

//make phonebook schema
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
  },
  date: {
    type: Date,
  },
});

personSchema.plugin(uniqueValidator);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

// create model for person?
module.exports = mongoose.model("Person", personSchema);
