// import React, { useState , useEffect} from 'react'
import { categories } from '../assets/assets'
import { useAppCOntext } from '../context/AppContext'

const Categories = () => {

    const { navigate } = useAppCOntext()

    return (
        <div className="mt-16">
            <p className="text-2xl md:text-3xl font-medium">Categories</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6">

                {categories.map((item, index) => {
                    return (
                        <div key={index} className="group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col items-center justify-center border border-gray-200 hover:border-gray-300 transition duration-200 ease-in-out"
                        style={{ backgroundColor: item.bgColor }}
                            onClick={() => {
                                navigate(`/products/${item.path.toLowerCase()}`);
                                window.scrollTo(0,0);
                            }}
                        >
                            <img src={item.image} alt={item.text} className="group-hover:scale-110 transition duration-200 ease-in-out max-w-28" />
                            <p className="text-sm font-medium">{item.text}</p>
                        </div>
                    );
                })}


            </div>
        </div>
    )
}

export default Categories
