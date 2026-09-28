import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function ProductDetails({ product }) {
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useContext(ShopContext);
  const discount = product.old_price
    ? Math.round(
        ((product.old_price - product.new_price) / product.old_price) * 100,
      )
    : 0;
  const add = () => {
    if (!size) return;
    addToCart(product.id, size, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="min-h-screen pb-16 pt-6 sm:pt-9">
      <div className="section-wrap">
        <Link
          to="/shop"
          className="mb-5 inline-flex items-center gap-2 text-xs text-white/45 hover:text-[#c9ff3d]"
        >
          <ArrowLeft size={14} /> Back to the archive
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-14">
          <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#1a1c22]">
            <img
              src={product.image}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=900&q=85";
              }}
              className="aspect-[4/4.5] w-full object-cover sm:aspect-[4/3.7] lg:aspect-[4/4.6]"
            />
            {discount > 0 && (
              <span className="absolute left-4 top-4 bg-[#c9ff3d] px-3 py-1.5 font-mono text-xs font-bold text-[#101114]">
                -{discount}% / QUEST BONUS
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <p className="eyebrow mb-3">
              {product.category} department / item #
              {String(product.id).padStart(3, "0")}
            </p>
            <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-5xl">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 border-b border-white/10 pb-6">
              <span className="mono text-2xl font-bold text-[#c9ff3d]">
                ₹{Number(product.new_price).toFixed(0)}
              </span>
              {product.old_price > product.new_price && (
                <span className="mono text-sm text-white/35 line-through">
                  ₹{Number(product.old_price).toFixed(0)}
                </span>
              )}
              <span className="text-xs text-[#c9ff3d]">
                ★★★★★ <span className="text-white/40">(fan rating)</span>
              </span>
            </div>
            <p className="my-6 max-w-xl text-sm leading-7 text-white/60">
              A fresh addition to your everyday rotation. Easy to style,
              comfortable to wear, and ready to become a favorite in your next
              fit check.
            </p>
            <label
              htmlFor="product-size"
              className="mb-2 text-xs font-bold uppercase tracking-[.16em] text-white/65"
            >
              Choose your size
            </label>
            <select
              id="product-size"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              className="shop-input mb-5 max-w-sm"
              required
            >
              <option value="" disabled>
                Select a size
              </option>
              {SIZES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-[.16em] text-white/65">
                Quantity
              </span>
              <div className="flex items-center rounded border border-white/15">
                <button
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  className="grid h-11 w-11 place-items-center text-lg hover:bg-white/5"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="mono w-10 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((value) => value + 1)}
                  className="grid h-11 w-11 place-items-center text-lg hover:bg-white/5"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={add}
              disabled={!size}
              className={`acid-button w-full sm:max-w-sm ${added ? "!bg-[#9e7bff] !text-white" : "disabled:cursor-not-allowed disabled:opacity-40"}`}
            >
              {added ? (
                <>
                  <Check size={18} /> Added to bag
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> Add to bag
                </>
              )}
            </button>
            <div className="mt-7 grid max-w-lg grid-cols-2 gap-3">
              <div className="rounded border border-white/10 bg-[#17191e] p-3">
                <Truck size={17} className="mb-2 text-[#c9ff3d]" />
                <p className="m-0 text-xs font-bold">Shipping included</p>
                <p className="m-0 mt-1 text-[11px] text-white/40">
                  Free delivery on ₹999+
                </p>
              </div>
              <div className="rounded border border-white/10 bg-[#17191e] p-3">
                <RotateCcw size={17} className="mb-2 text-[#9e7bff]" />
                <p className="m-0 text-xs font-bold">Easy returns</p>
                <p className="m-0 mt-1 text-[11px] text-white/40">
                  7 day return window
                </p>
              </div>
            </div>
          </div>
        </div>
        <section className="mt-14 border-t border-white/10 pt-8">
          <p className="eyebrow mb-2">The fine print</p>
          <h2 className="text-2xl font-bold">Made for everyday replays.</h2>
          <p className="max-w-2xl text-sm leading-6 text-white/50">
            Choose your usual size for a comfortable fit. This product is part
            of our demo storefront, so orders are simulated and no payment is
            collected.
          </p>
        </section>
      </div>
    </main>
  );
}
