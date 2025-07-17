import React from "react";

const HeroSection = () => (
  <section
    className="relative top-0 h-[420px] md:h-[1000px] flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage: `url(/images/left-hero-image.png),
         url(/images/right-hero-image.png)`,
      backgroundSize: "50% 100%",
      backgroundPosition: "left, right",
      backgroundRepeat: "no-repeat",
    }}
  >
    {/* Color Overlay */}
    <div className="absolute inset-0 bg-[#2C5E2E80]" />
    {/* Hero content */}
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex flex-col items-center text-center text-white px-3">
      <h1 className="text-5xl md:text-[350px] font-bold mb-4">Ounje</h1>
      <div className="flex gap-7 mt-20 text-[12px] md:text-[20px]">
        <button className="bg-yellow-400 text-[#234a1f] flex justify-center items-center gap-2 md:font-semibold px-3 py-0.5 md:px-5 md:py-2 rounded-[20px] hover:bg-yellow-300 transition">
          <img
            src="/icons/mage_playstore.png"
            alt="playstore icon"
            className="w-[30px]  h-[30px]"
          />
          <span>Download on Google Play</span>
        </button>
        <button className="bg-yellow-400 text-[#234a1f] flex justify-center items-center gap-2 md:font-semibold px-3 py-0.5 md:px-5 md:py-2 rounded-[20px] hover:bg-yellow-300 transition">
          <img
            src="/icons/apple-icon.png"
            alt="ios-icon"
            className="w-[30px]  h-[30px]"
          />
          <span>Download on APP Store</span>
        </button>
      </div>
      <p className="mb-6 text-[12px] md:text-[20px] font-small text-white mt-5 md:mt-10">
        Big Portions, Affordable Prices
      </p>
    </div>
  </section>
);

export default HeroSection;
