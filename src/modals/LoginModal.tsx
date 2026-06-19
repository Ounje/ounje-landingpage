import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, LogIn, ShieldCheck, KeyRound, User, MapPin, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import { apiClient } from "../utils/apiClient";
import { formatToE164 } from "../utils/phoneFormatter";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = "email" | "otp";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const role = "customer"; // Locked exclusively to customer role
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [flow, setFlow] = useState<"login" | "signup">("login");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<AuthStep>("email");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<"email" | "phone">("email");
  const [reference, setReference] = useState("");
  
  // Registration fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const loginStore = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleReset = () => {
    setEmail("");
    setPhone("");
    setOtp("");
    setStep("email");
    setFlow("login");
    setName("");
    setLocation("");
    setReference("");
    setVerificationMethod("email");
    setErrorMsg("");
    setLoading(false);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const formattedPhone = phone ? formatToE164(phone) : phone;
    if (phone) {
      setPhone(formattedPhone);
    }

    try {
      if (flow === "login") {
        if (verificationMethod === "email") {
          await apiClient.post("/api/auth/request-otp", {
            email,
            role,
            flow,
          });
        } else {
          const res: any = await apiClient.post("/api/auth/request-phone-otp", {
            phone: formattedPhone,
            role,
            flow,
          });
          setReference(res.reference || "");
        }
      } else {
        // Signup flow
        if (verificationMethod === "email") {
          await apiClient.post("/api/auth/request-otp", {
            email,
            role,
            flow,
          });
        } else {
          const res: any = await apiClient.post("/api/auth/request-phone-otp", {
            phone: formattedPhone,
            role,
            flow,
          });
          setReference(res.reference || "");
        }
      }
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      if (err.status === 404 && flow === "login") {
        setErrorMsg(`No customer account found with this ${verificationMethod === "email" ? "email" : "phone number"}. Do you want to sign up instead?`);
      } else {
        setErrorMsg(err.message || "Failed to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const formattedPhone = phone ? formatToE164(phone) : phone;
    if (phone) {
      setPhone(formattedPhone);
    }

    try {
      let response: any;
      const isPhoneVerif = verificationMethod === "phone";

      if (isPhoneVerif) {
        response = await apiClient.post("/api/auth/verify-phone-otp", {
          phone: formattedPhone,
          otp,
          reference,
          role,
          flow,
        });
      } else {
        response = await apiClient.post("/api/auth/verify-otp", {
          email,
          otp,
          role,
          flow,
        });
      }

      if (flow === "login") {
        // Complete login
        loginStore(response.user, response.accessToken, response.refreshToken);
        onClose();
        handleReset();
        navigate("/customer/browse");
      } else {
        // Complete registration automatically using upfront fields and returned otpSession
        const otpSessionToken = response.otpSession;
        
        const regResponse: any = await apiClient.post("/api/auth/register", {
          name,
          role,
          location,
          email: email || undefined,
          phone: formattedPhone || undefined,
          otpSession: otpSessionToken,
        });

        loginStore(regResponse.user, regResponse.accessToken, regResponse.refreshToken);
        onClose();
        handleReset();
        navigate("/customer/browse");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid OTP code. Please verify and try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPhoneActive = verificationMethod === "phone";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose();
              handleReset();
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={() => {
                onClose();
                handleReset();
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Step 1: Form details */}
            {step === "email" && (
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <LogIn className="w-6 h-6 text-[#2C5E2E]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1A3F1C]">
                    {flow === "login" ? "Welcome Back" : "Create an Account"}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 text-center">
                    {flow === "login" ? "Sign in to your Ounje account" : "Join Ounje to order delicious meals from local bukás"}
                  </p>
                </div>

                {/* Method selector for Login */}
                <div className="flex bg-[#ECFFED]/35 rounded-xl p-1 mb-6 border border-[#2C5E2E]/10">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("email")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      verificationMethod === "email"
                        ? "bg-[#2C5E2E] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod("phone")}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      verificationMethod === "phone"
                        ? "bg-[#2C5E2E] text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Phone Number
                  </button>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 mb-4 font-semibold">
                    {errorMsg}
                    {errorMsg.includes("sign up") && (
                      <button
                        onClick={() => {
                          setFlow("signup");
                          setErrorMsg("");
                        }}
                        className="block mt-1.5 underline font-bold text-red-700 hover:text-red-900 cursor-pointer"
                      >
                        Change to Sign Up flow
                      </button>
                    )}
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-4">
                  {flow === "login" ? (
                    verificationMethod === "email" ? (
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
                            className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="relative flex items-center">
                          <User className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +2348012345678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                          />
                        </div>
                      </div>
                    )
                  ) : (
                    /* Signup inputs */
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-1.5">Full Name</label>
                        <div className="relative flex items-center">
                          <User className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-1.5">Email Address</label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-1.5">Phone Number</label>
                        <div className="relative flex items-center">
                          <User className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            required
                            placeholder="e.g. +2348012345678"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-1.5">Address / Location</label>
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Yaba, Lagos"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                          />
                        </div>
                      </div>

                      {/* Verification selector (for customer) */}
                      <div>
                        <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Verify account via</label>
                        <div className="flex bg-[#ECFFED]/35 rounded-xl p-1 border border-[#2C5E2E]/10">
                          <button
                            type="button"
                            onClick={() => setVerificationMethod("email")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              verificationMethod === "email"
                                ? "bg-[#2C5E2E] text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            Email OTP
                          </button>
                          <button
                            type="button"
                            onClick={() => setVerificationMethod("phone")}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              verificationMethod === "phone"
                                ? "bg-[#2C5E2E] text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            SMS OTP
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-55 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    {flow === "login" ? "Send Login OTP" : "Send Verification OTP"}
                  </button>

                  <div className="text-center mt-4 text-xs font-bold">
                    {flow === "login" ? (
                      <span className="text-gray-400">
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setFlow("signup");
                            setErrorMsg("");
                          }}
                          className="text-[#2C5E2E] hover:underline cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setFlow("login");
                            setErrorMsg("");
                          }}
                          className="text-[#2C5E2E] hover:underline cursor-pointer"
                        >
                          Log In
                        </button>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === "otp" && (
              <div>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <KeyRound className="w-6 h-6 text-[#2C5E2E]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1A3F1C]">Enter OTP Code</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    We sent a code to <span className="font-bold text-[#1A3F1C]">{isPhoneActive ? phone : email}</span>
                  </p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2 text-center">Verification Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 1234"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 text-center text-xl font-extrabold tracking-[0.5em] focus:outline-none focus:border-[#2C5E2E] text-[#1A3F1C]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-55 cursor-pointer"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    Verify Code
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="w-full text-center mt-2 text-xs font-bold text-gray-400 hover:text-gray-600 hover:underline cursor-pointer"
                  >
                    Go Back
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
