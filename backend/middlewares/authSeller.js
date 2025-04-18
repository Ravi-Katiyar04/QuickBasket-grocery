import jwt from "jsonwebtoken";

const authSeller = (req, res, next) => {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
        return res.status(401).json({ message: "Unauthorized Seller" });
    }

    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        
        if (decoded.email === process.env.SELLER_EMAIL) {
            return next(); 

        } else {
            return res.status(401).json({success:false,  message: "Unauthorized Seller" });
        }
        
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}

export default authSeller ;