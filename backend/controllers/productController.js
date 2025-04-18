import Product from "../models/Product.js";
import {v2 as cloudinary} from "cloudinary";

export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);

        const images= req.files;

        let imagesURl= await Promise.all(
            images.map(async (image) => {
                let result = await cloudinary.uploader.upload(image.path, {
                    resource_type: "image",
                });
                return result.secure_url;
            })
        );

        await Product.create({
            ...productData,
            image: imagesURl,
        });

        res.json({success: true, message: "Product added successfully" });

    } catch (error) {
        console.error("Error adding product:", error.message);
        return res.status(500).json({ message: "Error adding product", error });
    }
}


export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json({success:true , products: products});

    } catch (error) {
        console.error("Error fetching products:", error.message);
        return res.status(500).json({ message: "Error fetching products", error });
    }
}


export const productById = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await Product.findById(id);
        res.status(200).json(product);

    } catch (error) {
        console.error("Error fetching product:", error.message);
        return res.status(500).json({ message: "Error fetching product", error });
    }
}

export const changeStock = async (req, res) => {
    try {
        const {id, inStock} = req.body;
        await Product.findByIdAndUpdate(id, { inStock });
        res.json({ success:true, message: "Stock updated successfully" });
    } catch (error) {
        console.error("Error updating stock:", error.message);
        return res.json({success:true, message: error.message });
    }

}