import React, { useEffect, useState } from "react";
import cross_icon from "../assets/cross_icon.png";
import { Trash2, Eye, Package } from "lucide-react";

const ProductList = () => {
  const [allproducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const resp = await fetch("http://localhost:3000/allproducts");
      const data = await resp.json();
      setAllProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const remove_product = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await fetch('http://localhost:3000/remove-product', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      });
      await fetchInfo();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-luxury-charcoal mb-2">
          Product Inventory
        </h1>
        <p className="text-luxury-charcoal/60">
          Manage and view all products in your store
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card-luxury">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-charcoal/60 text-sm font-medium">Total Products</p>
              <p className="text-3xl font-bold text-luxury-gold">{allproducts.length}</p>
            </div>
            <Package size={32} className="text-luxury-gold/30" />
          </div>
        </div>
        <div className="card-luxury">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-luxury-charcoal/60 text-sm font-medium">Stock Value</p>
              <p className="text-3xl font-bold text-luxury-gold">
                ₹{allproducts.reduce((sum, p) => sum + (p.new_price * (p.quantity || 1)), 0).toLocaleString()}
              </p>
            </div>
            <Eye size={32} className="text-luxury-gold/30" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="card-luxury flex items-center justify-center py-12">
          <p className="text-luxury-charcoal/60">Loading products...</p>
        </div>
      ) : allproducts.length > 0 ? (
        <div className="card-luxury overflow-x-auto">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-luxury-charcoal text-luxury-cream font-semibold text-sm rounded-t-lg sticky top-0">
            <div className="col-span-2">Image</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-2 text-center">Original Price</div>
            <div className="col-span-2 text-center">Sale Price</div>
            <div className="col-span-2 text-center">Category</div>
            <div className="col-span-2 text-center">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-luxury-light-gray/50">
            {allproducts.map((product, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 md:px-6 py-4 hover:bg-luxury-cream/50 transition-colors"
              >
                {/* Mobile Label + Image */}
                <div className="md:col-span-2">
                  <div className="md:hidden text-xs font-semibold text-luxury-charcoal/60 mb-1">Image</div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full md:w-16 h-16 md:h-16 object-cover rounded-lg"
                  />
                </div>

                {/* Mobile Label + Name */}
                <div className="md:col-span-2">
                  <div className="md:hidden text-xs font-semibold text-luxury-charcoal/60 mb-1">Name</div>
                  <p className="font-medium text-luxury-charcoal truncate">
                    {product.name}
                  </p>
                </div>

                {/* Mobile Label + Old Price */}
                <div className="md:col-span-2">
                  <div className="md:hidden text-xs font-semibold text-luxury-charcoal/60 mb-1">Original</div>
                  <p className="text-sm line-through text-luxury-charcoal/50 md:text-center">
                    ₹{product.old_price}
                  </p>
                </div>

                {/* Mobile Label + New Price */}
                <div className="md:col-span-2">
                  <div className="md:hidden text-xs font-semibold text-luxury-charcoal/60 mb-1">Sale Price</div>
                  <p className="text-sm font-bold text-luxury-gold md:text-center">
                    ₹{product.new_price}
                  </p>
                </div>

                {/* Mobile Label + Category */}
                <div className="md:col-span-2">
                  <div className="md:hidden text-xs font-semibold text-luxury-charcoal/60 mb-1">Category</div>
                  <div className="inline-block px-3 py-1 bg-luxury-gold/10 text-luxury-gold text-xs font-semibold rounded-full md:flex md:justify-center">
                    {product.category}
                  </div>
                </div>

                {/* Remove Button */}
                <div className="md:col-span-2 flex justify-center">
                  <button
                    onClick={() => remove_product(product.id)}
                    className="p-2.5 hover:bg-luxury-rose-gold/10 text-luxury-rose-gold rounded-lg transition-all"
                    title="Delete product"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card-luxury flex flex-col items-center justify-center py-12">
          <Package size={48} className="text-luxury-gold/30 mb-4" />
          <p className="text-luxury-charcoal/60 font-medium">No products found</p>
          <p className="text-sm text-luxury-charcoal/40">Start by adding your first product</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
