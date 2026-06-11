import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, LogIn, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, UserRole } from "../hooks/useAuthStore";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [role, setRole] = useState<UserRole>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role);
    onClose();

    // Redirect to matching portal
    if (role === "vendor") {
      navigate("/vendor/dashboard");
    } else if (role === "rider") {
      navigate("/rider/dashboard");
    } else {
      navigate("/customer/browse");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <LogIn className="w-6 h-6 text-[#2C5E2E]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1A3F1C]">Welcome Back</h3>
              <p className="text-gray-400 text-xs mt-1">Select your account type to access your portal</p>
            </div>

            {/* Role Switcher */}
            <div className="flex bg-[#ECFFED]/30 rounded-xl p-1 mb-6 border border-[#2C5E2E]/10">
              {(["customer", "vendor", "rider"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    role === r
                      ? "bg-[#2C5E2E] text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm mt-2 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Sign In to Portal
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
