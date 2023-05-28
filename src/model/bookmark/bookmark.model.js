const BookMark = require("./bookmark.mongo");

const wrapper = (query) => {
  return new Promise((resolve, reject) =>
    query.then((bookmark) => resolve(bookmark)).catch((error) => reject(error))
  );
};

const create = (bookmark) => {
  return wrapper(
    BookMark.findOneAndUpdate(bookmark, bookmark, {
      upsert: true,
      returnDocument: "after",
    })
  );
};

const readAll = (userId) => {
  return wrapper(BookMark.find({ userId }));
};

const readOne = (filter) => {
  return wrapper(BookMark.findOne(filter));
};

const update = (bookmark) => {
  return wrapper(
    BookMark.findOneAndUpdate(
      { _id: bookmark._id, userId: bookmark.userId },
      bookmark,
      {
        returnDocument: "after",
      }
    )
  );
};

const deleteBookmark = (bookmarkId, userId) => {
  return wrapper(BookMark.findOneAndDelete({ _id: bookmarkId, userId }));
};

module.exports = {
  readAll,
  update,
  create,
  deleteBookmark,
  wrapper,
  readOne,
};
