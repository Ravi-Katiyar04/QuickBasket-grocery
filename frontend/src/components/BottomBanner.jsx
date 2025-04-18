import React from 'react'
import { assets, features } from '../assets/assets'

const BottomBanner = () => {
    return (
        <div className='relative mt-24'>
            <img src={assets.bottom_banner_image} alt="bottomBanner" className='w-full hidden md:block' />
            <img src={assets.bottom_banner_image_sm} alt="bottomBanner" className='w-full md:hidden' />

            <div className='absolute inset-0 flex flex-col items-center md:items-end justify-start md:justify-center pt-16 md:pt-0 md:pr-24'>
                <div>
                    <h2 className='text-primary text-2xl md:text-3xl font-semibold mb-6'>Why We Are the Best?</h2>
                    {features.map((feature, index) => (
                        <div key={index} className='flex items-center gap-4 mt-2'>
                            <img src={feature.icon} alt={feature.title} className='w-9 md:w-12' />
                            <div>
                                <h3 className='text-lg md:text-2xl font-semibold'>{feature.title}</h3>
                                <p className='text-gray-500 text-xs md:text-sm'>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default BottomBanner
