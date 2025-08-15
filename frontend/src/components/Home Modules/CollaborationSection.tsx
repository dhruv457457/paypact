import React from "react";

// SVG Icons (repurposed for PayPact features)
const icons = [
  // Icon for Receipts (Represents sending/output)
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" key="receipt">
    <circle cx="12" cy="12" r="12" fill="#19191b" />

    <path
      d="M12 7.5v9m0-9l-3.5 3.5m3.5-3.5l3.5 3.5"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>, // Icon for Reminders (Represents time/deadlines)
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" key="reminder">
    <circle cx="12" cy="12" r="12" fill="#19191b" />
    <rect x="7" y="7" width="10" height="2" rx="1" fill="#fff" />
    <rect x="7" y="15" width="10" height="2" rx="1" fill="#fff" />
    <path d="M7 9l5 3 5-3" stroke="#fff" strokeWidth="1.5" />{" "}
  </svg>, // Icon for NFT Tickets (Represents a unique token/star item)
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" key="nft">
    <circle cx="12" cy="12" r="12" fill="#19191b" />{" "}
    <path
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      d="M12 7v10m-5-5h10M8 8l8 8M8 16l8-8"
    />{" "}
  </svg>,
];

// Card definitions updated for PayPact
const cards = [
  {
    icon: icons[1],
    title: "Automated Reminders",
    desc: "Set up automatic email or SMS notifications for participants with pending payments to reduce manual follow-ups.",
  },
  {
    icon: icons[2],
    title: "NFT Access Passes",
    desc: "Automatically mint and distribute an NFT ticket or access pass to participants upon successful payment for events.",
  },
  {
    icon: icons[0],
    title: "Instant PDF Receipts",
    desc: "Provide participants with a verifiable PDF receipt for their records, automatically generated after payment confirmation.",
  },
];

export default function CollaborationSection() {
  return (
    <section className="flex flex-col items-center min-h-[70vh] bg-black text-white pt-14 pb-4 overflow-x-hidden">
      {/* Top: pill, heading, description */}{" "}
      <div className="relative z-10 flex flex-col items-center mb-10">
        {" "}
        <span className="px-5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-3">
          Beyond Payments{" "}
        </span>{" "}
        <h1 className="text-[2.1rem] font-semibold leading-tight mb-2 text-center">
          Unlock Experiences & Automate Rewards{" "}
        </h1>{" "}
        <p className="text-base text-white/50 mt-2 max-w-2xl text-center">
          Go beyond simple transactions. PayPact allows organizers to automate
          reminders, generate receipts, and even grant access to events with NFT
          tickets after a successful payment.{" "}
        </p>{" "}
      </div>
      {/* Features row */}{" "}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-7xl mb-10">
        {" "}
        {cards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col items-center md:items-start rounded-xl
  border border-[#1C1C1E]
   bg-[#0C0C0E]
   backdrop-blur-lg
  px-6 py-7"
          >
            {" "}
            <span className="rounded-full border border-white/10 bg-white/5 p-2.5 mb-4">
              {card.icon}{" "}
            </span>{" "}
            <h3 className="text-lg font-semibold mb-1 text-center md:text-left">
              {card.title}{" "}
            </h3>{" "}
            <p className="text-white/60 text-[1rem] text-center md:text-left">
              {card.desc}{" "}
            </p>{" "}
          </div>
        ))}{" "}
      </div>
      {/* Image section */}{" "}
      <div className=" max-w-7xl rounded-2xl border-[#1C1C1E] mt-4 border">
        {" "}
        {/* TODO: Replace this placeholder with an image showing the PayPact dashboard or NFT tickets */}{" "}
        <img
          src="https://assets.basehub.com/fa068a12/0wXkzA13r5ef3JtyGvTgy/features-seamless-collaboration-enhanced-productivity2x.png?format=auto&quality=100"
          className=" rounded-full shadow-lg object-cover"
          alt="PayPact Dashboard Preview"
        />{" "}
      </div>{" "}
    </section>
  );
}
