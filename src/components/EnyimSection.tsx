import React from "react";

const features = [
  { icon: "🍲", label: "Big Portion" },
  { icon: "⭐", label: "Amazing Taste" },
  { icon: "🚚", label: "Fast Delivery" },
  { icon: "💳", label: "Pay on Delivery" },
];

const EnyimSection = () => (
  <section className="bg-[#466C3A] py-10 text-white text-center">
    <h2 className="text-3xl font-bold mb-6">Enyim</h2>
    <p className="mb-8 text-white">Relax, make i show you why we too good.</p>
    <div className="flex flex-wrap justify-center gap-6">
      {features.map((f, i) => (
        <div
          key={i}
          className="bg-[#F3C623] text-[#234a1f] rounded-lg shadow p-6 w-40 flex flex-col items-center"
        >
          <span className="text-4xl mb-2">{f.icon}</span>
          <span className="font-semibold">{f.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default EnyimSection;
