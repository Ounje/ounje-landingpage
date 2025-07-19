import React from "react";

const features = [
  { icon: "/icons/dish-icon.png", label: "Big Portion" },
  { icon: "/icons/saving-icon.png", label: "Affordable Price" },
  { icon: "/icons/store-icon.png", label: "Local Vendor Support" },
  { icon: "/icons/delivery-icon.png", label: "Swift & Fast Delivary" },
  { icon: "/icons/payment-icon.png", label: "Swift Payment & Support" },
];

const EnyimSection = () => (
  <section className="bg-[#2C5E2E] py-10 text-white text-center">
    <h2 className="text-3xl font-bold mb-6">Enyim</h2>
    <p className="mb-8 text-white">Relax, make i show you why we too good.</p>
    <div className="flex flex-wrap justify-center gap-[60px]">
      {features.map((f, i) => (
        <div
          key={i}
          className="bg-[#F3C623] text-[#234a1f] rounded-[20px] shadow py-[30px] px-[20px] w-40 flex flex-col items-center"
        >
          <img src={f.icon} alt={f.label} className="font-small" />
          <span className="font-small text-[16px]">{f.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default EnyimSection;
