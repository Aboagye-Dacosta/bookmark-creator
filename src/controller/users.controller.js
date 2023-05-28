const UserModel = require("../model/user/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const APP_SECRETE = process.env.APP_SECRETE;

const httpSaveUser = async (req, res) => {
  const { username, password, email, confirmPassword } = req.body;

  if (!(username && password && email && confirmPassword)) {
    return res.status(200).json({
      status: false,
      message: "all the fields are required",
    });
  }

  if (password != confirmPassword) {
    return res.status(200).json({
      status: false,
      message: "password does not match",
    });
  }

  const oldUser = await UserModel.read({ email });

  if (oldUser) {
    return res.status(200).json({
      status: false,
      message: "you already own an account please login",
    });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = {
    username,
    email,
    password: encryptedPassword,
  };

  const token = jwt.sign({ email }, APP_SECRETE, {
    expiresIn: "24h",
  });
  // save user token
  user.token = token;

  const returnUser = await UserModel.create(user);

  delete returnUser.password;
  return res.status(200).json({
    data: returnUser,
    status: true,
    message: "account created successfully",
  });
};

const httpLoginUser = async (req, res) => {
  const { email, password } = req.body;


  if (!(email && password)) {
    return res.status(200).json({
      status: false,
      message: "all the fields are required",
    });
  }

  const user = await UserModel.read({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ email }, APP_SECRETE, {
      expiresIn: "24h",
    });

    user.token = token;

    return res.status(200).json({
      status: true,
      message: "login successful",
      data: user,
    });
  }

  return res.status(200).json({
    status: false,
    message: "account does not exit please register for one",
  });
};

module.exports = {
  httpSaveUser,
  httpLoginUser,
};
