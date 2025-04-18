import express from 'express';
const cartRouter = express.Router();
import {updateCart} from '../controllers/cartController.js'; // Import the updateCart controller function
import authUser from '../middlewares/authUser.js';

cartRouter.post('/update',authUser, updateCart); // update the cart


export default cartRouter; // Export the cart router