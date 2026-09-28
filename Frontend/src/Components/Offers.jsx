import React from "react";
import { ArrowUpRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Offers() {
  return <section className="section-wrap py-12 sm:py-16"><div className="relative grid overflow-hidden rounded-xl border border-[#9e7bff]/40 bg-[#231e31] md:grid-cols-[1fr_.7fr]">
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#9e7bff]/15 blur-3xl" />
    <div className="relative p-6 sm:p-10 lg:p-14"><p className="eyebrow flex items-center gap-2"><Zap size={14} /> Limited side quest</p><h2 className="anime-display mt-5 max-w-xl text-4xl sm:text-6xl">POWER UP<br /><span className="text-[#c9ff3d]">YOUR FIT.</span></h2><p className="mt-5 max-w-lg text-sm leading-6 text-white/65 sm:text-base">Build your rotation with pieces that bring a little more color to the panel. Every order is a demo—no real charge.</p><Link to="/shop" className="acid-button mt-7">Find your next fit <ArrowUpRight size={17} /></Link></div>
    <div className="manga-halftone relative hidden min-h-64 items-center justify-center overflow-hidden border-l border-white/10 md:flex"><div className="grid h-48 w-48 -rotate-6 place-items-center rounded-full border-[12px] border-[#c9ff3d] bg-[#17191e] text-center shadow-[16px_16px_0_#9e7bff]"><div><p className="mono text-xs uppercase tracking-[.2em] text-[#c9ff3d]">Special edition</p><p className="m-0 text-5xl font-black">S<span className="text-[#9e7bff]">+</span></p><p className="mono text-[10px] uppercase">Style unlocked</p></div></div></div>
  </div></section>;
}
