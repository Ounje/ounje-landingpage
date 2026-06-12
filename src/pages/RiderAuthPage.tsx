import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, ShieldCheck, Mail, Lock, Phone, ArrowLeft, Eye, EyeOff, User } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RiderAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicle, setVehicle] = useState("Bicycle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In future this will update useAuthStore, for now we mock redirect
    alert(`Successfully ${isLogin ? "logged in" : "registered"} as a Rider! Routing to dashboard...`);
    navigate("/rider/dashboard");
  };

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-[#2C5E2E]/10">
          
          {/* Left Side: Marketing Info */}
          <div className="md:col-span-5 space-y-6 pr-0 md:pr-4">
            <button 
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C5E2E] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
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
            {/* Toggle tabs */}
            <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  isLogin 
                    ? "bg-[#2C5E2E] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Rider Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                  !isLogin 
                    ? "bg-[#2C5E2E] text-white shadow-md"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Become a Rider
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Full Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-4 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E]"
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
                      <option value="Foot">On Foot (Yaba campus coverage only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Phone Number</label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-4 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +234 80 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="rider@ounje.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-12 text-sm focus:outline-none focus:border-[#2C5E2E]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#2C5E2E]/25 transition-all text-sm mt-2"
              >
                {isLogin ? "Log In as Rider" : "Apply to Rider Force"}
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
