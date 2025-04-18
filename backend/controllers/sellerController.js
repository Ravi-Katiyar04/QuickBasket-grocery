import jwt from "jsonwebtoken";

export const sellerLogin = async (req, res) => {

    const { email, password } = req.body;
    if (email !== process.env.SELLER_EMAIL || password !== process.env.SELLER_PASSWORD) {
        return res.json({ success: false, message: "Invalid email or password" });
    }
    try {
        const token = jwt.sign({ email }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.json({success:false, message: error.message });
    }
}


export const isSellerAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({success: true, message: "Seller is authenticated" });

    } catch (error) {
        return res.status(401).json({success: false, message: error.message });
    }
}


export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });
        return res.status(200).json({success: true, message: "Seller logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}