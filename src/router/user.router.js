const UserController = require("../controller/users.controller");
const { Router } = require("express");

const userRouter = Router();

userRouter.post("/register", UserController.httpSaveUser);
userRouter.post("/login", UserController.httpLoginUser);
module.exports = userRouter;
