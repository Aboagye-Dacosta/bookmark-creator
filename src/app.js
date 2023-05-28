const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const UserRouter = require("./router/user.router");
const BookMarkRouter = require("./router/bookmarks.router");

const app = express();

app.use(cors());
// app.use(
//   helmet({
//     crossOriginResourcePolicy: false,
//   })
// );
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());
app.use("/user", UserRouter);
app.use("/bookmarks", BookMarkRouter);
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/images/:filename", (req, res) => {
  const { filename } = req.params;
  res.sendFile(path.join(__dirname, ".", "assets", filename));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
