import React from "react";

const AbokiNaSection = () => (
  <section className="bg-[#234a1f] py-10 text-white text-center flex flex-col justify-center items-center">
    <h2 className="text-3xl font-bold mb-6">Aboki na</h2>
    <p className="mb-8 text-white text-[12px]">
      Order for better food, make your belle just full.
    </p>
    <div
      className="w-full bg-contain w-full h-[80vh]"
      style={{ backgroundImage: `url(/images/aboki-section-image.png)` }}
    ></div>
  </section>
);

export default AbokiNaSection;
