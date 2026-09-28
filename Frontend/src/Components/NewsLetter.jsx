import React, { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsLetter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (event) => { event.preventDefault(); if (email.includes("@")) { setDone(true); setEmail(""); setTimeout(() => setDone(false), 3500); } };
  return <section className="border-y border-white/10 bg-[#15171b] py-12 sm:py-16"><div className="section-wrap grid items-center gap-6 md:grid-cols-[1fr_auto]">
    <div><p className="eyebrow mb-2">Get the next issue</p><h2 className="m-0 text-3xl font-bold sm:text-4xl">Stay in the <span className="text-[#c9ff3d]">loop.</span></h2><p className="mb-0 mt-2 text-sm text-white/55">New drops and store news, straight to your inbox.</p></div>
    <form onSubmit={submit} className="flex w-full gap-2 md:w-[420px]"><input type="email" value={email} required onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" className="shop-input min-w-0" /><button className="acid-button shrink-0 px-4" aria-label="Subscribe">{done ? <Check size={18} /> : <ArrowRight size={18} />}</button></form>
  </div></section>;
}
