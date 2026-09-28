import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export default function Item({ id, name, image, new_price, old_price }) {
  const discount = old_price > new_price ? Math.round((old_price - new_price) / old_price * 100) : 0;
  return <Link to={`/product/${id}`} onClick={() => window.scrollTo(0, 0)} className="shop-card group block overflow-hidden rounded-lg">
    <div className="relative overflow-hidden bg-[#252830]">
      <img src={image} alt={name} loading="lazy" onError={(event) => { event.currentTarget.src = "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80"; }} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
      <span className="absolute left-3 top-3 bg-[#101114]/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#c9ff3d]">{discount ? `${discount}% off` : "New chapter"}</span>
      <span className="absolute bottom-3 right-3 grid h-9 w-9 translate-y-2 place-items-center rounded-full bg-[#c9ff3d] text-[#101114] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight size={17} /></span>
    </div>
    <div className="p-3.5 sm:p-4">
      <p className="line-clamp-2 min-h-[2.8rem] text-sm font-semibold leading-snug text-[#f4f0e8] sm:text-[15px]">{name}</p>
      <div className="mt-2 flex items-baseline gap-2"><span className="font-mono text-sm font-bold text-[#c9ff3d]">₹{Number(new_price).toFixed(0)}</span>{old_price > new_price && <span className="font-mono text-xs text-[#777985] line-through">₹{Number(old_price).toFixed(0)}</span>}</div>
    </div>
  </Link>;
}
