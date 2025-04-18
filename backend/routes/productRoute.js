import express from "express";
import {upload} from "../configs/multer.js"; // Import the multer middleware for file uploads
import authSeller from "../middlewares/authSeller.js"; // Import the authentication middleware for sellers
const productRouter = express.Router();
import { addProduct, productList, productById, changeStock} from "../controllers/ProductController.js";


productRouter.post("/add", upload.array(["images"]), authSeller, addProduct); // Create a new product
productRouter.get("/list", productList); // Get all products
productRouter.get("/id", productById); // Update a product by ID
productRouter.post("/stock", authSeller, changeStock);



export default productRouter; // Export the product router