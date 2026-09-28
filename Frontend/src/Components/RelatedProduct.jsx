import React from "react";
import { Link } from "react-router-dom";
import Item from "./Item";
import products from "../assets/all_product.js";

export default function RelatedProduct({ category }) {
  const related = products.filter((item) => item.category === category).slice(0, 4);
  if (!related.length) return null;
  return <section className="border-t border-white/10 bg-[#17191e] py-12 sm:py-16"><div className="section-wrap"><div className="mb-7 flex items-end justify-between"><div><p className="eyebrow mb-2">More from this shelf</p><h2 className="m-0 text-3xl font-bold">Related <span className="text-[#9e7bff]">panels</span></h2></div><Link to={`/${category.toLowerCase()}s`} className="mono text-xs text-[#c9ff3d]">See more ↗</Link></div><div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{related.map((item) => <Item key={item.id} {...item} />)}</div></div></section>;
}
