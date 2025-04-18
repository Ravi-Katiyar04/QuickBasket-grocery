import React from 'react'
import { assets , footerLinks} from '../assets/assets'
const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 bg-blue-200/30">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <img className="h-12" src={assets.logo} alt="Logo" />
                    <p className="max-w-[410px] mt-6">Our mission is to make grocery shopping easier, faster, and more affordable. We source fresh and quality products, ensuring every order meets the highest standards of hygiene and trust.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © QuickBasket.dev All Right Reserved.
            </p>
        </div>
    );
}

export default Footer
