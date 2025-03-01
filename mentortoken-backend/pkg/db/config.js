const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.n4xdqhm.mongodb.net/MentorToken-Backend?retryWrites=true&w=majority&appName=Cluster0`;

const connect = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Mongoose is connected with MongoDB");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connect;




