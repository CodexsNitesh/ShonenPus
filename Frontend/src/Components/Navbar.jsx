import React, { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Search, ShoppingBag, LogOut, UserRound } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";

const links = [
  { name: "All drops", path: "/shop" },
  { name: "Women", path: "/womens" },
  { name: "Men", path: "/mens" },
  { name: "Kids", path: "/kids" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const { getTotalCartItems, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();

  useEffect(() => {
    const updateToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", updateToken);
    window.addEventListener("auth:expired", updateToken);
    return () => {
      window.removeEventListener("storage", updateToken);
      window.removeEventListener("auth:expired", updateToken);
    };
  }, []);

  const search = (event) => {
    event.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search");
    setMenuOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    clearCart();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <>
      <div className="bg-[#c9ff3d] px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[.18em] text-[#101114] sm:text-xs">
        Chapter 01 is live · New fits for your next arc
      </div>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101114]/95 backdrop-blur-xl">
        <div className="section-wrap flex min-h-[72px] items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
            <span className="grid h-10 w-10 -rotate-3 place-items-center border-2 border-[#c9ff3d] bg-[#c9ff3d] text-lg font-black text-[#101114]">S+</span>
            <span className="leading-none"><strong className="block text-lg font-bold tracking-[-.06em] sm:text-xl">SHONEN<span className="text-[#c9ff3d]">PLUS</span></strong><small className="mono mt-1 block text-[9px] uppercase tracking-[.18em] text-[#9b9da7]">Wear your next arc</small></span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => <NavLink key={link.path} to={link.path} className={({ isActive }) => `text-sm font-semibold transition-colors hover:text-[#c9ff3d] ${isActive ? "text-[#c9ff3d]" : "text-[#d4d2ce]"}`}>{link.name}</NavLink>)}
          </nav>

          <form onSubmit={search} className="hidden min-w-40 max-w-64 flex-1 md:flex">
            <div className="relative w-full"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777985]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="shop-input h-10 py-2 pl-9 pr-3 text-sm" placeholder="Search the shelves" /></div>
          </form>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded border border-white/10 text-white hover:border-[#c9ff3d] hover:text-[#c9ff3d]" aria-label="Shopping bag"><ShoppingBag size={19} />{getTotalCartItems() > 0 && <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#c9ff3d] px-1 text-[10px] font-black text-[#101114]">{getTotalCartItems()}</span>}</Link>
            <div className="hidden sm:block">{token ? <button onClick={logout} className="outline-button min-h-10 px-3 text-sm"><LogOut size={15} /> Sign out</button> : <Link to="/login" className="acid-button min-h-10 px-4 text-sm"><UserRound size={15} /> Sign in</Link>}</div>
            <button onClick={() => setMenuOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded border border-white/10 lg:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X /> : <Menu />}</button>
          </div>
        </div>

        {menuOpen && <div className="border-t border-white/10 bg-[#15171b] px-4 pb-5 pt-4 lg:hidden">
          <form onSubmit={search} className="mb-4 flex gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} className="shop-input" placeholder="Search manga fits" /><button className="acid-button min-h-11 px-3" aria-label="Search"><Search size={18} /></button></form>
          <nav className="grid grid-cols-2 gap-2">{links.map((link) => <NavLink key={link.path} to={link.path} onClick={() => setMenuOpen(false)} className="rounded border border-white/10 px-3 py-3 text-sm font-semibold">{link.name}</NavLink>)}<Link to="/orders" onClick={() => setMenuOpen(false)} className="rounded border border-white/10 px-3 py-3 text-sm font-semibold">My orders</Link>{token ? <button onClick={logout} className="rounded border border-white/10 px-3 py-3 text-left text-sm font-semibold">Sign out</button> : <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded bg-[#c9ff3d] px-3 py-3 text-sm font-bold text-[#101114]">Sign in</Link>}</nav>
        </div>}
      </header>
    </>
  );
}
