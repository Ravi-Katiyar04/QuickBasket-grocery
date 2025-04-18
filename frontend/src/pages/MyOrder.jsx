import React from 'react'
import { useState, useEffect } from 'react'
import { useAppCOntext } from '../context/AppContext'
const MyOrder = () => {

    const [myOders, setMyOders] = useState([])
    const { currency, user, axios } = useAppCOntext();

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get("/api/order/user");
            if (data.success) {
                setMyOders(data.orders);
            }
        } catch (error) {
            console.error("Error fetching orders:", error.message);   
        }
    }

    useEffect(() => {
        if (user) {
            fetchMyOrders();
        }
    }, [user]);


    return (
        <div className="my-10">
            <h2 className='text-2xl lg:text-3xl font-medium  uppercase'>My Orders</h2>
            <div className='w-16 h-1 bg-primary rounded-full mb-10'></div>

            {myOders.map((order, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-8 py-5 ">
                    <p className="flex justify-between md:items-center text-gray-400 mb-6 text-sm md:text-base">
                        <span className='font-medium'>OrderID: {order._id}</span>
                        <span className='font-medium '>Payment: {order.paymentType}</span>
                        <span className='font-medium'>TotalAmount: {currency} {order.amount}</span>
                    </p>

                    {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center my-3">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                <div className="bg-blue-200/30 rounded-lg p-4">
                                    <img src={item.product.image[0]} alt={item.product.name} className="w-16 h-16 object-cover" />
                                </div>
                                <div>
                                    <h2>{item.product.name}</h2>
                                    <p>Category: {item.product.category}</p>

                                </div>
                            </div>

                            <div className="flex flex-col">
                                <p className="text-gray-400 text-sm">Quantity: {item.quantity || "1"}</p>
                                <p className={` ${order.status === "Delivered" ? "text-green-500" : "text-gray-400"}`} >Status: {order.status}</p>
                                <p className="text-gray-400 text-sm"> Date: {new Date(order.createdAt).toLocaleDateString() }</p>
                            </div>

                            <div className="text-primary font-medium text-lg">
                                <p>Amount: {currency} {item.product.offerPrice * item.quantity}</p>
                            </div>
 
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default MyOrder
