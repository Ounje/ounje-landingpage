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
      <section className="p-5 mb-20 h-[100vh] md:h-[120vh]">
        {/* content */}
        <div className=" items-center text-center mt-20">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentPhraseIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-[#2C5E2E] text-4xl md:text-6xl mt-20 pt-10"
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
          <p className="text-[#2C5E2E] mt-10">
            Feel free to reach out to us with any question, feedback or
            inquiries.
          </p>
          <div className="flex justify-center mt-10">
            <img
              src="/images/contactUsHero-img.png"
              alt="ounje masscot image"
              className=" items-center w-[246px] h-[286px] lg:w-[470px] lg:h-[545px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
