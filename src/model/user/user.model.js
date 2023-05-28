const UserModel = require("./user.mongo");
const { wrapper } = require("../bookmark/bookmark.model");

const create = (user) =>
  new Promise((resolve, reject) =>
    UserModel.findOneAndUpdate({ email: user.email }, user, {
      upsert: true,
      returnDocument: "after",
    })
      .then((bookmark) => resolve(bookmark))
      .catch((error) => reject(error))
  );

const read = (user) => wrapper(UserModel.findOne(user));

module.exports = {
  create,
  read,
};
