import React from 'react';

// A simple spinner component using Tailwind CSS for animation
const Spinner = () => (
  <div
    className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-purple-400 motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status"
  >
    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
      Loading...
    </span>
  </div>
);

export default function LoadingOverlay({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-[#09090B] flex flex-col items-center justify-center z-[100] p-4 text-center">
      <Spinner />
      <p className="text-white text-lg font-semibold mt-4">
        {message || "Processing..."}
      </p>
      <p className="text-gray-400 text-sm mt-1">
        Please do not close this window.
      </p>
    </div>
  );
}