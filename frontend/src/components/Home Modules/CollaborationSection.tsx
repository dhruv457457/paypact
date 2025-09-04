import React from "react";

// SVG Icons updated for core PayPact features
const icons = [
  // Icon for Secure Transactions (Shield)
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" key="secure">
    <circle cx="12" cy="12" r="12" fill="#19191b" />
    <path
      d="M12 21.6C12 21.6 18 18.6 18 12.6V6.6L12 3.6L6 6.6V12.6C6 18.6 12 21.6 12 21.6Z"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Icon for Group Payments (Multiple Users)
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" key="group">
    <circle cx="12" cy="12" r="12" fill="#19191b" />
    <path
      d="M10 17v-1a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="9" r="2" stroke="#fff" strokeWidth="2" />
    <path
      d="M6 18v-1a2 2 0 0 1 2-2h0"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="7" cy="10" r="2" stroke="#fff" strokeWidth="2" />
    <path
      d="M14 15h2a2 2 0 0 1 2 2v1"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="17" cy="10" r="2" stroke="#fff" strokeWidth="2" />
  </svg>,
  // Icon for Tracking (List/Ledger)
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" key="tracking">
    <circle cx="12" cy="12" r="12" fill="#19191b" />
    <path
      d="M8 12h8m-8 4h5m-5-8h8"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>,
];

// Card definitions updated for PayPact's core features
const cards = [
  {
    icon: icons[0],
    title: "Secure & Encrypted",
    desc: "Your financial security is our top priority. All transactions are protected with end-to-end encryption to keep your data safe.",
  },
  {
    icon: icons[1],
    title: "Effortless Group Pacts",
    desc: "Easily create a pact, invite friends, and set payment amounts. We'll handle the notifications and tracking for you.",
  },
  {
    icon: icons[2],
    title: "Transparent Tracking",
    desc: "Always know who has paid and who hasn't. Get a clear, real-time overview of your group's payment status.",
  },
];

export default function CollaborationSection() {
  return (
    <section className="flex flex-col items-center min-h-[70vh] bg-black text-white pt-14 pb-4 overflow-x-hidden">
      {/* Top: pill, heading, description */}
      <div className="relative z-10 flex flex-col items-center mb-10">
        <span className="px-5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-3">
          Effortless Group Payments
        </span>
        <h1 className="text-[2.1rem] font-semibold leading-tight mb-2 text-center">
          Simplify Your Shared Expenses
        </h1>
        <p className="text-base text-white/50 mt-2 max-w-2xl text-center">
          PayPact makes it easy to create, manage, and settle group payments.
          From trips with friends to shared subscriptions, we handle the
          complexity so you don't have to.
        </p>
      </div>

      {/* Features row */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl mb-10">
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col items-center md:items-start rounded-xl
              border border-[#1C1C1E]
              bg-[#0C0C0E]
              backdrop-blur-lg
              px-6 py-7"
          >
            <span className="rounded-full border border-white/10 bg-white/5 p-2.5 mb-4">
              {card.icon}
            </span>
            <h3 className="text-lg font-semibold mb-1 text-center md:text-left">
              {card.title}
            </h3>
            <p className="text-white/60 text-[1rem] text-center md:text-left">
              {card.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Image section */}
      <div className=" max-w-7xl rounded-2xl border-[#1C1C1E] mt-4 border">
        {/* TODO: Replace this placeholder with an image showing the PayPact dashboard or feature */}
        <img
          src="https://i.ibb.co/kgTCHyG9/Chat-GPT-Image-Aug-16-2025-01-47-47-PM.png"
          className="rounded-full shadow-lg object-cover "
          alt="PayPact Dashboard Preview"
        />
      </div>
    </section>
  );
}