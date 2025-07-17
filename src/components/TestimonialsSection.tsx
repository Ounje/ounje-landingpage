import React from "react";

const TestimonialsSection = () => (
  <section
    className="relative bg-cover bg-center bg-no-repeat py-10 text-white text-center "
    style={{ backgroundImage: `url(/images/testimonial-bg.png)` }}
  >
    <div className="absolute inset-0 bg-[#2C5E2E80]" />

    <div className="relative">
      <div className="mb-6">
        <h2 className="text- md:text-3xl font-bold ">Testimonials</h2>
        <p className="text-white font-small text-[12px]">
          What our customers and Vendors are enjoying. Be a part of the
          community
        </p>
      </div>
      <div className="flex justify-center rounded-[10px]">
        <div className="bg-[#2C5E2E]  md:flex justify-center items-center text-white w-[70%] shadow p-6 rounded-[10px]">
          <img
            src="/images/uche-amadi.png"
            alt="Uche Amadi"
            className="md:w-40 md:h-full w-30 h-[156px] mb-4 object-cover rounded-[10px] mx-auto"
          />
          <div className=" text-center md:text-left gap-5 p-5 flex flex-col">
            <div className="font-bold text-md md:text-lg md:mb-0.5">
              Uche Amadi
            </div>
            <div className="text-sm md:mb-2">Unilag Student</div>
            <p className="text-sm text-white md:pr-[300px]">
              "With Ounje, you make an order so easily in Lagos. It's hard to
              even order for a meal anywhere, but Ounje delivers. I have been
              eating good food worth my money!""
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
