import { motion } from "framer-motion";

const CustomerSection = () => (
  <section className="bg-[#FFF3E8] min-h-[717px] py-16 px-4 text-black flex justify-center items-center">
    <div className="flex flex-col md:flex-row gap-10 max-w-6xl w-full items-center">
      {/* Text Content */}
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-[#2C5E2E]">
          Order Fast With <span className="text-[#FFA500]">Ounje!</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-700">
          Stressed to cook? Have a lot of work at hand? Don't want to break your
          bank? Download Ounje and place order fast.
        </p>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-[#2C5E2E] text-white px-2 py-2 rounded-[8px] hover:bg-[#1E4120] transition">
            <img
              src="/icons/andriod-white.png"
              alt="Android"
              className="w-6 h-6 rounded-[8px]"
            />
          </button>
          <button className="flex items-center gap-2 bg-[#2C5E2E] text-white px-2 py-2 rounded-[8px] hover:bg-[#1E4120] transition">
            <img
              src="/icons/apple-white.png"
              alt="Apple"
              className="w-6 h-6 "
            />
          </button>
        </div>
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
    </div>
  </section>
);

export default CustomerSection;
