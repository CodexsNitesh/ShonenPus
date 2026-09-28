import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return <footer className="bg-[#0b0c0f] py-9"><div className="section-wrap flex flex-col justify-between gap-6 border-t border-white/10 pt-7 sm:flex-row sm:items-center"><Link to="/" className="text-lg font-black tracking-[-.05em]">SHONEN<span className="text-[#c9ff3d]">PLUS</span><p className="mono mt-1 text-[9px] font-normal uppercase tracking-[.18em] text-white/40">Wear your next arc</p></Link><nav className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/55"><Link to="/shop">Shop all</Link><Link to="/orders">My orders</Link><Link to="/cart">Bag</Link><Link to="/login">Account</Link></nav><p className="mono m-0 text-[10px] text-white/35">© {new Date().getFullYear()} SHONENPLUS · Demo shop</p></div></footer>;
}
