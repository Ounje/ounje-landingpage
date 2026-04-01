import { useRef, useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
} from "framer-motion";
import ComingSoonModal from "../modals/ComingSoonDialog";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";
import { ShoppingBag, Bell } from "lucide-react";

const phrases = [
  { text: "Come chop.", lang: "Pidgin" },
  { text: "Zo ka chi abinci.", lang: "Hausa" },
  { text: "Bia rie nri.", lang: "Igbo" },
  { text: "Wa jeun.", lang: "Yoruba" },
];

const dishes = [
  "Jollof Rice",
  "Pounded Yam & Egusi",
  "Suya",
  "Fried Rice",
  "Amala & Ewedu",
  "Moi Moi",
  "Pepper Soup",
  "Eba & Okro",
  "Grilled Chicken",
  "Small Chops",
  "Fried Plantain",
  "Ofada Stew",
];

// Duplicate for seamless loop
const tickerItems = [...dishes, ...dishes];

const HeroSection = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    if (isInView) controls.start("show");
  }, [isInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.16, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-[580px] md:min-h-[900px] lg:min-h-[1000px] overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #B8DEFF 0%, #D4ECFF 30%, #EAF6FF 62%, #F0FFF4 100%)",
      }}
    >
      {/* Sun */}
      <div
        className="absolute top-14 right-[12%] md:right-[18%] w-16 h-16 md:w-24 md:h-24 bg-[#FFC727] rounded-full pointer-events-none z-0"
        style={{
          boxShadow:
            "0 0 50px 25px rgba(255,199,39,0.30), 0 0 100px 60px rgba(255,220,100,0.12)",
        }}
      />

      {/* Cloud 1 */}
      <motion.div
        animate={{ x: [0, 28, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[6%] pointer-events-none z-0"
      >
        <div className="relative h-10 w-28 md:w-44 md:h-14">
          <div className="absolute inset-0 rounded-full bg-white/75" />
          <div className="absolute w-16 h-12 rounded-full -top-4 left-5 md:w-22 md:h-14 bg-white/75" />
          <div className="absolute w-12 rounded-full -top-2 right-3 h-9 md:w-18 md:h-11 bg-white/75" />
        </div>
      </motion.div>

      {/* Cloud 2 */}
      <motion.div
        animate={{ x: [0, -22, 0] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute top-28 right-[28%] pointer-events-none z-0 hidden md:block"
      >
        <div className="relative w-20 h-8">
          <div className="absolute inset-0 rounded-full bg-white/55" />
          <div className="absolute rounded-full -top-3 left-4 w-14 h-9 bg-white/55" />
        </div>
      </motion.div>

      {/* Cloud 3 */}
      <motion.div
        animate={{ x: [0, 15, 0] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute top-10 right-[4%] pointer-events-none z-0 hidden lg:block"
      >
        <div className="relative w-16 h-6">
          <div className="absolute inset-0 rounded-full bg-white/45" />
          <div className="absolute w-10 rounded-full -top-2 left-3 h-7 bg-white/45" />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={controls}
        className="relative z-10 flex flex-col items-center px-4 pt-24 text-center md:pt-32"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-[#2C5E2E] shadow-sm"
        >
          <span className="w-2 h-2 bg-[#FFC727] rounded-full animate-pulse inline-block" />
          Authentic Nigerian Food
        </motion.div>

        {/* Static headline */}
        <motion.h1
          variants={fadeUp}
          className="font-extrabold text-[#1A3F1C] leading-[1.05] tracking-tight mb-4"
          style={{ fontSize: "clamp(42px, 9vw, 120px)" }}
        >
          Naija food,
          <br />
          at your door{" "}
          <span className="text-[#2C5E2E] relative inline-block">
            fast.
            {/* underline accent */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 right-0 h-[4px] md:h-[6px] bg-[#FFC727] rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {/* Rotating multilingual subtext */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center h-8 gap-3 mb-7 md:mb-9 md:h-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="flex items-center gap-2.5"
            >
              {/* Language label */}
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#2C5E2E]/40 leading-none">
                {phrases[phraseIndex].lang}
              </span>
              <span className="w-px h-4 bg-[#2C5E2E]/20" />
              {/* Phrase */}
              <span className="text-base md:text-xl font-semibold text-[#1A3F1C]/75 italic">
                {phrases[phraseIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Food ticker */}
        <motion.div
          variants={fadeUp}
          className="relative w-full max-w-lg mb-8 overflow-hidden md:max-w-2xl md:mb-10"
        >
          {/* fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#EAF6FF] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#EAF6FF] to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap will-change-transform"
          >
            {tickerItems.map((dish, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2.5 px-3 text-xs md:text-sm font-semibold text-[#1A3F1C]/60"
              >
                {dish}
                <span className="text-[#FFC727] text-sm leading-none">·</span>
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col items-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsOrderOpen(true)}
            className="flex items-center gap-2.5 bg-[#25D366] text-white font-bold px-8 py-4 md:px-12 md:py-4 rounded-2xl shadow-xl hover:bg-[#1fb855] transition-colors text-sm md:text-base"
          >
            <ShoppingBag className="w-5 h-5" />
            Order Now via WhatsApp
          </motion.button>

          <button
            onClick={() => setIsWaitlistOpen(true)}
            className="group flex items-center gap-1.5 text-[#1A3F1C]/60 text-sm font-semibold hover:text-[#2C5E2E] transition-colors mt-1"
          >
            <Bell className="w-3.5 h-3.5" />
            Get notified when the app launches
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>

        {/* Live coverage + pulse */}
        <motion.div
          variants={fadeUp}
          className="mt-5 flex items-center gap-2 text-xs text-[#4a4a4a]/60 font-medium"
        >
          <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
          Now delivering in Lagos · Yaba · Ikeja · Berger · Surulere
        </motion.div>
      </motion.div>

      {/* Ground strip */}
      <div className="absolute bottom-0 left-0 right-0 h-14 md:h-20 bg-[#2C5E2E]/30 pointer-events-none z-0" />

      {/* Road */}
      <div className="absolute bottom-2 md:bottom-4 left-0 right-0 h-6 md:h-10 bg-[#3d3d3d]/45 pointer-events-none z-0">
        <div
          className="absolute left-0 right-0 -translate-y-1/2 pointer-events-none top-1/2"
          style={{
            height: "2px",
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 24px, transparent 24px, transparent 48px)",
          }}
        />
      </div>

      {/* Left illustration */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.85, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 z-10 pointer-events-none"
      >
        <img
          src="/icons/Street Food-cuate.png"
          alt="Person ordering food"
          className="w-[130px] h-auto md:w-[260px] lg:w-[390px] object-contain drop-shadow-2xl"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Right illustration */}
      <motion.div
        initial={{ x: 120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
        className="absolute bottom-0 right-0 z-10 pointer-events-none"
      >
        <img
          src="/icons/Take Away-cuate.png"
          alt="Food delivery arriving"
          className="w-[130px] h-auto md:w-[260px] lg:w-[390px] object-contain drop-shadow-2xl"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      <ComingSoonModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
      />
      <WhatsAppOrderModal
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
      />
    </section>
  );
};

export default HeroSection;
