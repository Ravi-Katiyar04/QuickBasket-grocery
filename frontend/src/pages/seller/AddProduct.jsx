import React from 'react'
import { useState } from 'react';
import { assets, categories } from '../../assets/assets';
import { useAppCOntext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddProduct = () => {

    const[files, setFiles] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [offerPrice, setOfferPrice] = useState("");
    const {axios} = useAppCOntext();

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const productData= {
                name,
                description: description.split("\n"),
                category,
                price,
                offerPrice
            };
            const formData = new FormData();
            formData.append("productData", JSON.stringify(productData));

            for (let i = 0; i < files.length; i++) {
                formData.append("images", files[i]);
            }

            const {data} = await axios.post("/api/product/add", formData);

            if (data.success) {
                toast.success(data.message);
                setFiles([]);
                setName("");
                setDescription("");
                setCategory("");
                setPrice("");
                setOfferPrice("");
            }
            else {
                toast.error(data.message);
            }


        } catch (error) {
            toast.error(error.message);
        }
        
    }

    return (
        <div className="no-scrollbar flex-1 flex flex-col md:px-14  justify-between overflow-y-scroll h-[calc(100vh-64px)] p-4">
            <h2 className="text-2xl  font-medium relative">
                Add Product
                <span className="absolute -bottom-1 left-0 w-16 rounded-full h-1 bg-primary"></span>
            </h2>
            <form onSubmit={onSubmitHandler} className="max-w-lg mt-6">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap w-full justify-between gap-6 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`} className="border border-gray-500/30 rounded flex items-center justify-center ">
                                <input onChange={(e)=> {
                                    const updatedFiles = [...files];
                                    updatedFiles[index] = e.target.files[0];
                                    setFiles(updatedFiles);
                                    }}
                                    type="file" id={`image${index}`} hidden />

                                <img className="max-w-24 cursor-pointer " src={files[index] ? URL.createObjectURL(files[index]): assets.upload_area} alt="uploadArea" width={100} height={100} />
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-1 w-full mt-4">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input onChange={(e)=> setName(e.target.value)} value={name} id="product-name" type="text" placeholder="Type here" className="outline-none py-2 px-3 rounded border border-gray-500/40" required />
                </div>
                <div className="flex flex-col gap-1 w-full mt-4">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea onChange={(e)=> setDescription(e.target.value)} value={description} id="product-description" rows={4} className="outline-none py-2 px-3 rounded border border-gray-500/40 resize-none" placeholder="Type here"></textarea>
                </div>
                <div className="w-full flex flex-col gap-1 mt-4">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select onChange={(e)=> setCategory(e.target.value)} value={category} id="category" className="outline-none py-2 px-3 rounded border border-gray-500/40">
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>
                <div className="flex items-center gap-5 flex-wrap mt-4">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input onChange={(e)=> setPrice(e.target.value)} value={price} id="product-price" type="number" placeholder="0" className="outline-none py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input onChange={(e)=> setOfferPrice(e.target.value)} value={offerPrice} id="offer-price" type="number" placeholder="0" className="outline-none py-2 px-3 rounded border border-gray-500/40" required />
                    </div>
                </div>
                <button className="px-8 py-2.5 bg-indigo-500 text-white font-medium rounded mt-4">ADD</button>
            </form>
        </div>
    );
}

export default AddProduct
