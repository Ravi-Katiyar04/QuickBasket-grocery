import express from "express";
const userRouter = express.Router();
import { registerUser, loginUser, logout,isAuthenticated } from "../controllers/UserController.js";
import authUser  from "../middlewares/authUser.js";


userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/is-authenticated", authUser, isAuthenticated);

userRouter.get("/logout", authUser, logout);



export default userRouter;



