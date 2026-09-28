import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, PackageCheck } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/login"); return; }
    fetch("http://localhost:3000/orders", { headers: { Authorization: `Bearer ${token}` } }).then(async (response) => {
      const data = await response.json();
      if (response.status === 401) { localStorage.removeItem("token"); window.dispatchEvent(new Event("auth:expired")); navigate("/login"); return; }
      if (!response.ok) throw new Error(data.message || "Could not load orders");
      setOrders(data);
    }).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
  }, [navigate]);
  return <main className="min-h-[70vh] py-9 sm:py-12"><div className="section-wrap"><p className="eyebrow mb-2">Your collection / account</p><h1 className="mb-8 text-4xl font-bold sm:text-5xl">Order <span className="text-[#c9ff3d]">history.</span></h1>
    {loading ? <p className="text-sm text-white/50">Loading your orders…</p> : error ? <p role="alert" className="rounded border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200">{error}</p> : !orders.length ? <div className="rounded-lg border border-white/10 bg-[#17191e] py-14 text-center"><PackageCheck className="mx-auto mb-3 text-[#9e7bff]" /><h2 className="text-xl">No orders in this chapter.</h2><p className="text-sm text-white/45">Your placed demo orders will appear here.</p><Link to="/shop" className="acid-button mt-3">Browse the archive <ArrowRight size={16} /></Link></div> : <div className="space-y-4">{orders.map((order) => <article key={order._id} className="rounded-lg border border-white/10 bg-[#17191e] p-4 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4"><div><p className="eyebrow mb-1">Order / {String(order._id).slice(-8).toUpperCase()}</p><p className="mono m-0 text-xs text-white/45">{new Date(order.orderDate).toLocaleDateString()} · Demo payment</p></div><div className="text-right"><p className="m-0 text-sm font-bold text-[#c9ff3d]">{order.status}</p><p className="mono m-0 mt-1 text-xs text-white/45">₹{order.totalAmount}</p></div></div><div className="mt-4 space-y-3">{order.products.map((product, index) => <div key={`${product.id}-${index}`} className="flex items-center gap-3"><img src={product.image} alt="" className="h-14 w-12 rounded object-cover" /><div className="min-w-0 flex-1"><p className="mb-1 line-clamp-1 text-sm font-semibold">{product.name}</p><p className="mono m-0 text-[10px] text-white/45">Size {product.size || "M"} · Qty {product.quantity || 1}</p></div><span className="mono text-xs">₹{product.new_price * (product.quantity || 1)}</span></div>)}</div><p className="mono mb-0 mt-4 border-t border-white/10 pt-3 text-xs text-white/45">Est. delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p></article>)}</div>}
  </div></main>;
}
