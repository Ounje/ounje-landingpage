import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import ComingSoonModal from "../modals/ComingSoonDialog";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const [currentWord, setCurrentWord] = useState("Ounje");
  const words = ["Ounje", "Nri", "Abinci"];

  useEffect(() => {
    if (isInView) controls.start("show");
  }, [isInView, controls]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % words.length;
      setCurrentWord(words[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section ref={ref} id="home" className="relative h-[420px] md:h-[1000px]">
      {/* Hero Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={controls}
        className="relative z-10 flex flex-col items-center text-center text-black pt-5 px-3 h-full"
      >
        {/* Heading (Animated Words) */}
        <motion.h1
          variants={fadeUp}
          key={currentWord}
          className="text-6xl md:text-[200px] lg:text-[350px] font-bold mb-2 mt-20 md:mt-20 text-[#2C5E2E]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {currentWord}
        </motion.h1>

        {/* Subtext ABOVE the button */}
        <motion.p
          variants={fadeUp}
          className="mb-2 md:mb-6 text-[12px] md:text-[20px] text-black mt-5 md:mt-10"
        >
          Order Fast. Eat Fresh. Spend Less
        </motion.p>

        {/* Join Waitlist Button */}
        <motion.button
          variants={fadeUp}
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
      </motion.div>

      {/* Illustrations (Closer Spacing) */}
      <motion.div
        variants={fadeUp}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -bottom-[5%] left-0 right-0 flex justify-around items-end pointer-events-none px-2 sm:px-4"
      >
        <img
          src="/icons/Street Food-cuate.png"
          alt="Street Food"
          className="w-[157px] h-[105px] md:w-[320px] md:h-[200px] lg:w-[500px] lg:h-[320px] object-contain"
        />
        <img
          src="/icons/Take Away-cuate.png"
          alt="Take Away"
          className="w-[157px] h-[105px] md:w-[320px] md:h-[190px] lg:w-[500px] lg:h-[300px] object-contain"
        />
      </motion.div>

      {/* Modal */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;
