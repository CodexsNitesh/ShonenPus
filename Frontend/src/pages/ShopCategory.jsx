import React, { useContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item";

const PAGE_SIZE = 12;
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "newest", label: "Newest first" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function ShopCategory({ category = "All" }) {
  const { all_product } = useContext(ShopContext);
  const [params, setParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [sortBy, setSortBy] = useState("featured");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchTerm = params.get("q") || "";
  useEffect(() => { setSelectedCategory(category); setVisibleCount(PAGE_SIZE); }, [category]);
  const categories = useMemo(() => ["All", ...new Set(all_product.map((item) => item.category).filter(Boolean))], [all_product]);
  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const products = all_product.filter((item) => (selectedCategory === "All" || item.category === selectedCategory) && (!query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)));
    return products.sort((a, b) => {
      if (sortBy === "price-asc") return a.new_price - b.new_price;
      if (sortBy === "price-desc") return b.new_price - a.new_price;
      if (sortBy === "newest") return new Date(b.date || 0) - new Date(a.date || 0);
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [all_product, searchTerm, selectedCategory, sortBy]);
  const setQuery = (value) => { const next = new URLSearchParams(params); if (value.trim()) next.set("q", value); else next.delete("q"); setParams(next, { replace: true }); setVisibleCount(PAGE_SIZE); };
  const reset = () => { setSortBy("featured"); setSelectedCategory(category); setQuery(""); };
  const pageTitle = searchTerm ? `Search: “${searchTerm}”` : selectedCategory === "All" ? "All drops" : `${selectedCategory} collection`;

  return <main className="min-h-screen pb-16"><section className="manga-grid border-b border-white/10 bg-[#17191e] py-9 sm:py-14"><div className="section-wrap"><p className="eyebrow mb-3">Shonenplus archive / browse</p><h1 className="anime-display text-4xl sm:text-6xl">{pageTitle}<span className="text-[#c9ff3d]">.</span></h1><p className="mb-0 mt-4 text-sm text-white/50">Find your fit. Pick your chapter.</p></div></section>
    <div className="section-wrap pt-6 sm:pt-9"><div className="mb-6 grid gap-3 rounded-lg border border-white/10 bg-[#17191e] p-3 sm:grid-cols-[1fr_auto_auto_auto] sm:p-4">
      <label className="relative block"><span className="sr-only">Search products</span><Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" /><input value={searchTerm} onChange={(event) => setQuery(event.target.value)} placeholder="Search the archive" className="shop-input pl-10" /></label>
      <label><span className="sr-only">Category</span><select value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setVisibleCount(PAGE_SIZE); }} className="shop-input"><option value="All">All categories</option>{categories.filter((item) => item !== "All").map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
      <label><span className="sr-only">Sort products</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="shop-input">{SORT_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <button type="button" onClick={reset} className="outline-button"><SlidersHorizontal size={15} /> Reset</button>
    </div>
    <div className="mb-4 flex items-center justify-between"><p className="mono m-0 text-xs uppercase tracking-widest text-white/45">{filtered.length} products found</p></div>
    {filtered.length ? <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{filtered.slice(0, visibleCount).map((item) => <Item key={item.id} {...item} />)}</div> : <div className="rounded-lg border border-white/10 bg-[#17191e] py-16 text-center"><p className="eyebrow">No matches</p><h2 className="text-2xl">No panels found.</h2><p className="text-sm text-white/50">Try another search or reset the filters.</p></div>}
    {visibleCount < filtered.length && <div className="mt-9 text-center"><button onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="outline-button">Load more panels</button></div>}
    </div></main>;
}
