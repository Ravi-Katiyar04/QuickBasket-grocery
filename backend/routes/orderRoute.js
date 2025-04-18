import express from 'express';
import { placedOrderCOD, getUserOrders , getAllOrders} from '../controllers/orderController.js'; // Import the order controller functions
import authUser from '../middlewares/authUser.js'; // Import the authentication middleware
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();


// Route to create a new order
orderRouter.post('/cod', authUser, placedOrderCOD); 

// Route to get all orders for a user
orderRouter.get('/user', authUser, getUserOrders);

// Route to get all orders for admin
orderRouter.get('/seller', authSeller, getAllOrders); // For admin



export default orderRouter;