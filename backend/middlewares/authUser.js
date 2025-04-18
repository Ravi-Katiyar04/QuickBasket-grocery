
import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
    
    // Check if the request has cookies
    const { token } = req.cookies;

    // Check if the token is present in the request cookies
    if (!token) {
        return res.status(401).json({ message: "Unauthorized User" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.id) {
            // Instead of setting req.body.userId, assign directly to req.userId
            req.userId = decoded.id;
        } else {
            return res.status(401).json({success: false, message: "Unauthorized User" });
        }
        return next();
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
};

export default authUser;

