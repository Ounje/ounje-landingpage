import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import SuccessModal from "./SuccessModal"; // << ADD THIS

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({
  isOpen,
  onClose,
}: ComingSoonModalProps) {
  const [successOpen, setSuccessOpen] = useState(false);  // << ADDED

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* MODAL BOX */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#2C5E2E] text-white rounded-[20px] w-[90%] max-w-[960px] p-6 md:p-10"
            >
              {/* CLOSE BUTTON */}
              <motion.button
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              {/* LOGO + TITLE */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-2 mb-6"
              >
                <img
                  src="/logo/ounje.png"
                  alt="Ounje Logo"
                  className="w-[30px] h-[34px] md:w-[40px] md:h-[44px]"
                />
                <span className="text-white font-bold text-lg md:text-2xl">
                  OUNJE
                </span>
              </motion.div>

              {/* HEADER */}
              <motion.h1
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-center text-3xl md:text-5xl font-extrabold mb-4"
              >
                Coming Soon!!
              </motion.h1>

              {/* SUBTEXT */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-center text-[#FFFFFF] text-base md:text-lg max-w-[700px] mx-auto mb-8"
              >
                Enter your mail to get notified when our app is available to
                download on all mobile platforms.
              </motion.p>

              {/* FORM GRID */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.12 },
                  },
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
              >
                {/* FIELD ANIMATION */}
                {[
                  "Enter Your First Name i.e Dayan",
                  "Enter Your Last Name",
                  "Phone Number",
                  "Email Address",
                ].map((placeholder, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    {i === 2 ? (
                      <div className="flex bg-white rounded-[12px] overflow-hidden">
                        <input
                          value="+234"
                          readOnly
                          className="w-[75px] px-4 py-4 bg-white text-black outline-none"
                        />
                        <input
                          type="tel"
                          placeholder={placeholder}
                          className="flex-1 px-4 py-4 bg-white text-black placeholder-[#00000080] outline-none"
                        />
                      </div>
                    ) : (
                      <input
                        type={i === 3 ? "email" : "text"}
                        placeholder={placeholder}
                        className="w-full px-4 py-4 rounded-[12px] bg-white text-black placeholder-[#00000080] outline-none"
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>

              {/* GET NOTIFIED BUTTON */}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                onClick={() => {
                  onClose(); // close current modal
                  setTimeout(() => setSuccessOpen(true), 300); // open success popup
                }}
                className="w-full md:w-[50%] mx-auto block bg-[#FFCA3A] hover:bg-[#ffdf6f] text-[#000000] font-semibold py-4 rounded-[12px] text-lg"
              >
                Get Notified
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS POPUP */}
      <SuccessModal isOpen={successOpen} onClose={() => setSuccessOpen(false)} />
    </>
  );
}
