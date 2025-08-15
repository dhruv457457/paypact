import React from "react";

// Example SVG icons (replace with your own or an icon set if needed)
const icons = [
  // Github
  <svg key="github" width="23" height="23" fill="none" viewBox="0 0 24 24">
    <path
      fill="#fff"
      fillOpacity="0.7"
      d="M12 2C6.477 2 2 6.486 2 12.017c0 4.427 2.87 8.182 6.839 9.506.5.092.682-.217.682-.483 0-.238-.008-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.07-.608.07-.608 1.004.072 1.533 1.032 1.533 1.032.892 1.528 2.341 1.087 2.91.832.092-.646.35-1.087.637-1.338-2.221-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.254-.447-1.272.098-2.65 0 0 .84-.27 2.75 1.026a9.564 9.564 0 012.5-.337c.85.004 1.705.115 2.504.337 1.908-1.296 2.747-1.026 2.747-1.026.547 1.378.202 2.396.099 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.943.358.309.678.919.678 1.852 0 1.337-.012 2.419-.012 2.747 0 .269.179.579.687.482A10.019 10.019 0 0022 12.017C22 6.486 17.523 2 12 2z"
    />
  </svg>, // X(Twitter)
  <svg key="x" width="23" height="23" fill="none" viewBox="0 0 24 24">
    <path
      fill="#fff"
      fillOpacity="0.7"
      d="M19.392 21H23l-7.174-7.654L22.705 3h-3.377l-5.354 7.98L8.038 3H1l7.434 7.928L1.294 21H4.82l5.673-8.488z"
    />
  </svg>, // Discord
  <svg key="discord" width="23" height="23" fill="none" viewBox="0 0 24 24">
    <path
      fill="#fff"
      fillOpacity="0.7"
      d="M20 4.5A2.5 2.5 0 0 0 17.5 2h-11A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22h11a2.5 2.5 0 0 0 2.5-2.5v-15zm-8 2.75a2.75 2.75 0 1 1 0 5.5 2.75 2.75 0 0 1 0-5.5zm-5 2.75a2.75 2.75 0 1 0 5.5 0 2.75 2.75 0 0 0-5.5 0zm10 0a2.75 2.75 0 1 0-5.5 0 2.75 2.75 0 0 0 5.5 0z"
    />
  </svg>, // Linkedin
  <svg key="linkedin" width="23" height="23" fill="none" viewBox="0 0 24 24">
    <path
      fill="#fff"
      fillOpacity="0.7"
      d="M19 3A2 2 0 0 1 21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-7 8h2v7h-2v-7zm1-2a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM7 11h2v7H7v-7zm11.164-1.158A4 4 0 0 0 17 9.99v8.01h-2v-7c0-1.104-.896-2-2-2s-2 .896-2 2v7H7V9.989c0-.869.136-1.769.821-2.647C8.34 5.084 10.978 2.999 13.999 3a5 5 0 0 1 4.165 6.842z"
    />
  </svg>,
];

export default function Footer() {
  return (
    <footer className="bg-black text-white/80 pt-0 pb-4">
      {/* Newsletter Section */}{" "}
      <div className="bg-neutral-900 w-full py-8 px-4 md:px-40 flex flex-col md:flex-row md:justify-between items-center gap-4">
        {" "}
        <div>
          {" "}
          <h2 className="text-xl font-semibold mb-1 text-white">
            Stay Updated with PayPact
          </h2>{" "}
          <p className="text-base text-white/60 mb-1">
            Join our newsletter for product updates and the latest on Solana
            Pay.
          </p>{" "}
        </div>{" "}
        <form className="flex items-center gap-2 w-full md:w-auto">
          {" "}
          <input
            type="email"
            placeholder="you@email.com"
            className="rounded-full bg-neutral-800 text-white/80 px-5 py-2 outline-none border border-white/10 w-[180px] md:w-[230px]"
          />{" "}
          <button
            type="submit"
            className="rounded-full bg-white text-gray-900 px-6 py-2 font-semibold shadow border border-white/20 transition"
          >
            Submit{" "}
          </button>{" "}
        </form>{" "}
      </div>
      {/* Footer Main Area */}{" "}
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Logo and copyright */}{" "}
        <div className="flex flex-col gap-2 md:w-[280px]">
          {" "}
          <div className="flex items-center gap-2">
            {/* PayPact Logo SVG */}{" "}
          
            <span className="font-bold text-white text-xl">PayPact</span>{" "}
          </div>{" "}
          <div className="mt-2 mb-2 text-xs text-white/50">
            @ 2025 PayPact. All rights reserved.
          </div>{" "}
        </div>
        {/* Docs/Links */}{" "}
        <div className="flex gap-8 items-center mt-3 md:mt-0">
          {" "}
          <a href="#" className="hover:text-white transition">
            Docs
          </a>{" "}
          <a href="#" className="hover:text-white transition">
            Help
          </a>{" "}
          <a href="#" className="hover:text-white transition">
            Privacy Policy
          </a>{" "}
          <a href="#" className="hover:text-white transition">
            Terms
          </a>{" "}
        </div>
        {/* Appearance and Social icons */}{" "}
        <div className="flex flex-col items-end gap-2 md:w-[220px]">
          {/* Appearance toggle (not functional here) */}{" "}
          <div className="flex items-center gap-1 text-white/70">
            Appearance{" "}
            <span className="ml-2 flex items-center gap-1 px-2 py-1 bg-neutral-900 rounded-full border border-white/10">
              <span className="text-lg">🌞</span>{" "}
              <span className="w-8 h-6 flex items-center justify-center">
                {" "}
                <span className="inline-block w-4 h-4 bg-neutral-800 rounded-full" />{" "}
              </span>
              <span className="text-lg">🌜</span>{" "}
            </span>{" "}
          </div>
          {/* Social icons */}{" "}
          <div className="flex gap-3 mt-2">
            {" "}
            {icons.map((icon, idx) => (
              <a
                href="#"
                key={idx}
                className="p-1 hover:bg-white/10 rounded transition"
              >
                {icon}{" "}
              </a>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </footer>
  );
}
