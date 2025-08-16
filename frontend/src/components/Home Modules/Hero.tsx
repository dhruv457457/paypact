import React from "react";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-[#09090B] text-white overflow-hidden pt-14">
     
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen  border-t border-[#1C1C1E]">
        {/* Customer Avatars Section */}
        <div className=" flex items-center gap-2 border-x border-t border-[#1C1C1E] p-2">
          <div className="flex items-center justify-center mb-2">
            <div className="flex -space-x-2">
              <img
                className="w-8 h-8 rounded-full"
                src="https://assets.basehub.com/fa068a12/6sGiFfUGTaMBQFStD16V5/figma-image-500x500.png?height=100&quality=100&width=100"
                alt=""
              />
              <img
                className="w-8 h-8 rounded-full"
                src="https://assets.basehub.com/fa068a12/XdbZC6Y1mPpNarRwWXWGs/103cd669723f80c168b5d84ec8bbe0a5.png?height=100&quality=100&width=100"
                alt=""
              />
              <img
                className="w-8 h-8 rounded-full"
                src="https://assets.basehub.com/fa068a12/eXjW9QO3AKz15Ru0lRyaL/97a514e9e8c98d647f06c12400f1f0bd-(1).png?height=100&quality=100&width=100"
                alt=""
              />
            </div>
          </div>
          <p className="text-gray-400 text-sm">1,254 happy customers</p>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl font-bold text-center mb-6 w-full leading-tight border-t border-[#1C1C1E] pt-10">
          Secure, Simple, & Smart Payments
          <br />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            with PayPact
          </span>
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-md text-center mb-12 max-w-2xl leading-relaxed">
          PayPact makes sending, receiving, and managing money effortless. Enjoy
          instant transactions, contract-backed commitments, and full
          transparency - all in one trusted platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col mb-16 border-y border-[#1C1C1E] w-full justify-center items-center pb-20 relative">
          <button className="px-20 py-3 bg-transparent border-x border-[#1C1C1E] text-white hover:bg-gray-900 transition-colors">
            Learn More
          </button>

          <div className="relative">
            <button className="px-20 py-3 bg-[#7f48de] text-white hover:bg-[#7437DC] transition-colors font-medium relative z-10">
              Get Started
            </button>
            {/* Glow below the button */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-4xl h-16 bg-[#201735] blur-2xl rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default HeroSection;
