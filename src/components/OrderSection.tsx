import React from "react";

const OrderSection = () => (
  <section className="bg-[#466C3A] py-10 text-white text-center">
    <h2 className="text-3xl font-bold mb-4">Place Order In Seconds</h2>
    <p className="mb-8">And get good and quality food</p>
    <div className="flex justify-center mb-6">
      <img
        src="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=500&q=80"
        alt="Order"
        className="rounded-lg object-cover w-full max-w-md h-48"
      />
    </div>
    <div className="flex justify-center gap-4">
      <button className="bg-yellow-400 text-[#234a1f] font-semibold px-5 py-2 rounded hover:bg-yellow-300 transition">
        Download on Google Play
      </button>
      <button className="bg-yellow-400 text-[#234a1f] font-semibold px-5 py-2 rounded hover:bg-yellow-300 transition">
        Download on APP Store
      </button>
    </div>
  </section>
);

export default OrderSection;
