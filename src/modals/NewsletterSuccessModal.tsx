import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const NewsletterSuccessModal = ({ isOpen, onClose }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50"
          />

          {/* Modal card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl relative pointer-events-auto"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 220, damping: 16 }}
                className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle2 className="w-8 h-8 text-[#2C5E2E]" />
              </motion.div>

              {/* Brand */}
              <div className="flex items-center justify-center gap-1.5 mb-3">
                <img src="/images/ounje-logo.png" alt="Ounje" className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1A3F1C]">
                  OunjeFood
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#1A3F1C] mb-2">
                You're subscribed! 🎉
              </h3>
              <p className="text-sm text-gray-500 mb-7 leading-relaxed">
                Thanks for joining. We'll send you the best updates — no spam, just
                good food news.
              </p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full bg-[#2C5E2E] text-white font-bold py-3 rounded-2xl text-sm hover:bg-[#1A3F1C] transition-colors"
              >
                Got it!
              </motion.button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsletterSuccessModal;
