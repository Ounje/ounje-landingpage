import React from "react";

const foodImages = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
];

const AbokiNaSection = () => (
  <section className="bg-[#234a1f] py-10 text-white text-center">
    <h2 className="text-3xl font-bold mb-6">Aboki na</h2>
    <p className="mb-8">Order for better food, make your belle just full.</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {foodImages.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="food"
          className="rounded-lg object-cover w-full h-32 md:h-40"
        />
      ))}
    </div>
  </section>
);

export default AbokiNaSection;
