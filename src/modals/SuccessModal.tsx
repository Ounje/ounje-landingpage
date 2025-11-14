import { motion, AnimatePresence } from "framer-motion";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* MODAL BOX */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-[#A7F3A4] rounded-[20px] w-[90%] max-w-[600px] p-8 text-center shadow-xl"
          >
            {/* LOGO + OUNJEFOOD */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <img
                src="/logo/ounje.png"
                alt="Ounje Logo"
                className="w-[34px] h-[39px] md:w-[40px] md:h-[44px]"
              />
              <span className="text-[#1A3F1C] font-bold text-xl md:text-2xl">
                OUNJEFOOD
              </span>
            </motion.div>

            {/* TITLE */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.35 }}
              className="text-[#1A3F1C] font-extrabold text-2xl md:text-4xl leading-snug mb-4"
            >
              Thank you for <br /> joining our waitlist!
            </motion.h2>

            {/* SUCCESS POT IMAGE WITH ANIMATIONS */}
            <motion.img
              src="/icons/success-pot.png"
              alt="Success Icon"
              className="w-[150px] md:w-[200px] mx-auto mb-4"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0], // floating animation
              }}
              transition={{
                opacity: { duration: 0.4, delay: 0.35 },
                scale: { duration: 0.4, delay: 0.35 },
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />

            {/* SUBTEXT */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.35 }}
              className="text-[#1A3F1C] text-sm md:text-base mb-6"
            >
              You’ll be notified once the app is live!!!
            </motion.p>

            {/* OKAY BUTTON */}
            <motion.button
              onClick={onClose}
              className="w-full bg-[#1A3F1C] text-white py-3 rounded-[12px] text-lg font-semibold hover:bg-[#224e23] transition"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Okay
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
