import express from "express";

const sellerRoute= express.Router();
import {sellerLogin, isSellerAuthenticated, sellerLogout } from "../controllers/sellerController.js";
import authSeller from "../middlewares/authSeller.js";

sellerRoute.post("/login", sellerLogin);

sellerRoute.get("/is-auth", authSeller, isSellerAuthenticated);

sellerRoute.get("/logout", authSeller, sellerLogout);


export default sellerRoute;