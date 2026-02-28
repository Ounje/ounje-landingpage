import { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import ComingSoonModal from "../modals/ComingSoonDialog";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";
import { ShoppingBag, ArrowRight } from "lucide-react";

const HeroSection = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Ounje", "Nri", "Abinci"];

  useEffect(() => {
    if (isInView) controls.start("show");
  }, [isInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-[580px] md:min-h-[900px] lg:min-h-[1000px] overflow-hidden bg-gradient-to-b from-[#ECFFED] to-[#f8fff8]"
    >
      {/* Background blobs */}
      <div className="absolute top-10 left-[5%] w-48 h-48 md:w-96 md:h-96 bg-[#FFC727]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-[5%] w-40 h-40 md:w-80 md:h-80 bg-[#2C5E2E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FFC727]/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={container}
        initial="hidden"
        animate={controls}
        className="relative z-10 flex flex-col items-center text-center pt-28 md:pt-36 px-4"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="mb-5 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-[#2C5E2E] shadow-sm"
        >
          <span className="w-2 h-2 bg-[#FFC727] rounded-full animate-pulse inline-block" />
          Nigeria's Fastest Food Delivery
        </motion.div>

        {/* Rotating word */}
        <div
          className="relative flex items-center justify-center overflow-hidden w-full"
          style={{ height: "clamp(80px, 18vw, 300px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.h1
              key={words[currentWordIndex]}
              className="font-extrabold text-[#2C5E2E] leading-none select-none absolute"
              style={{ fontSize: "clamp(72px, 16vw, 280px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {words[currentWordIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="mt-4 md:mt-6 text-sm md:text-xl text-[#4a4a4a] font-semibold tracking-wide"
        >
          Order Fast. Eat Fresh. Spend Less.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 items-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsOrderOpen(true)}
            className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 md:px-10 md:py-4 rounded-2xl shadow-lg hover:bg-[#1fb855] transition text-sm md:text-base"
          >
            <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
            Order Now via WhatsApp
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsWaitlistOpen(true)}
            className="flex items-center gap-2 bg-[#FFC727] text-[#1A3F1C] font-bold px-7 py-3.5 md:px-10 md:py-4 rounded-2xl shadow-lg hover:bg-[#ffda55] transition text-sm md:text-base"
          >
            Join the Waitlist
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          variants={fadeUp}
          className="mt-6 flex flex-wrap justify-center items-center gap-3 text-xs md:text-sm text-[#4a4a4a]"
        >
          {[
            { icon: "🍛", text: "Local Meals" },
            { icon: "⚡", text: "Fast Delivery" },
            { icon: "💰", text: "Affordable" },
          ].map((item) => (
            <span
              key={item.text}
              className="flex items-center gap-1.5 bg-white/70 backdrop-blur-sm border border-[#2C5E2E]/15 rounded-full px-3 py-1.5 font-medium shadow-sm"
            >
              {item.icon} {item.text}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom illustrations */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 right-0 flex justify-around items-end pointer-events-none px-2 sm:px-8 z-10"
      >
        <img
          src="/icons/Street Food-cuate.png"
          alt="Street Food"
          className="w-[140px] h-auto md:w-[280px] lg:w-[420px] object-contain drop-shadow-xl"
        />
        <img
          src="/icons/Take Away-cuate.png"
          alt="Take Away"
          className="w-[140px] h-auto md:w-[280px] lg:w-[420px] object-contain drop-shadow-xl"
        />
      </motion.div>

      <ComingSoonModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <WhatsAppOrderModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </section>
  );
};

export default HeroSection;
