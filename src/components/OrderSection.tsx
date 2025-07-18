import React from "react";

const OrderSection = () => (
  <section className="bg-[#2C5E2E] py-12 px-2 text-white text-center">
    <h2 className="text-5xl font-extrabold mb-2 tracking-tight">
      Place Order In Seconds
    </h2>
    <p className="mb-6 text-lg text-white">And get good and quality food</p>
    <div className="flex justify-center mb-8">
      <img
        src="/images/customer.png"
        alt="Order"
        className="rounded-xl object-contain w-full max-w-3xl h-[400px] "
      />
    </div>
    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
      <button className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl text-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 w-full sm:w-auto">
        <img src="/icons/mage_playstore.png" alt="andriod icon" />
        <span>Download on Google Play</span>
      </button>
      <button className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl text-lg hover:bg-yellow-300 transition flex items-center justify-center gap-2 w-full sm:w-auto">
        <img src="/icons/apple-icon.png" alt="ios icon" />
        <span>Download on APP Store</span>
      </button>
    </div>
  </section>
);

export default OrderSection;
