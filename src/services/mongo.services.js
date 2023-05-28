const mongoose = require("mongoose");

const DB_CONNECTION = process.env.DB_CONNECTION || "";

mongoose.connection.on("error", (err) =>
{
  console.log("something happened");
});

mongoose.connection.once("open", () => {
  console.log("mongodb connect successfully");
});

const connectMongo = async () => {
  await mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectMongo;
