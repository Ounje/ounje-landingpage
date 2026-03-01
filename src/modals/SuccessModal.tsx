import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white rounded-3xl w-full max-w-md p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <img src="/images/ounje-logo.png" alt="Ounje Logo" className="w-7 h-7" />
              <span className="text-[#1A3F1C] font-extrabold text-lg">OUNJEFOOD</span>
            </motion.div>

            {/* Success icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-9 h-9 text-[#2C5E2E]" />
            </motion.div>

            {/* Success pot */}
            <motion.img
              src="/icons/success-pot.png"
              alt="Success Icon"
              className="w-[120px] md:w-[150px] mx-auto mb-4"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.4, delay: 0.3 },
                scale: { duration: 0.4, delay: 0.3 },
                y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              }}
            />

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              className="text-[#1A3F1C] font-extrabold text-xl md:text-2xl leading-snug mb-2"
            >
              You're on the list! 🎉
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.35 }}
              className="text-gray-500 text-sm md:text-base mb-6"
            >
              Thank you for joining our waitlist. We'll notify you the moment the app goes live!
            </motion.p>

            {/* Button */}
            <motion.button
              onClick={onClose}
              className="w-full bg-[#2C5E2E] text-white py-3.5 rounded-2xl text-base font-bold hover:bg-[#1a3f1c] transition shadow-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Awesome, got it!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
