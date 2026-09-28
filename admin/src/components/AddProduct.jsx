import React, { useState } from "react";
import upload_area from '../assets/upload_area.svg'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const AddProduct = () => {
  const [image, setImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [productDetails, setproductDetails] = useState({
    name: "",
    image: "",
    category: "Women",
    old_price: "",
    new_price: "",
  });

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setproductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      let responseData;
      let product = productDetails;

      let formData = new FormData();
      formData.append('product', image);

      const uploadResp = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          headers:{
              Accept: 'application/json',
          },
          body:formData,
      });
      
      responseData = await uploadResp.json();

      if(responseData.success){
          product.image = responseData.image_url;
          const addResp = await fetch('http://localhost:3000/add-product', {
              method: 'POST',
              headers:{
                  Accept: 'application/json',
                  'Content-Type': 'application/json', 
              },
              body:JSON.stringify(product),
          });
          
          const addData = await addResp.json();
          
          if(addData.success){
              setMessage("Product added successfully!");
              setproductDetails({
                name: "",
                image: "",
                category: "Women",
                old_price: "",
                new_price: "",
              });
              setImage(false);
          } else {
              setError("Failed to add product");
          }
      } else {
          setError("Failed to upload image");
      }
    } catch (err) {
      setError("An error occurred while adding the product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const discount = productDetails.old_price && productDetails.new_price 
    ? Math.round(((productDetails.old_price - productDetails.new_price) / productDetails.old_price) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-luxury-charcoal mb-2">
          Add New Product
        </h1>
        <p className="text-luxury-charcoal/60">Create and upload a new product to your store</p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg animate-fadeInUp">
          <CheckCircle size={20} className="text-luxury-gold flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-luxury-gold">{message}</p>
        </div>
      )}
      
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-luxury-rose-gold/10 border border-luxury-rose-gold/30 rounded-lg animate-fadeInUp">
          <AlertCircle size={20} className="text-luxury-rose-gold flex-shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-luxury-rose-gold">{error}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="card-luxury space-y-6">
        {/* Product Title */}
        <div>
          <label className="block text-sm font-semibold text-luxury-charcoal mb-2.5">
            Product Title *
          </label>
          <input
            value={productDetails.name}
            onChange={changeHandler}
            type="text"
            name="name"
            placeholder="Enter product name"
            className="w-full px-4 py-2.5 border border-luxury-light-gray text-luxury-charcoal placeholder-luxury-charcoal/40 rounded-lg focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all"
            required
          />
        </div>

        {/* Price Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-luxury-charcoal mb-2.5">
              Original Price *
            </label>
            <input
              value={productDetails.old_price}
              onChange={changeHandler}
              type="number"
              name="old_price"
              placeholder="Enter original price"
              className="w-full px-4 py-2.5 border border-luxury-light-gray text-luxury-charcoal placeholder-luxury-charcoal/40 rounded-lg focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-luxury-charcoal mb-2.5">
              Sale Price *
            </label>
            <input
              value={productDetails.new_price}
              onChange={changeHandler}
              type="number"
              name="new_price"
              placeholder="Enter sale price"
              className="w-full px-4 py-2.5 border border-luxury-light-gray text-luxury-charcoal placeholder-luxury-charcoal/40 rounded-lg focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all"
              required
            />
          </div>
        </div>

        {/* Discount Display */}
        {discount > 0 && (
          <div className="p-4 bg-luxury-gold/10 border border-luxury-gold/30 rounded-lg">
            <p className="text-sm font-semibold text-luxury-gold">
              💰 Discount: {discount}% off
            </p>
          </div>
        )}

        {/* Category Select */}
        <div>
          <label className="block text-sm font-semibold text-luxury-charcoal mb-2.5">
            Category *
          </label>
          <select
            value={productDetails.category}
            onChange={changeHandler}
            name="category"
            className="w-full px-4 py-2.5 border border-luxury-light-gray text-luxury-charcoal rounded-lg focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold/20 transition-all cursor-pointer"
            required
          >
            <option value="Women">Women</option>
            <option value="Men">Men</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-luxury-charcoal mb-2.5">
            Product Image *
          </label>
          <label
            htmlFor="file-input"
            className="cursor-pointer border-2 border-dashed border-luxury-light-gray p-8 rounded-lg flex flex-col justify-center items-center hover:border-luxury-gold hover:bg-luxury-gold/5 transition-all group"
          >
            <div className="text-center">
              {image ? (
                <>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="h-32 w-32 object-cover rounded-lg mx-auto mb-3"
                  />
                  <p className="text-sm font-semibold text-luxury-gold">
                    ✓ Image selected
                  </p>
                  <p className="text-xs text-luxury-charcoal/60 mt-1">
                    {image.name}
                  </p>
                </>
              ) : (
                <>
                  <Upload size={32} className="text-luxury-gold/60 mx-auto mb-3 group-hover:text-luxury-gold transition-colors" />
                  <p className="text-sm font-semibold text-luxury-charcoal mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-luxury-charcoal/60">
                    PNG, JPG or GIF (max 5MB)
                  </p>
                </>
              )}
            </div>
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name="image"
            id="file-input"
            accept="image/*"
            hidden
            required
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={Add_Product}
          disabled={loading || !productDetails.name || !productDetails.old_price || !productDetails.new_price || !image}
          className="w-full py-3 bg-luxury-gold text-luxury-charcoal font-bold rounded-lg hover:bg-luxury-gold/90 shadow-luxury transition-all hover:shadow-luxury-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
