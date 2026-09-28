import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import add_product_icon from '../assets/Product_Cart.svg';
import list_product_icon from '../assets/Product_list_icon.svg';
import { X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      path: '/addproduct',
      label: 'Add Product',
      icon: add_product_icon,
    },
    {
      path: '/listproduct',
      label: 'Product List',
      icon: list_product_icon,
    },
  ];

  return (
    <>
      {/* Overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-luxury-charcoal shadow-luxury-lg z-50 transform transition-transform duration-300 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:static md:block`}
      >
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-luxury-gold/10">
          <h3 className="text-lg font-bold text-luxury-cream font-display">Menu</h3>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-luxury-gold/10 text-luxury-gold rounded-lg transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="no-underline group"
              onClick={() => onClose()}
            >
              <div
                className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-luxury-gold text-luxury-charcoal shadow-luxury'
                    : 'text-luxury-cream hover:bg-luxury-gold/10'
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`h-5 w-5 ${
                    isActive(item.path) ? 'invert' : 'opacity-75 group-hover:opacity-100'
                  }`}
                />
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="border-t border-luxury-gold/10 p-4 space-y-3">
          <div className="px-4 py-3 bg-luxury-gold/10 rounded-lg">
            <p className="text-xs text-luxury-gold/60 uppercase tracking-wider mb-1">Version</p>
            <p className="text-sm font-semibold text-luxury-cream">2.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
