import React from "react";
import Hero from "../Components/Hero";
import Popular from "../Components/Popular";
import Offers from "../Components/Offers";
import NewCollections from "../Components/NewCollections";
import NewsLetter from "../Components/NewsLetter";
import Footer from "../Components/Footer";
const Shop = () => {
    return(
        <div className="bg-[#101114] text-[#f4f0e8]">
            <Hero />
            <Popular />
            <Offers />
            <NewCollections />
            <NewsLetter />
            <Footer />
        </div>
    )
}
export default Shop;
