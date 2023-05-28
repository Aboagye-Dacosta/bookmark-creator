const formidable = require("formidable");
const BookmarkModel = require("../model/bookmark/bookmark.model");
const path = require("path");
const fs = require("fs");

async function httpCreateBookmark(req, res) {
  const formData = formidable({
    multiples: true,
    allowEmptyFiles: true,
    keepExtensions: true,
    uploadDir: path.join(__dirname, "..", "assets"),
    filename: function (name, ext) {
      return `${req.user.user_id}${name}${ext}`;
    },
  });

  formData.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(200).json({
        status: false,
        message: "sorry could not save data",
      });
    }
    const { title, description, type, link } = fields;

    if (!(title && description && type && link)) {
      return res.status(400).json({
        message: "link, description, type, and title are required",
        status: false,
      });
    }

    let image = "";

    if (Object.keys(file).length > 0) {
      const { newFilename } = file?.image;
      if (newFilename) {
        image = `${process.env.APP_URL}/images/${newFilename}`;
      }
    }

    const bookmark = {
      title,
      description,
      type,
      link,
      userId: req.user.user_id,
      image,
      date: new Date().toISOString(),
    };

    const loadedResponse = await BookmarkModel.create(bookmark);
    return res.status(200).json({
      data: loadedResponse,
      message: "successful",
      status: true,
    });
  });
  // const { title, description, type, image, link, userId } = req.body;
}

async function httpReadAllBookmarks(req, res) {
  const userId = req.user.user_id;
  if (!userId) {
    return res.status(200).json({
      message: "unauthorized",
      status: false,
    });
  }

  try {
    const bookmarks = await BookmarkModel.readAll(userId);
    return res.status(200).json({
      data: bookmarks,
      status: true,
      message: "successful",
    });
  } catch (error) {
    return res.status(200).json({
      data: bookmarks,
      status: false,
      message: "sorry could not perform operation",
    });
  }
}

const httpUpdateBookmark = async (req, res) => {
  const formData = formidable({
    multiples: true,
    allowEmptyFiles: true,
    keepExtensions: true,
    uploadDir: path.join(__dirname, "..", "assets"),
    filename: function (name, ext) {
      return `${req.user.user_id}${name}${ext}`;
    },
  });

  formData.parse(req, async (err, fields, file) => {
    if (err) {
      return res.status(200).json({
        status: false,
        message: "sorry could not save data",
      });
    }

    let fileImage = null;

    if (Object.keys(file).length > 0) {
      const { newFilename } = file?.image;
      if (newFilename) {
        fileImage = `${process.env.APP_URL}/images/${newFilename}`;
      }
    }

    if (fileImage) {
      fields.image = fileImage;
    }

    if (Object.prototype.hasOwnProperty.call(fields, "staled")) {
      if (fields.staled == "true") fields.staled = true;
      if (fields.staled == "false") fields.staled = false;
    }

    const bookmark = {
      ...fields,
      userId: req.user.user_id,
    };

    try {
      const loadedResponse = await BookmarkModel.update(bookmark);
      return res.status(200).json({
        data: loadedResponse,
        message: "successful",
        status: true,
      });
    } catch (error) {
      return res.status(200).json({
        message: "sorry could not perform operation",
        status: false,
      });
    }
  });
};

const httpDeleteBookmark = async (req, res) => {
  const userId = req.user.user_id;
  const { id } = req.params;

  if (!userId) {
    return res.status(200).json({
      status: false,
      message: "Unauthorized",
    });
  }
  if (!id) {
    return res.status(200).json({
      status: false,
      message: "could not find bookmark",
    });
  }

  const bookmark = await BookmarkModel.readOne({ _id: id });

  if (bookmark.image) {
    try {
      const filename = bookmark.image.replace(
        `${process.env.APP_URL}/images/`,
        ""
      );

      const res = fs.unlinkSync(path.join(__dirname, "..", "assets", filename));

    } catch (error) {
      console.log(error);
      return res.status(200).json({
        status: false,
        message: "sorry something happened",
      });
    }
  }

  try {
    const bookmark = await BookmarkModel.deleteBookmark(id, userId);
    if (bookmark) {
      return res.status(200).json({
        status: true,
        message: "bookmark delete successful",
      });
    }
  } catch (error) {
    return res.status(200).json({
      status: false,
      message: "bookmark delete failed",
    });
  }
};

module.exports = {
  httpCreateBookmark,
  httpReadAllBookmarks,
  httpUpdateBookmark,
  httpDeleteBookmark,
};
