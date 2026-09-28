import React from 'react';
import navlogo from '../assets/nav-logo.svg';
import navProfile from '../assets/nav-profile.svg';
import { LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = '/';
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-8 py-4 bg-luxury-charcoal shadow-luxury-lg border-b border-luxury-gold/20">
      {/* Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-luxury-gold rounded-lg flex items-center justify-center">
          <span className="text-lg font-bold text-luxury-charcoal font-display">L</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-bold text-luxury-cream font-display">Admin Panel</p>
          <p className="text-xs text-luxury-gold">Luxe Collections</p>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-6">
        {/* Settings */}
        <button className="p-2.5 hover:bg-luxury-gold/10 text-luxury-gold rounded-lg transition-all">
          <Settings size={20} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-luxury-gold/20">
          <img
            src={navProfile}
            alt="Profile"
            className="h-10 w-10 rounded-full border-2 border-luxury-gold hover:border-luxury-gold/80 transition-all"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-luxury-cream">Admin</p>
            <p className="text-xs text-luxury-gold">Store Manager</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2.5 hover:bg-luxury-rose-gold/10 text-luxury-rose-gold rounded-lg transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
