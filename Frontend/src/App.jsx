import React from "react"
import Navbar from "./Components/Navbar"
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import SignUpPage from "./pages/SignUpPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ShopCategory from "./pages/ShopCategory"
import Checkout from "./pages/Checkout";
import Orders from "./pages/orders";
function App() {
  return (
    <div className="min-h-screen bg-[#101114] text-[#f4f0e8]">
      <Router>
        <Navbar />
        <Routes>
          
          <Route path="/" element={<Shop />} />
          <Route path="/mens" element={<ShopCategory category="Men"/>} />
          <Route path="/womens" element={<ShopCategory category="Women"/>} />
          <Route path="/kids" element={<ShopCategory category="Kids"/>} />
          <Route path="/search" element={<ShopCategory category="All"/>} />
          <Route path="/shop" element={<ShopCategory category="All"/>} />
          <Route path="/product" element={<Product />} />
           <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
