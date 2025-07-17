import React from "react";

const TestimonialsSection = () => (
  <section className="bg-[#466C3A] py-10 text-white text-center">
    <h2 className="text-3xl font-bold mb-6">Testimonials</h2>
    <div className="flex justify-center">
      <div className="bg-white text-[#234a1f] rounded-lg shadow p-6 max-w-md w-full flex flex-col items-center">
        <img
          src="https://randomuser.me/api/portraits/men/32.jpg"
          alt="Uche Amadi"
          className="w-20 h-20 rounded-full mb-4 object-cover"
        />
        <div className="font-bold text-lg mb-1">Uche Amadi</div>
        <div className="text-sm mb-2">Unilag Student</div>
        <p className="text-sm">
          With Ounje, you make an order so easily in Lagos. It's hard to even
          order for a meal anywhere, but Ounje delivers. I have been eating good
          food worth my money!
        </p>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
