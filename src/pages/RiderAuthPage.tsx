import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, ShieldCheck, Mail, Phone, ArrowLeft, KeyRound, User, MapPin, Loader2 } from "lucide-react";
import { apiClient } from "../utils/apiClient";
import { useAuthStore } from "../hooks/useAuthStore";
import { formatToE164 } from "../utils/phoneFormatter";

type AuthStep = "phone" | "otp" | "register";

export default function RiderAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  // Form states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<AuthStep>("phone");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reference, setReference] = useState("");

  // Registration states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(new URLSearchParams(window.location.search).get("location") || "");
  const [vehicle, setVehicle] = useState("Motorcycle");
  const [otpSession, setOtpSession] = useState("");

  const handleReset = () => {
    setPhone("");
    setOtp("");
    setStep("phone");
    setReference("");
    setName("");
    setEmail("");
    setLocation("");
    setOtpSession("");
    setErrorMsg("");
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
      const response: any = await apiClient.post("/api/auth/request-phone-otp", {
        phone: formattedPhone,
        role: "rider",
        flow: isLogin ? "login" : "signup",
      });
      setReference(response.reference);
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      if (err.status === 404 && isLogin) {
        setErrorMsg("No rider account found with this phone number. Try switching to register.");
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
      const response: any = await apiClient.post("/api/auth/verify-phone-otp", {
        phone: formattedPhone,
        otp,
        reference,
        role: "rider",
        flow: isLogin ? "login" : "signup",
      });

      if (isLogin) {
        loginStore(response.user, response.accessToken, response.refreshToken);
        navigate("/rider/dashboard");
      } else {
        setOtpSession(response.otpSession);
        setStep("register");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const formattedPhone = phone ? formatToE164(phone) : phone;
    if (phone) {
      setPhone(formattedPhone);
    }

    try {
      const response: any = await apiClient.post("/api/auth/register", {
        name,
        role: "rider",
        location,
        email: email || undefined,
        otpSession,
        phone: formattedPhone,
        extra: {
          vehicleType: vehicle
        }
      });

      loginStore(response.user, response.accessToken, response.refreshToken);
      navigate("/rider/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Registration failed. Check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-[#2C5E2E]/10">
          
          {/* Left Side: Marketing Info */}
          <div className="md:col-span-5 space-y-6 pr-0 md:pr-4">
            <button 
              onClick={() => {
                if (step !== "phone") {
                  setStep("phone");
                  setErrorMsg("");
                } else {
                  navigate("/");
                }
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C5E2E] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> {step !== "phone" ? "Back to Step 1" : "Back to Home"}
            </button>
            <div className="w-16 h-16 bg-[#ECFFED] rounded-2xl flex items-center justify-center shadow-sm">
              <Bike className="w-8 h-8 text-[#2C5E2E]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1A3F1C] leading-tight">
              Join Ounje's <br />
              <span className="text-[#2C5E2E]">Rider Force.</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Ride on your own schedule, deliver authentic local meals, and build daily income. We supply the tools and support you need to succeed.
            </p>
            <div className="space-y-4">
              {[
                "Earn top rates and keep 100% of your tips",
                "Flexible hours — choose exactly when you ride",
                "Dedicated live support from our local offices"
              ].map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#ECFFED] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-[#2C5E2E]" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Auth Form */}
          <div className="md:col-span-7 bg-[#ECFFED]/20 rounded-2xl p-6 md:p-8 border border-[#2C5E2E]/5">
            {step === "phone" && (
              <>
                {/* Toggle tabs */}
                <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm">
                  <button
                    onClick={() => {
                      setIsLogin(true);
                      handleReset();
                    }}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                      isLogin 
                        ? "bg-[#2C5E2E] text-white shadow-md"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Rider Login
                  </button>
                  <button
                    onClick={() => {
                      setIsLogin(false);
                      handleReset();
                    }}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                      !isLogin 
                        ? "bg-[#2C5E2E] text-white shadow-md"
                        : "text-gray-500 hover:text-gray-800"
                    }`}
                  >
                    Become a Rider
                  </button>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 mb-4 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-4 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +2348022000009"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Include country code (e.g., +234...)</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#2C5E2E]/25 transition-all text-sm mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <KeyRound className="w-4 h-4" />
                    )}
                    {isLogin ? "Send Login OTP" : "Register and Send OTP"}
                  </button>
                </form>
              </>
            )}

            {step === "otp" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <KeyRound className="w-6 h-6 text-[#2C5E2E]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1A3F1C]">Enter OTP Code</h3>
                  <p className="text-gray-400 text-xs mt-1">
                    We sent a code to your phone number: <span className="font-bold text-[#1A3F1C]">{phone}</span>
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
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3.5 text-center text-xl font-extrabold tracking-[0.5em] focus:outline-none focus:border-[#2C5E2E] text-[#1A3F1C]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    Verify OTP
                  </button>
                </form>
              </>
            )}

            {step === "register" && (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                    <Bike className="w-6 h-6 text-[#2C5E2E]" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1A3F1C]">Rider Profile Details</h3>
                  <p className="text-gray-400 text-xs mt-1">Complete your application details</p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl border border-red-100 mb-4 font-semibold">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Email Address (Optional)</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        placeholder="rider@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Operating / Base Address</label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-4 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yaba, Lagos, Nigeria"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Vehicle Type</label>
                    <select
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] font-semibold text-gray-700"
                    >
                      <option value="Bicycle">Bicycle / Electric Bicycle</option>
                      <option value="Motorcycle">Motorcycle / Okada (Recommended)</option>
                      <option value="Car">Delivery Car / Van</option>
                      <option value="Foot">On Foot (Campus coverage only)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-2 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-4 h-4" />
                    )}
                    Apply to Rider Force
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
