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
      // Typing animation
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
      }, 100); // Typing speed
    } else if (!isDeleting && displayText.length === currentPhrase.length) {
      // Pause at full phrase
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText.length > 0) {
      // Deleting animation
      timeout = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
      }, 50); // Deleting speed
    } else if (isDeleting && displayText.length === 0) {
      // Switch to next phrase
      setIsDeleting(false);
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, currentPhraseIndex, isDeleting]);

  return (
    <>
      <section id="contactHero" className="px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 min-h-[80vh] md:min-h-[90vh] flex items-center justify-center">
        {/* content */}
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center text-center">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentPhraseIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-[#2C5E2E] text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6"
            >
              {displayText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="ml-1"
              >
                |
              </motion.span>
            </motion.h1>
          </AnimatePresence>
          <p className="text-[#2C5E2E] text-sm md:text-base lg:text-lg mb-6 md:mb-8 max-w-2xl px-4">
            Feel free to reach out to us with any question, feedback or
            inquiries.
          </p>
          <div className="flex justify-center mt-4 md:mt-6">
            <img
              src="/images/contactUsHero-img.png"
              alt="ounje masscot image"
              className="w-[200px] h-[232px] sm:w-[246px] sm:h-[286px] md:w-[350px] md:h-[407px] lg:w-[470px] lg:h-[545px] object-contain"
            />
          </div>
        </div>
      </section>
    </>
  );
}
