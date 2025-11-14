import { motion } from "framer-motion";
import { useState } from "react";
import ComingSoonModal from "../modals/ComingSoonDialog";

const CustomerSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="customer" className="bg-[#FFF3E8] min-h-[717px] py-16 px-4 text-black flex justify-center items-center">
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl w-full items-center">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-[#000000]">
            Order Fast With <span className="text-[#000000]">OunjeFood!!</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-snug">
            Stressed to cook? Have a lot of work at hand? <br />
            Don't want to break your bank? Download <br /> Ounje food app
            and place order fast.
          </p>

          {/* Join Waitlist Button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#FFC727] text-[#1A3F1C] flex justify-center items-center gap-2 md:font-semibold 
                       w-[200px] h-[39px] md:w-[275px] md:h-[45px] lg:w-[359px] lg:h-[66px]
                       rounded-[8px] md:rounded-[20px] hover:bg-[#ffda55] transition"
          >
            <span>Join the waitlist</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-[18px] h-[18px]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 12h14m-7-7 7 7-7 7"
              />
            </svg>
          </motion.button>
        </div>

      {/* Animation Container */}
      <div className="md:w-1/2 relative h-[400px] md:h-[500px] w-full">
        {/* Background blob */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute w-full h-full bg-yellow-300 rounded-full z-0 blur-2xl opacity-20 h-[220px]"
        />

        {/* Monitor */}
        <img
          src="/icons/monitor.png"
          alt="Monitor"
          className="absolute w-64 md:w-80 z-20 left-1/5 bottom-0 lg:h-[228px] lg:w-[400px]"
        />

        {/* Animated Arm */}
        <motion.img
          src="/icons/arm.png"
          alt="Arm with box"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: "backOut",
            duration: 2.5,
            delay: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute w-20  md:w-40 z-10 left-[7.5%] md:left-[10%] top-[65%] md:top-[50%] origin-bottom-left"
        />

        {/* Woman */}
        <motion.img
          src="/icons/woman.png"
          alt="Woman"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute w-48 md:w-64 z-10 right-10 md:right-30 bottom-0"
        />

        {/* Speech Bubble */}
        <motion.img
          src="/icons/bubble.png"
          alt="bubble"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            ease: "backOut",
            duration: 2.5,
            delay: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute w-[60px] md:w-[100px] z-10 right-[148px] md:right-[170px] bottom-[158px] md:bottom-[205px]"
        />
      </div>

      {/* Modal */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  </section>
  );
};

export default CustomerSection;
