const { Router } = require("express");
const BookmarkController = require("../controller/bookmarks.controller");
const authenticate = require("../middleware/auth");

const bookmarkRouter = Router();

bookmarkRouter.get("/", authenticate, BookmarkController.httpReadAllBookmarks);
bookmarkRouter.post("/", authenticate, BookmarkController.httpCreateBookmark);
bookmarkRouter.put("/:id", authenticate, BookmarkController.httpUpdateBookmark);
bookmarkRouter.delete(
  "/:id",
  authenticate,
  BookmarkController.httpDeleteBookmark
);

module.exports = bookmarkRouter;
