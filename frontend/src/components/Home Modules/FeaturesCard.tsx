import React from "react";

const features = [
  {
    // Icon for Pact Creation (Document with a plus)
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#19191b" />

        <path
          d="M14.5 8.5h-5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1Z"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M12 11v3m-1.5-1.5h3"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Instant Pact Creation",
    desc: "Define a payment name, amount, and participants in seconds. Launch a new group payment request with just a few clicks.",
  },
  {
    // Icon for QR Code Payments (QR Code)
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#19191b" />

        <path
          d="M8 8h2v2H8V8zm6 0h-2v2h2V8zm-2 6h2v2h-2v-2zm-4 0H8v2h2v-2zm0-4h2v2H8v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm2-2h-2v2h2V8zm-2 4h2v2h-2v-2z"
          fill="#fff"
        />
      </svg>
    ),
    title: "Seamless QR Code Payments",
    desc: "Participants pay using a unique Solana Pay QR code from their favorite mobile wallet. No more copying addresses.",
  },
  {
    // Icon for On-Chain Tracking (Checkmark)
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#19191b" />

        <path
          d="m9 12.5 2 2 4-4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Automated On-Chain Tracking",
    desc: "Payments are automatically detected and verified on the Solana blockchain. No more manual 'did you pay?' check-ins.",
  },
  {
    // Icon for User Onboarding (Person/User)
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#19191b" />

        <path
          d="M12 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM15.5 16s-1-2.5-3.5-2.5-3.5 2.5-3.5 2.5"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Frictionless User Onboarding",
    desc: "New users can create a wallet and log in with familiar social accounts or email, powered by Web3Auth.",
  },
  {
    // Icon for Organizer Dashboard (Bar Chart)
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#19191b" />

        <path
          d="M8 16V12m4 4V10m4 6V8"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Real-Time Organizer Dashboard",
    desc: "Get a bird's-eye view of your Pact. Instantly see who has paid, who is pending, and the total amount collected.",
  },
  {
    // Icon for Security (Shield)
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="12" fill="#19191b" />

        <path
          d="M12 7.5c3.5 0 5 1.5 5 3.5v2c0 2-1.5 3.5-5 3.5s-5-1.5-5-3.5v-2c0-2 1.5-3.5 5-3.5Z"
          stroke="#fff"
          strokeWidth="1.5"
        />
      </svg>
    ),
    title: "Secure & Transparent",
    desc: "Leverage the security and transparency of the Solana blockchain. All payment statuses are verifiable and tamper-proof.",
  },
];

export default function FeaturesCard() {
  return (
    <section className="relative min-h-[100vh] flex flex-col items-center justify-center bg-black text-white py-10 px-4 overflow-x-hidden">
      {/* Subtle radial gradient background accent */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 56% at 50% 28%, #242247 12%, transparent 80%)",
          opacity: 0.15,
        }}
      />
      <div className="relative z-10 flex flex-col items-center mb-10">
        <span className="px-5 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 font-medium mb-3">
          Decentralized Payments
        </span>

        <h1 className="text-[2.5rem] font-semibold leading-tight mb-2 text-center">
          Automated Group Payments on Solana
        </h1>

        <p className="text-base text-white/50 mt-2 max-w-2xl text-center">
          PayPact streamlines collecting payments from a group. Create a pact,
          share a link, and let our system automatically track who has paid on
          the Solana blockchain.
        </p>
      </div>
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-7xl">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="rounded-xl
         border border-[#1C1C1E]
            bg-[#0C0C0E]
             backdrop-blur-lg
         px-6 py-7
         flex flex-col
         shadow-md
     transition"
          >
            {/* Icon */}
            <div className="mb-4"> {f.icon}</div>

            <h3 className="text-lg font-semibold mb-1">{f.title}</h3>

            <p className="text-white/70 text-[1rem] leading-normal">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
