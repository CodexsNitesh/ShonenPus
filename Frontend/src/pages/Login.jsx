import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { ShopContext } from "../Context/ShopContext";

export default function Login() {
  const navigate = useNavigate();
  const { syncCartToServer } = useContext(ShopContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not sign in");
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("storage"));
      try { await syncCartToServer(); } catch (syncError) { setError(syncError.message); setLoading(false); return; }
      navigate("/");
    } catch (submitError) { setError(submitError.message || "Unable to reach the sign-in service"); }
    finally { setLoading(false); }
  };

  return <main className="manga-grid flex min-h-[calc(100vh-112px)] items-center justify-center px-4 py-10 sm:py-14"><div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-[#17191e] shadow-2xl md:grid-cols-[.95fr_1.05fr]">
    <div className="relative hidden min-h-[580px] overflow-hidden bg-[#28213a] p-10 md:flex md:flex-col md:justify-between"><div className="absolute inset-0 manga-halftone opacity-50" /><span className="relative w-fit rotate-[-5deg] border-2 border-[#101114] bg-[#c9ff3d] px-3 py-2 font-mono text-xs font-bold uppercase text-[#101114] shadow-[4px_4px_0_#9e7bff]">Your story starts here</span><div className="relative"><p className="eyebrow">Reader account / 001</p><p className="anime-display text-6xl">WELCOME<br />BACK,<br /><span className="text-[#c9ff3d]">HERO.</span></p><p className="mt-5 max-w-xs text-sm leading-6 text-white/55">Pick up where you left off. Your next favorite is waiting in the store.</p></div><span className="relative mono text-[10px] uppercase tracking-[.22em] text-white/40">SHONENPLUS · MAIN CHARACTER DEPARTMENT</span></div>
    <div className="p-6 sm:p-10 md:p-12"><Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm text-white/55 hover:text-[#c9ff3d]"><ArrowLeft size={16} /> Back to the store</Link><p className="eyebrow mb-3">Account access</p><h1 className="text-4xl font-bold sm:text-5xl">Sign <span className="text-[#c9ff3d]">in.</span></h1><p className="mb-8 mt-3 text-sm text-white/55">Enter your email and password to continue your story.</p>
      <form onSubmit={submit} className="space-y-5"><div><label htmlFor="email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">Email address</label><div className="relative"><Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" /><input id="email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" className="shop-input pl-11" /></div></div><div><label htmlFor="password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70">Password</label><div className="relative"><LockKeyhole size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" /><input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" className="shop-input pl-11" /></div></div>
        {error && <p role="alert" className="rounded border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}<button disabled={loading} className="acid-button w-full">{loading ? "Signing in…" : "Sign in"} <ArrowRight size={17} /></button></form>
      <p className="mt-7 text-center text-sm text-white/55">New to this universe? <Link to="/signup" className="font-bold text-[#c9ff3d]">Create account</Link></p>
    </div>
  </div></main>;
}
