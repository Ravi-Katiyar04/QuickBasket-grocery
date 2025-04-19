import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import stripe from "stripe";

export const placedOrderCOD= async (req, res) => {
    try {
        const {  items, address } = req.body;
        const {userId} = req;
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
            paymentType: "COD",
        });
        return res.json({success: true, message: "Order placed successfully" });
        

    } catch (error) {
        console.error("Error creating order:", error.message);
        return res.json({success: false, message: error.message });
    }
}


export const placedOrderStripe= async (req, res) => {
    try {
        const {  items, address } = req.body;
        const {userId} = req;

        const {origin} = req.headers;
        if( !address || items.length === 0) {
            return res.json({success: false, message: "Invalid order data" });
        }

        let productData= [];

        let amount= await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            const currentAcc = await acc; // Wait for the previous promise to resolve
            return currentAcc + product.offerPrice * item.quantity;
        }, 0);

        amount += Math.floor(amount * 0.02); // Adding 2% TAX

        const order=await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        const stripeInstance =new stripe(process.env.STRIPE_SECRET_KEY);

        const line_items= productData.map((item) => {
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100,
                },
                quantity: item.quantity,
            };
        });

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            },
        });


        return res.json({success: true, url: session.url });
    
    } catch (error) {
        console.error("Error creating order:", error.message);
        return res.json({success: false, message: error.message });
    }
}

export const getUserOrders = async (req, res) => {
    try {
        
        const { userId } = req;
        const orders = await Order.find({ userId, $or: [{ paymentType: "COD" }, { isPaid: "true" }] }).populate("items.product").populate("address").sort({ createdAt: -1 });

        console.log("User orders:", orders);

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

export const stripeWebhook = async (req, res) => {  
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripeInstance.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Handle the event based on its type
    switch (event.type) {
        case 'payment_intent.succeeded':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session= await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId, userId} = session.data[0].metadata;

            await Order.findByIdAndUpdate(orderId, {isPaid: true});

            await User.findByIdAndUpdate(userId, {cartItems: {}});

            break;
        }
         case 'payment_intent.payment_failed':{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            const session= await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });
            const {orderId} = session.data[0].metadata;

            await Order.findByIdAndUpdate(orderId);

            break;
         }    
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
}