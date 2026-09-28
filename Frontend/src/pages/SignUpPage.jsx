import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { ShopContext } from "../Context/ShopContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { syncCartToServer } = useContext(ShopContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (event) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      // const response = await fetch("http://localhost:3000/signup", {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Could not create account");
      localStorage.setItem("token", data.token);
      window.dispatchEvent(new Event("storage"));
      await syncCartToServer();
      navigate("/");
    } catch (submitError) {
      setError(submitError.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="manga-grid flex min-h-[calc(100vh-112px)] items-center justify-center px-4 py-10 sm:py-14">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-xl border border-white/10 bg-[#17191e] shadow-2xl md:grid-cols-[.95fr_1.05fr]">
        <div className="relative hidden min-h-[620px] overflow-hidden bg-[#28213a] p-10 md:flex md:flex-col md:justify-between">
          <div className="absolute inset-0 manga-halftone opacity-50" />
          <span className="relative w-fit rotate-[-5deg] border-2 border-[#101114] bg-[#9e7bff] px-3 py-2 font-mono text-xs font-bold uppercase text-white shadow-[4px_4px_0_#c9ff3d]">
            New character unlocked
          </span>
          <div className="relative">
            <p className="eyebrow">First appearance / 001</p>
            <p className="anime-display text-6xl">
              CREATE
              <br />
              YOUR
              <br />
              <span className="text-[#c9ff3d]">LEGEND.</span>
            </p>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/55">
              Join the crew and find pieces worthy of the cover.
            </p>
          </div>
          <span className="relative mono text-[10px] uppercase tracking-[.22em] text-white/40">
            SHONENPLUS · CHARACTER CREATION
          </span>
        </div>
        <div className="p-6 sm:p-10 md:p-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/55 hover:text-[#c9ff3d]"
          >
            <ArrowLeft size={16} /> Back to the store
          </Link>
          <p className="eyebrow mb-3">Join the universe</p>
          <h1 className="text-4xl font-bold sm:text-5xl">
            Create <span className="text-[#9e7bff]">account.</span>
          </h1>
          <p className="mb-7 mt-3 text-sm text-white/55">
            A few details and you’re in.
          </p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
              >
                Name
              </label>
              <div className="relative">
                <UserRound
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={form.name}
                  onChange={update}
                  placeholder="Your name"
                  className="shop-input pl-11"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={update}
                  placeholder="you@example.com"
                  className="shop-input pl-11"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
              >
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={form.password}
                  onChange={update}
                  placeholder="At least 8 characters"
                  className="shop-input pl-11"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/70"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={form.confirmPassword}
                onChange={update}
                placeholder="Enter it again"
                className="shop-input"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="rounded border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200"
              >
                {error}
              </p>
            )}
            <button disabled={loading} className="acid-button w-full">
              {loading ? "Creating account…" : "Create account"}{" "}
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-white/55">
            Already part of the crew?{" "}
            <Link to="/login" className="font-bold text-[#c9ff3d]">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
