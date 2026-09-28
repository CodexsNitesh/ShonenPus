import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";

const initialShippingDetails = {
  fullName: "",
  address: "",
  city: "",
  pincode: "",
  phone: "",
};
const inputFields = [
  {
    name: "fullName",
    label: "Full name",
    placeholder: "Name for delivery",
    type: "text",
  },
  {
    name: "address",
    label: "Street address",
    placeholder: "House, street, area",
    type: "text",
  },
  { name: "city", label: "City", placeholder: "Your city", type: "text" },
  {
    name: "pincode",
    label: "PIN code",
    placeholder: "6 digit PIN",
    type: "text",
    maxLength: 6,
  },
  {
    name: "phone",
    label: "Phone number",
    placeholder: "10 digit number",
    type: "tel",
    maxLength: 10,
  },
];

export default function Checkout() {
  const { getTotalCartAmount, cartRows, clearCart } = useContext(ShopContext);
  const [shipping, setShipping] = useState(initialShippingDetails);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const update = (event) =>
    setShipping({ ...shipping, [event.target.name]: event.target.value });

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");
    if (!localStorage.getItem("token")) {
      setError("Sign in before placing your order.");
      return;
    }
    if (!cartRows.length) {
      setError("Your bag is empty.");
      return;
    }
    if (
      !/^\d{6}$/.test(shipping.pincode.trim()) ||
      !/^\d{10}$/.test(shipping.phone.trim())
    ) {
      setError("Enter a 6 digit PIN code and a 10 digit phone number.");
      return;
    }
    setBusy(true);
    try {
      // const response = await fetch("http://localhost:3000/demo-order", {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/demo-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ shippingAddress: shipping }),
      });
      const order = await response.json();
      if (response.status === 401) {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("auth:expired"));
        setError(
          "Your session expired. Your bag is still saved. Sign in again to complete this demo order.",
        );
        return;
      }
      if (!response.ok)
        throw new Error(order.message || "Unable to place this demo order");
      clearCart();
      navigate("/orders");
    } catch (requestError) {
      setError(
        requestError.message || "Unable to place your order. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-[75vh] py-8 sm:py-12">
      <div className="section-wrap">
        <Link
          to="/cart"
          className="mb-5 inline-flex items-center gap-2 text-xs text-white/45 hover:text-[#c9ff3d]"
        >
          <ArrowLeft size={14} /> Back to the bag
        </Link>
        <p className="eyebrow mb-2">Final panel / simulated payment</p>
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl">
          Complete the <span className="text-[#c9ff3d]">story.</span>
        </h1>
        <div className="mb-7 flex items-start gap-3 rounded-lg border border-[#c9ff3d]/20 bg-[#c9ff3d]/[.06] p-4 text-sm text-white/65">
          <ShieldCheck className="mt-0.5 shrink-0 text-[#c9ff3d]" size={18} />
          <p className="m-0">
            <b className="text-[#c9ff3d]">Demo checkout.</b> This order is
            simulated. No payment is collected.
          </p>
        </div>
        <form
          onSubmit={placeOrder}
          className="grid items-start gap-5 lg:grid-cols-[1fr_360px]"
        >
          <section className="rounded-lg border border-white/10 bg-[#17191e] p-5 sm:p-7">
            <p className="eyebrow">Delivery details</p>
            <h2 className="mb-6 text-xl font-bold">Where should it go?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {inputFields.map((field) => (
                <label
                  key={field.name}
                  className={field.name === "address" ? "sm:col-span-2" : ""}
                >
                  <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/65">
                    {field.label}
                  </span>
                  <input
                    className="shop-input"
                    name={field.name}
                    type={field.type}
                    inputMode={
                      field.name === "pincode" || field.name === "phone"
                        ? "numeric"
                        : undefined
                    }
                    maxLength={field.maxLength}
                    autoComplete={
                      field.name === "fullName"
                        ? "name"
                        : field.name === "address"
                          ? "street-address"
                          : field.name === "phone"
                            ? "tel"
                            : "off"
                    }
                    required
                    placeholder={field.placeholder}
                    value={shipping[field.name]}
                    onChange={update}
                  />
                </label>
              ))}
            </div>
            {error && (
              <p
                role="alert"
                className="mt-5 rounded border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
              >
                {error}
              </p>
            )}
            <button
              disabled={busy || !cartRows.length}
              className="acid-button mt-6 w-full sm:w-auto"
            >
              {busy ? "Placing demo order…" : "Place demo order"}{" "}
              <ArrowRight size={17} />
            </button>
          </section>
          <aside className="rounded-lg border border-white/10 bg-[#17191e] p-5 sm:p-6 lg:sticky lg:top-28">
            <p className="eyebrow">Your loot</p>
            <h2 className="mb-4 text-xl font-bold">Order summary</h2>
            <div className="max-h-72 space-y-3 overflow-auto">
              {cartRows.map(({ cartKey, product, size, quantity }) => (
                <div key={cartKey} className="flex items-center gap-3">
                  <img
                    src={product.image}
                    alt=""
                    className="h-14 w-12 rounded object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 line-clamp-1 text-xs font-semibold">
                      {product.name}
                    </p>
                    <p className="mono m-0 text-[10px] text-white/40">
                      {size} · Qty {quantity}
                    </p>
                  </div>
                  <span className="mono text-xs text-[#c9ff3d]">
                    ₹{product.new_price * quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-3 border-t border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Subtotal</span>
                <span className="mono text-white">₹{getTotalCartAmount()}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Shipping</span>
                <span className="text-[#c9ff3d]">Free</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="mono text-[#c9ff3d]">
                ₹{getTotalCartAmount()}
              </span>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
