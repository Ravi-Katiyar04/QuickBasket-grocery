
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppCOntext } from '../context/AppContext'
import toast from "react-hot-toast";

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppCOntext()

    const handleLogout = async() => {
        try {
            const { data } = await axios.get("/api/users/logout");
            console.log(data);
            if (data.success) {
                toast.success(data.message)
                setUser(null)
                navigate('/')
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate('/products')
        }

    }, [searchQuery]);

    return (
        <nav className="flex items-center sticky top-0 z-50 justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

            <NavLink to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <img className="h-12" src={assets.logo} alt="Logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink className=" border-2 border-indigo-500 text-indigo-500 rounded-full px-4 py-1" to='/seller'>Seller Dashboard</NavLink>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">All Products</NavLink>
                <NavLink to="/contact">Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src={assets.search_icon} alt="Search" className='w-4 h-4' />
                </div>

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="Cart" className='w-6  opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (<button
                    onClick={() => setShowUserLogin(true)}
                    className="cursor-pointer px-8 py-2 bg-primary hover:bg-indigo-600 transition text-white rounded-full">
                    Login
                </button>)
                    :
                    (
                        <div className="relative group">
                            <img src={assets.profile_icon} alt="UserProfile" className='w-10 rounded-full' />
                            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow-md border-gray-200 py-2 rounded-md text-sm w-32 z-40">
                                <li onClick={() => navigate('/my-orders')} className="hover:bg-gray-200 py-2 px-4 block cursor-pointer">my orders</li>
                                {/* <li className="hover:bg-gray-200 py-2 px-4 block cursor-pointer">my profile</li> */}
                                <li onClick={handleLogout} className="hover:bg-gray-100 py-2 px-4 block cursor-pointer">logout</li>
                            </ul>
                        </div>
                    )}
            </div>

            <div className="flex items-center gap-6 sm:hidden">

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.nav_cart_icon} alt="Cart" className='w-6  opacity-80' />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-indigo-500 w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="cursor-pointer">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt="menu" />
                </button>

            </div>



            {/* Mobile Menu */}
            {open && (<div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden z-30`}>
                <NavLink to="/" onClick={() => setOpen(false)} className="block">Home</NavLink>
                <NavLink to="/products" onClick={() => setOpen(false)} className="block">All Products</NavLink>
                {user &&
                    <NavLink to="/my-order" onClick={() => setOpen(false)} className="block">My Order</NavLink>
                }
                <NavLink to="/contact" onClick={() => setOpen(false)} className="block">Contact</NavLink>
                <NavLink className="border-2 border-indigo-500 text-indigo-500 rounded-full px-4 py-1 block" to="/seller" onClick={() => setOpen(false)} >Seller Dashboard</NavLink>
                {!user ?
                    (<button onClick={() => { setOpen(false); setShowUserLogin(true); }} className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
                        Login
                    </button>)
                    :
                    (<button onClick={handleLogout} className="cursor-pointer  px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm">
                        Logout
                    </button>)
                }
            </div>)}

        </nav>
    )
}

export default Navbar
