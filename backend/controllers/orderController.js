import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const placedOrderCOD= async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if( !address || items.length === 0) {
            return res.json({success: false, message: "Invalid order data" });
        }

        let amount= await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            const currentAcc = await acc; // Wait for the previous promise to resolve
            return currentAcc + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02); // Adding 2% TAX

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "cod",
        });
        return res.json({success: true, message: "Order placed successfully" });
        

    } catch (error) {
        console.error("Error creating order:", error.message);
        return res.json({success: false, message: error.message });
    }
}

export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req;
        const orders = await Order.find({ userId, $or: [{ paymentType: "cod" }, { isPaid: "true" }] }).populate("items.product address").sort({ createdAt: -1 });

        res.json({success: true, orders: orders});
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.json({success: false, message: error.message });
    }
}


export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find( {$or: [{ paymentType: "cod" }, { isPaid: "true" }]}).populate("items.product").populate("address").sort({ createdAt: -1 });
        res.json({success: true, orders: orders});
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.json({ success: false, message: error,message });
    }
}