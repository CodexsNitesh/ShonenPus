import React from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const cover = "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1400&q=90";

export default function Hero() {
  return <section className="manga-grid relative isolate overflow-hidden border-b border-white/10 bg-[#121318]">
    <div className="pointer-events-none absolute -right-20 top-12 -z-10 h-80 w-80 rounded-full bg-[#8b5cf6]/20 blur-[100px]" />
    <div className="section-wrap grid min-h-[570px] items-center gap-10 py-12 md:grid-cols-[1fr_.9fr] md:py-16 lg:min-h-[650px]">
      <div className="relative z-10">
        <div className="eyebrow mb-5 flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[#c9ff3d]" /> Issue No. 001 · The main character edit</div>
        <h1 className="anime-display max-w-3xl text-[clamp(3.5rem,10vw,7.3rem)]">YOUR<br />NEXT <span className="text-[#c9ff3d]">ARC</span><span className="text-[#9e7bff]">.</span></h1>
        <p className="mt-6 max-w-lg text-base leading-7 text-[#b3b4bc] sm:text-lg">Everyday fits for the protagonist energy. Find the graphic tees, layers, and little details that make the story yours.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link to="/shop" className="acid-button">Explore the drop <ArrowUpRight size={18} /></Link><Link to="/womens" className="outline-button">Read the collection</Link></div>
        <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-5 text-xs text-[#9b9da7] sm:gap-7 sm:text-sm"><span><b className="text-[#f4f0e8]">36</b> panels to explore</span><span className="h-1 w-1 rounded-full bg-[#9e7bff]" /><span><b className="text-[#f4f0e8]">₹</b> demo checkout</span><span className="h-1 w-1 rounded-full bg-[#9e7bff]" /><span>New chapter, always</span></div>
      </div>
      <div className="relative mx-auto w-full max-w-[500px] md:ml-auto">
        <div className="absolute -left-4 top-7 z-10 -rotate-6 border-2 border-[#101114] bg-[#c9ff3d] px-3 py-2 font-mono text-xs font-bold uppercase text-[#101114] shadow-[4px_4px_0_#9e7bff] sm:-left-8 sm:text-sm">The new drop!</div>
        <div className="absolute -right-2 top-1/2 z-10 -rotate-90 font-mono text-[10px] tracking-[.3em] text-white/60 sm:-right-7">SHONENPLUS / 2025</div>
        <div className="relative rotate-1 overflow-hidden border-[6px] border-[#f4f0e8] bg-[#2a2533] shadow-[12px_12px_0_#9e7bff] sm:border-[10px]">
          <img src={cover} alt="Illustrated manga panel for the latest clothing drop" className="aspect-[4/4.4] w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-24 sm:p-7 sm:pt-32"><p className="eyebrow">Featured story</p><p className="mt-1 text-xl font-bold sm:text-2xl">Main Character Energy</p></div>
        </div>
        <span className="absolute -bottom-8 -left-2 text-4xl text-[#c9ff3d] sm:-left-9 sm:text-6xl">✳</span>
      </div>
    </div>
    <div className="hidden items-center justify-between border-t border-white/10 px-6 py-3 font-mono text-[10px] uppercase tracking-[.22em] text-white/45 md:flex"><span>Style is your superpower</span><span className="flex items-center gap-2">Scroll to explore <ArrowDown size={13} /></span><span>Shonenplus archive</span></div>
  </section>;
}
