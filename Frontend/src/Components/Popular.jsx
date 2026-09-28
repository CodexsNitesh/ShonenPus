import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Item from "./Item";
import fallbackProducts from "../assets/all_product";

export default function Popular() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    // fetch("http://localhost:3000/popularinwomen")
    fetch(`${import.meta.env.VITE_API_URL}/popularinwomen`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {});
  }, []);
  const items = products.length
    ? products
    : fallbackProducts.filter((item) => item.category === "Women").slice(0, 4);
  return (
    <section className="section-wrap py-14 sm:py-20">
      <div className="mb-7 flex items-end justify-between gap-3 sm:mb-9">
        <div>
          <p className="eyebrow mb-2">Fan favorites / Chapter 01</p>
          <h2 className="m-0 text-3xl font-bold sm:text-5xl">
            Top <span className="text-[#c9ff3d]">ranked</span>
          </h2>
        </div>
        <Link className="mono text-xs text-[#c9ff3d] sm:text-sm" to="/womens">
          See collection ↗
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {items.map((item) => (
          <Item key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}
