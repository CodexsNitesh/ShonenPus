const express = require('express');
const Product = require('../models/product')
// const productSchema = require("./models/product");


exports.getallProducts = async (req, res)  => {
    try{
        const products = await Product.find({});
        console.log("All products Fetched");
        res.status(200).json(products)
    }catch(err){
        console.log("Error Fetching products", err);
        res.status(500).json({error: "Internal Server Error"})
    }
};


exports.newCollections = async (req, res) => {
  try {
    const newCollection = await Product.find({})
      .sort({ date: -1 }) // latest first
      .limit(8);          // limit to 8
    console.log("New Collection fetched");
    res.send(newCollection);
  } catch (error) {
    console.error("Failed to fetch new collection:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}


exports.popularInWomen = async (req, res) => {
    const products = await Product.find({category: 'Women'});
    const popular_in_women =  products.slice(0,4);
    console.log("Popular in Women Fetched");
    res.send(popular_in_women);
}