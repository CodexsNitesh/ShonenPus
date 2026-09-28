import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import AddProduct from '../components/AddProduct';
import ProductList from '../components/ProductList';
import { Menu } from 'lucide-react';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-luxury-cream">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full">
        {/* Mobile Menu Button - Fixed in corner */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-40 p-3 bg-luxury-gold text-luxury-charcoal rounded-full shadow-luxury hover:shadow-luxury-lg hover:-translate-y-1 active:translate-y-0"
          title="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          <Routes>
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/listproduct" element={<ProductList />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Admin;
