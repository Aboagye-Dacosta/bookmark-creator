const { Schema, model } = require("mongoose");

const BookMarkModel = new Schema({
  title: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  description: String,
  link: String,
  type: String,
  date: String,
  image: String,
  staled: {
    type: Boolean,
    default: false,
  },
});

const BookMark = model("bookmarks", BookMarkModel);

module.exports = BookMark;
