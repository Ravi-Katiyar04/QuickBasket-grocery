import React from 'react'
import ProductCard from './ProductCard'
import { useAppCOntext } from '../context/AppContext'

const BestSeller = () => {

    const { products } = useAppCOntext();
    return (
        <div className='mt-10'>
            <h2 className='text-2xl lg:text-3xl font-medium'>Best Sellers</h2>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-5 lg:gap-6 mt-6'>
                {products.filter((product) => product.inStock).slice(0, 5).map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller
