
import { useState, useEffect } from 'react'
import { useAppCOntext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const [state, setState] = useState("login");
    const { isSellar, setIsSellar, navigate, axios } = useAppCOntext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const { data } = await axios.post('/api/seller/login', {
                email,
                password
            });
            console.log(data);
            if (data.success === true) {
                toast.success(data.message);
                setIsSellar(true);
                navigate("/seller");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
        if (isSellar) {
            navigate("/seller");
        }
    }, [isSellar]);



    return !isSellar && (
        <div className='fixed top-0 bottom-0 left--0 w-full left-0 z-30 flex items-center text-sm text-gray-600 bg-slate-300'>
            <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">Seller</span> {state === "login" ? "Login" : "Sign Up"}
                </p>

                <div className="w-full ">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="email" required />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" type="password" required />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )}
                <button className="bg-primary hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    );
}

export default SellerLogin
