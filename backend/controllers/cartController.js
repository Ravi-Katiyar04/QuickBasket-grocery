
import User from "../models/User.js";

export const updateCart = async (req, res) => {

    try {
        const { cartItems } = req.body;
        const {userId}= req;

        await User.findByIdAndUpdate(userId, { cartItems });

        return res.json({success: true, message: "Cart updated successfully" });
        
    } catch (error) {
        return res.json({success: false, message: error.message });
    }

}