const mongoose = require("mongoose");


const dbConnect = () => {
  try {
   mongoose.connect(
    process.env.MONGO_URI,
      {
        dbName: "tasks",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    console.log(`DB connected successFully`);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = dbConnect
