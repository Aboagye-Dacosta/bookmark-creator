const jwt = require("jsonwebtoken");
const UserModel = require("../model/user/user.model");

const authenticate = async (req, res, next) => {
  const token =
    req.body?.toke || req.query?.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(200).json({
      status: false,
      message: "Unauthorized",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.APP_SECRETE);
    req.user = decode;
    const user = await UserModel.read({ email: decode.email });
    req.user.user_id = user._id;
  } catch (err) {
    return res.status(200).json({
      status: false,
      message: "Unauthorized",
    });
  }

  next();
};

module.exports = authenticate;
