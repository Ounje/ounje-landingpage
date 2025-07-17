import React from "react";

const steps = [
  { label: "Browse for Vendors", icon: "📱" },
  { label: "Place Order", icon: "🛒" },
  { label: "Simple Rider Tracking Update", icon: "🚴" },
];

const OreMiSection = () => (
  <section className="bg-white py-10 text-center">
    <h2 className="text-3xl font-bold mb-2 text-[#234a1f]">Ore mi</h2>
    <p className="mb-8 text-[#466C3A]">
      Be a part of our amazing community. Let's show you how Ounje works
    </p>
    <div className="flex flex-wrap justify-center gap-6">
      {steps.map((step, i) => (
        <div
          key={i}
          className="bg-white border-2 border-[#466C3A] rounded-lg shadow p-6 w-56 flex flex-col items-center"
        >
          <div className="text-5xl mb-4">{step.icon}</div>
          <span className="font-semibold mb-2">{step.label}</span>
        </div>
      ))}
    </div>
    <div className="flex justify-center gap-4 mt-6">
      <button className="bg-yellow-400 text-[#234a1f] font-semibold px-5 py-2 rounded hover:bg-yellow-300 transition">
        Browse for Vendors
      </button>
      <button className="bg-yellow-400 text-[#234a1f] font-semibold px-5 py-2 rounded hover:bg-yellow-300 transition">
        Place Order
      </button>
      <button className="bg-yellow-400 text-[#234a1f] font-semibold px-5 py-2 rounded hover:bg-yellow-300 transition">
        Simple Rider Tracking Update
      </button>
    </div>
  </section>
);

export default OreMiSection;
