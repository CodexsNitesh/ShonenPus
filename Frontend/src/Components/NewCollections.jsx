import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Item from "./Item";
import fallbackProducts from "../assets/all_product";

export default function NewCollections() {
  const [collection, setCollection] = useState([]);
  useEffect(() => {
    // fetch("http://localhost:3000/newcollections")
    fetch(`${import.meta.env.VITE_API_URL}/newcollections`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCollection(data);
      })
      .catch(() => {});
  }, []);
  const items = collection.length ? collection : fallbackProducts.slice(8, 16);
  return (
    <section className="border-y border-white/10 bg-[#17191e] py-14 sm:py-20">
      <div className="section-wrap">
        <div className="mb-7 flex items-end justify-between gap-3 sm:mb-9">
          <div>
            <p className="eyebrow mb-2">Freshly scanned / Just landed</p>
            <h2 className="m-0 text-3xl font-bold sm:text-5xl">
              New <span className="text-[#9e7bff]">chapters</span>
            </h2>
          </div>
          <Link to="/shop" className="mono text-xs text-[#c9ff3d] sm:text-sm">
            All drops ↗
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((item) => (
            <Item key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
