import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.json({success: false, message: "All fields are required" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({success: false, message: "User already exists" });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", 
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",  // Prevents the cookie from being sent over insecure connections
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
        });
       
        return res.status(201).json({success: true, message: "User registered successfully", user: { id: newUser._id, name: newUser.name, email: newUser.email} });

    } catch (error) {
        console.error("Error registering user:", error.message);
        res.json({ message: "Error registering user", error });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({success: false, message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({success: false, message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        res.cookie("token", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", 
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",  // Prevents the cookie from being sent over insecure connections
            maxAge: 24 * 60 * 60 * 1000, // Cookie expiration time (1 day)
        });
        return res.json({success: true, message: "Login successful", user:{name: user.name, email: user.email} });
    } catch (error) {
        console.error("Error logging in:", error.message);
        res.json({success: false, message: "Error logging in", error });
    }
}


export const isAuthenticated = async (req, res) => {
    try {
        const {userId} = req; 
        // console.log("User ID from request body:", userId); // Log the userId for debugging
        const user = await User.findById(userId).select("-password"); // Exclude password from the response
        if (!user) {
            return res.json({success: false, message: "Unauthorized User" });
        }
        return res.json({success: true, message: "User is authenticated", user });

    } catch (error) {
        console.error("Error checking authentication:", error.message);
        res.json({success: false, message: error.message }); // Return a generic error messagesuccess: false, message:error.message });
    }
}


export const logout= async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict",
            expires: new Date(Date.now()),
        });
        return res.json({success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out:", error.message);
        res.json({success:false, message: error.message });
    }
}