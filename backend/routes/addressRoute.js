import express from 'express';

const addressRouter = express.Router();
import { addAddress, getAddress } from '../controllers/AddressController.js'; // Import the address controller functions
import authUser from '../middlewares/authUser.js'; // Import the authentication middleware


// Route to add a new address
addressRouter.post('/add', authUser, addAddress);
// Route to get all addresses for a user
addressRouter.get('/get', authUser, getAddress);



export default addressRouter;

