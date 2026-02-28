import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero() {
  const phrases = ["We'd love to hear from you", "Contact us"];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let timeout: number;

    if (!isDeleting && displayText.length < currentPhrase.length) {
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
      }, 100);
    } else if (!isDeleting && displayText.length === currentPhrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
      }, 50);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentPhraseIndex, isDeleting]);

  return (
    <section
      id="contactHero"
      className="relative overflow-hidden bg-gradient-to-b from-[#ECFFED] to-white pt-28 pb-12 md:pb-16"
    >
      {/* Decorative blobs */}
      <div className="absolute top-10 left-[5%] w-56 h-56 bg-[#FFC727]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-[5%] w-48 h-48 bg-[#2C5E2E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2C5E2E] shadow-sm"
        >
          <span className="w-2 h-2 bg-[#FFC727] rounded-full animate-pulse inline-block" />
          Get In Touch
        </motion.div>

        {/* Animated heading */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={currentPhraseIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-extrabold text-[#2C5E2E] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 min-h-[1.2em] flex items-center"
          >
            {displayText}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="ml-1 text-[#FFC727]"
            >
              |
            </motion.span>
          </motion.h1>
        </AnimatePresence>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#2C5E2E]/70 text-sm md:text-base lg:text-lg mb-8 max-w-lg"
        >
          Feel free to reach out to us with any question, feedback or inquiry.
        </motion.p>

        {/* Mascot image */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="/public/images/contactUsHero-img.png"
              alt="Ounje mascot"
              className="w-[180px] sm:w-[220px] md:w-[300px] lg:w-[380px] h-auto object-contain drop-shadow-xl"
            />
          </motion.div>

          {/* Floating contact badges */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-8 bg-white border border-[#2C5E2E]/20 rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs font-semibold text-[#1A3F1C]"
          >
            💬 Chat with us
          </motion.div>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-6 bottom-16 bg-[#FFC727] rounded-2xl px-3 py-2 shadow-lg flex items-center gap-2 text-xs font-semibold text-[#1A3F1C]"
          >
            📧 Quick response
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
