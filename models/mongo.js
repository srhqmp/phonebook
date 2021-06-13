const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("command must contain password: node mongo.js <password>");
  process.exit(1);
}

// get parameters
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

//connect to mongodb
const url = `mongodb://sarah:${password}@clusters-shard-00-00.zetrn.mongodb.net:27017,clusters-shard-00-01.zetrn.mongodb.net:27017,clusters-shard-00-02.zetrn.mongodb.net:27017/phonebook-app?ssl=true&replicaSet=atlas-4i5z05-shard-0&authSource=admin&retryWrites=true&w=majority`;

//connect to db
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

//make phonebook schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
});

// create model for person?
const Person = mongoose.model("Person", personSchema);

if (name && number) {
  // CREATE new person
  const newPerson = new Person({
    name: name,
    number: number,
    date: new Date(),
  });

  // save person to db
  newPerson.save().then((res) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((res) => {
    console.log("phonebook:");
    res.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
