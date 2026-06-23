import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or declined
    const consent = localStorage.getItem("ounje_cookie_consent");
    if (!consent) {
      // Small delay for natural transition feel
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ounje_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("ounje_cookie_consent", "declined");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 220 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[100] bg-black/95 backdrop-blur-md rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col gap-4 text-white"
        >
          {/* Header block */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/10 text-[#FFC727] rounded-xl flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">We Value Your Privacy</h4>
                <p className="text-[9px] text-[#FFC727] font-black uppercase tracking-wider mt-0.5">Cookie Preferences</p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
              title="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description text */}
          <p className="text-xs text-gray-300 leading-relaxed font-medium">
            We use cookies and local storage to enhance your browsing experience, analyze traffic, and personalize our services. Read our{" "}
            <Link
              to="/privacyandcompliance?tab=3"
              onClick={() => setIsVisible(false)}
              className="text-[#FFC727] hover:underline font-bold"
            >
              Cookies Policy
            </Link>{" "}
            for details.
          </p>

          {/* Actions button group */}
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={handleDecline}
              className="flex-1 bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="flex-1 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md hover:scale-[1.02] active:scale-98 cursor-pointer"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
