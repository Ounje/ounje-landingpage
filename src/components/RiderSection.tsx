import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const RiderSection = () => {
  return (
    <section
      id="rider"
      className="
        bg-[#FFF3E8]
        min-h-[717px]
        py-10 sm:py-12 md:py-16
        px-4 text-black
        flex justify-center items-center
      "
    >
      <div className="flex flex-col md:flex-row gap-2 lg:gap-10 max-w-6xl w-full items-center">
        <div className="flex flex-col gap-5">
          <h2>
            Join The Ounje<br />food Force!! <br />
            Deliver happiness.
          </h2>
          <p className="md:w-[396px]">
            Earn daily on your schedule.<br /> Deliver meals, make lives easier.
          </p>
        </div>

        <div className="md:w-1/2 relative h-[260px] md:h-[400px] lg:h-[500px] w-full">
          <img
            src="/images/device-map.png"
            alt="phone"
            className="absolute z-10 left-1/5 bottom-0 h-[201px] w-[98px] md:h-[300px] md:w-[150px] lg:h-[412px] lg:w-[202px]"
          />

          <motion.img
            initial={{ x: 0 }}
            animate={{ x: 120 }}
            transition={{
              duration: 2,
              type: "spring",
              repeat: Infinity,
            }}
            src="/images/delivery-guy.png"
            alt="delivery guy"
            className="absolute z-10 left-[10%] bottom-0 w-[173px] h-[152] md:w-[260px] md:h-[230px] lg:w-[355px] lg:h-[312px]"
          />

          <motion.img
            initial={{ y: 0 }}
            animate={{ y: 250 }}
            transition={{
              duration: 2,
              type: "spring",
              repeat: Infinity,
            }}
            src="/icons/location-icon.png"
            alt="icon"
            className="hidden md:block absolute z-10 left-[60%] lg:left-[110%] w-[40px] h-[40px] lg:w-[80px] lg:h-[100px]"
          />

          {/* location icon for mobile screens */}
          <motion.img
            initial={{ y: 0 }}
            animate={{ y: 130 }}
            transition={{
              duration: 2,
              type: "spring",
              repeat: Infinity,
            }}
            src="/icons/location-icon.png"
            alt="icon"
            className="md:hidden absolute z-10 left-[70%] lg:left-[110%] w-[50px] h-[50px] lg:w-[80px] lg:h-[100px]"
          />
        </div>
      </div>
    </section>
  );
};

export default RiderSection;
