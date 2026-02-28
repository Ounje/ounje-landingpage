import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, type ChangeEvent } from "react";
import SuccessModal from "./SuccessModal";
import emailjs from "@emailjs/browser";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const env = (import.meta as { env: Record<string, string> }).env;
const WEB3FORMS_KEY = env.VITE_WEB3FORMS_KEY ?? "";
const EMAILJS_SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_CONFIRM_TEMPLATE_ID = env.VITE_EMAILJS_CONFIRM_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY ?? "";

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const [form, setForm] = useState<FormData>({ firstName: "", lastName: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [successOpen, setSuccessOpen] = useState(false);

  const set = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.phone.trim()) errs.phone = "Required";
    if (!form.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setStatus("sending");

    try {
      // 1. Notify admin via Web3Forms → arrives at ounjeeats@gmail.com
      const adminRes = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Waitlist Signup — ${form.firstName} ${form.lastName}`,
          from_name: "OunjeFood Waitlist",
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          phone: `+234${form.phone}`,
        }),
      });
      const adminData = await adminRes.json();
      if (!adminData.success) throw new Error("Admin notification failed");

      // 2. Send branded confirmation email back to the user via EmailJS
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_CONFIRM_TEMPLATE_ID,
        {
          to_email: form.email,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: `+234${form.phone}`,
          reply_to: "ounjeeats@gmail.com",
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setForm({ firstName: "", lastName: "", phone: "", email: "" });
      onClose();
      setTimeout(() => setSuccessOpen(true), 300);
    } catch {
      setStatus("error");
    }
  };

  const isSending = status === "sending";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative bg-[#2C5E2E] text-white rounded-3xl w-full max-w-2xl p-6 md:p-10 shadow-2xl overflow-hidden"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#FFC727]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {/* Close */}
              <motion.button
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute top-4 right-4 bg-white/15 hover:bg-white/25 p-2 rounded-full transition"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              {/* Logo + Brand */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex items-center gap-2 mb-6 relative z-10"
              >
                <img src="/public/logo/ounje.png" alt="Ounje Logo" className="w-8 h-9 md:w-10 md:h-11" />
                <span className="text-white font-extrabold text-lg md:text-xl">OUNJEFOOD</span>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-center mb-2 relative z-10"
              >
                <span className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold text-white/80 mb-3">
                  🚀 Launching Soon
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3">Coming Soon!!</h1>
                <p className="text-white/75 text-sm md:text-base max-w-md mx-auto">
                  Enter your details to get notified the moment our app is available to download.
                </p>
              </motion.div>

              {/* Form grid */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 mb-4 relative z-10"
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={set("firstName")}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-white text-gray-800 text-sm placeholder-gray-400 outline-none transition focus:ring-2 ${
                      errors.firstName ? "ring-2 ring-red-400" : "focus:ring-[#FFC727]"
                    }`}
                  />
                  {errors.firstName && <p className="text-red-300 text-xs mt-1 pl-1">{errors.firstName}</p>}
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={set("lastName")}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-white text-gray-800 text-sm placeholder-gray-400 outline-none transition focus:ring-2 ${
                      errors.lastName ? "ring-2 ring-red-400" : "focus:ring-[#FFC727]"
                    }`}
                  />
                  {errors.lastName && <p className="text-red-300 text-xs mt-1 pl-1">{errors.lastName}</p>}
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <div
                    className={`flex bg-white rounded-2xl overflow-hidden transition focus-within:ring-2 ${
                      errors.phone ? "ring-2 ring-red-400" : "focus-within:ring-[#FFC727]"
                    }`}
                  >
                    <span className="px-4 py-3.5 bg-gray-100 text-gray-600 text-sm font-semibold border-r border-gray-200 flex-shrink-0">
                      +234
                    </span>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={set("phone")}
                      className="flex-1 px-4 py-3.5 bg-white text-gray-800 text-sm placeholder-gray-400 outline-none"
                    />
                  </div>
                  {errors.phone && <p className="text-red-300 text-xs mt-1 pl-1">{errors.phone}</p>}
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={set("email")}
                    className={`w-full px-4 py-3.5 rounded-2xl bg-white text-gray-800 text-sm placeholder-gray-400 outline-none transition focus:ring-2 ${
                      errors.email ? "ring-2 ring-red-400" : "focus:ring-[#FFC727]"
                    }`}
                  />
                  {errors.email && <p className="text-red-300 text-xs mt-1 pl-1">{errors.email}</p>}
                </motion.div>
              </motion.div>

              {status === "error" && (
                <p className="text-red-300 text-sm text-center mb-4 relative z-10">
                  Something went wrong. Please try again.
                </p>
              )}

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                whileHover={{ scale: isSending ? 1 : 1.02 }}
                whileTap={{ scale: isSending ? 1 : 0.97 }}
                onClick={handleSubmit}
                disabled={isSending}
                className="relative z-10 w-full sm:w-[60%] mx-auto flex items-center justify-center gap-2 bg-[#FFC727] hover:bg-[#ffda55] text-[#1A3F1C] font-extrabold py-4 rounded-2xl text-base transition shadow-lg disabled:opacity-80 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Get Notified 🔔"
                )}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessModal isOpen={successOpen} onClose={() => setSuccessOpen(false)} />
    </>
  );
}
