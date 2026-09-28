import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import ProductDetails from "../Components/ProductDetails";
import ProductDescription from "../Components/productDescripton";
import RelatedProduct from "../Components/RelatedProduct";
import { ArrowLeft } from "lucide-react";

const Product = () => {
  const { all_product } = useContext(ShopContext);
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = all_product.find((item) => item.id === Number(productId));

  if (!product) {
    return (
      <div className="manga-grid flex min-h-[65vh] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="anime-display mb-4 text-4xl text-[#c9ff3d]">
            Product Not Found
          </h1>
          <p className="mb-8 max-w-md text-white/60">
            Sorry, we couldn't find the product you're looking for. It may have been removed or the link might be incorrect.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="acid-button"
          >
            <ArrowLeft size={20} />
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#101114]">
      <ProductDetails product={product} />
      <ProductDescription />
      <RelatedProduct category={product.category} />
    </div>
  );
};

export default Product;
