import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Store, ShieldCheck, Mail, Phone, ArrowLeft, KeyRound, User, MapPin, Loader2, 
  Check, FileText, Camera, ShieldAlert, Landmark, Calendar, Clock, ArrowRight,
  Package, Shield, Tag, DollarSign, AlertTriangle, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "../utils/apiClient";
import { useAuthStore } from "../hooks/useAuthStore";
import { formatToE164 } from "../utils/phoneFormatter";

type AuthStep = 
  | "phone" 
  | "otp" 
  | "reg_details" 
  | "reg_terms" 
  | "reg_otp" 
  | "onboard_mode" 
  | "onboard_details" 
  | "onboard_ops";

export default function VendorAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);

  // General States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [reference, setReference] = useState("");
  const [otp, setOtp] = useState("");

  // Registration & Onboarding fields
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  
  // Document Upload States
  const [documentName, setDocumentName] = useState("");
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Agreement Terms Accepted
  const [termsAccepted, setTermsAccepted] = useState(false);

  // OTP Session Token returned after verify
  const [otpSession, setOtpSession] = useState("");

  // Onboarding Step 1: Selling Mode
  const [sellingMode, setSellingMode] = useState<"physical" | "online" | "">("");

  // Onboarding Step 2: Store details
  const [storeName, setStoreName] = useState("");
  const [isRegistered, setIsRegistered] = useState<"yes" | "no" | "">("");
  const [cacNumber, setCacNumber] = useState("");
  const [showCacHelpModal, setShowCacHelpModal] = useState(false);
  const [requestCacHelp, setRequestCacHelp] = useState(false);
  const [serviceType, setServiceType] = useState<"instant" | "preorder" | "hybrid" | "">("");

  // Onboarding Step 3: Operations & Bank details
  const [workingDays, setWorkingDays] = useState<string[]>([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]);
  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState(new URLSearchParams(window.location.search).get("location") || "");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [banksList, setBanksList] = useState<{ name: string; code: string }[]>([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [fetchingAccount, setFetchingAccount] = useState(false);

  // Auth / Onboarding current step
  const [step, setStep] = useState<AuthStep>("phone");

  const handleReset = () => {
    setPhone("");
    setOtp("");
    setStep("phone");
    setReference("");
    setBusinessName("");
    setDocumentName("");
    setDocumentPreview(null);
    setDocumentFile(null);
    setTermsAccepted(false);
    setOtpSession("");
    setSellingMode("");
    setStoreName("");
    setIsRegistered("");
    setCacNumber("");
    setShowCacHelpModal(false);
    setRequestCacHelp(false);
    setServiceType("");
    setWorkingDays(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]);
    setOpeningTime("08:00");
    setClosingTime("22:00");
    setEmail("");
    setLocation("");
    setBankName("");
    setBankCode("");
    setAccountNumber("");
    setAccountName("");
    setErrorMsg("");
  };

  const handleGoBack = () => {
    setErrorMsg("");
    if (isLogin) {
      if (step === "otp") {
        setStep("phone");
      } else {
        navigate("/");
      }
    } else {
      // Register steps
      if (step === "reg_details") {
        setIsLogin(true);
        setStep("phone");
      } else if (step === "reg_terms") {
        setStep("reg_details");
      } else if (step === "reg_otp") {
        setStep("reg_terms");
      } else if (step === "onboard_mode") {
        setStep("reg_terms"); // Go back to terms stage
      } else if (step === "onboard_details") {
        setStep("onboard_mode");
      } else if (step === "onboard_ops") {
        setStep("onboard_details");
      } else {
        setIsLogin(true);
        setStep("phone");
      }
    }
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
        role: "vendor",
        flow: isLogin ? "login" : "signup",
      });
      setReference(response.reference);
      setStep("otp");
    } catch (err: any) {
      console.error(err);
      if (err.status === 404 && isLogin) {
        setErrorMsg("No vendor account found with this phone number. Try switching to register.");
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
        role: "vendor",
        flow: isLogin ? "login" : "signup",
      });

      if (isLogin) {
        loginStore(response.user, response.accessToken, response.refreshToken);
        navigate("/vendor/dashboard");
      } else {
        setOtpSession(response.otpSession);
        setStep("onboard_mode");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegOtp = async (e: React.FormEvent) => {
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
        role: "vendor",
        flow: "signup",
      });

      const otpSes = response.otpSession;
      setOtpSession(otpSes);

      // Immediately register the vendor account
      const regResponse: any = await apiClient.post("/api/auth/register", {
        name: businessName,
        role: "vendor",
        location: location || "Lagos, Nigeria",
        otpSession: otpSes,
        phone: formattedPhone,
      });

      // Sign the user in
      loginStore(regResponse.user, regResponse.accessToken, regResponse.refreshToken);

      setStep("onboard_mode");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Verification or registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Submit complete-registration Form Data
      const formData = new FormData();
      formData.append("storeName", storeName || businessName);
      formData.append("storeType", sellingMode === "physical" ? "physicalStore" : "onlineStore");
      formData.append("servicesOffered", serviceType === "instant" ? "InstantMeals" : serviceType === "preorder" ? "preOrderMeals" : "hybridMeals");
      
      if (documentFile) {
        formData.append("ninID", documentFile);
      }

      formData.append("isVerifiedBusiness", isRegistered === "yes" ? "true" : "false");
      if (isRegistered === "yes" && cacNumber) {
        formData.append("CACNumber", cacNumber);
      }
      if (isRegistered === "no") {
        formData.append("needCACHelp", requestCacHelp ? "yes" : "no");
      }

      if (serviceType === "preorder") {
        const preorderPeriods = [
          { orderingTime: openingTime, preparationTime: "1 hour", period: "lunch" }
        ];
        formData.append("preorderPeriods", JSON.stringify(preorderPeriods));
      } else {
        const timePeriod = workingDays.map(day => ({
          day: day.toLowerCase(),
          openingHour: openingTime,
          closingHour: closingTime
        }));
        formData.append("timePeriod", JSON.stringify(timePeriod));
      }

      await apiClient.request("/api/vendors/complete-registration", {
        method: "POST",
        bodyData: formData,
        isMultipart: true,
      });

      // 2. Update Location
      await apiClient.put("/api/vendors/profile/location", {
        address: location || "Lagos, Nigeria",
        coordinates: [3.3792, 6.5244],
      });

      // 3. Update Bank Details
      await apiClient.put("/api/vendors/profile/bank-details", {
        accountNumber,
        bankCode,
        accountName,
      });

      // Navigate to dashboard
      navigate("/vendor/dashboard");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Onboarding submission failed. Check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
      setDocumentName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load dynamic bank list from backend
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response: any = await apiClient.get("/api/payments/banks");
        if (response.status && response.data) {
          const sortedBanks = response.data.sort((a: any, b: any) =>
            a.name.localeCompare(b.name)
          );
          setBanksList(sortedBanks);
        }
      } catch (err) {
        console.error("Failed to fetch banks list", err);
        setBanksList([
          { name: "Guaranty Trust Bank (GTB)", code: "058" },
          { name: "Zenith Bank", code: "057" },
          { name: "Access Bank", code: "044" },
          { name: "United Bank for Africa (UBA)", code: "033" },
          { name: "First Bank of Nigeria", code: "011" },
          { name: "Kuda Microfinance Bank", code: "50211" },
          { name: "OPay (PayCom)", code: "999992" },
          { name: "Moniepoint Microfinance Bank", code: "50515" },
        ]);
      }
    };
    fetchBanks();
  }, []);

  // Live account verification
  useEffect(() => {
    const resolveAccount = async () => {
      if (accountNumber.length === 10 && bankCode) {
        setFetchingAccount(true);
        setErrorMsg("");
        try {
          const res: any = await apiClient.get("/api/payments/resolve-bank", {
            accountNumber,
            bankCode,
          });
          if (res.status && res.data?.account_name) {
            setAccountName(res.data.account_name);
          } else {
            setErrorMsg("Could not verify account name. Please check details.");
          }
        } catch (err: any) {
          console.error("Failed to resolve bank account:", err);
          setErrorMsg(err.message || "Failed to resolve account. Verify your account number and bank.");
          setAccountName("");
        } finally {
          setFetchingAccount(false);
        }
      }
    };
    resolveAccount();
  }, [accountNumber, bankCode]);

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-3xl p-6 md:p-10 shadow-lg border border-[#2C5E2E]/10">
          
          {/* Left Side: Marketing Info */}
          <div className="md:col-span-5 space-y-6 pr-0 md:pr-4">
            <button 
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#2C5E2E] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> 
              {isLogin 
                ? (step === "otp" ? "Back to Phone Input" : "Back to Home") 
                : "Back to Previous Step"}
            </button>
            <div className="w-16 h-16 bg-[#ECFFED] rounded-2xl flex items-center justify-center shadow-sm">
              <Store className="w-8 h-8 text-[#2C5E2E]" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1A3F1C] leading-tight">
              Grow your Buka, <br />
              <span className="text-[#2C5E2E]">cook happiness.</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Register your kitchen, set up your menu, and let us handle delivery. Connect with thousands of food lovers around Yaba, Ikeja, and Surulere.
            </p>
            <div className="space-y-4">
              {[
                "Get customer orders straight to your phone",
                "Full delivery logistic services done by us",
                "Weekly direct payouts to your bank account"
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

          {/* Right Side: Auth Form & Onboarding Steps */}
          <div className="md:col-span-7 bg-[#ECFFED]/20 rounded-3xl p-0 border border-[#2C5E2E]/5 overflow-hidden shadow-sm">
            
            {/* dynamic dark green header panel for Registration Flow */}
            {!isLogin && (
              <div className="bg-[#1A3F1C] text-white p-6 md:p-8 relative">
                <button
                  type="button"
                  onClick={handleGoBack}
                  className="absolute left-6 top-6 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="text-right text-[10px] uppercase tracking-wider font-extrabold text-[#ECFFED]/85 absolute right-6 top-8">
                  {step === "reg_details" && "Step 1 of 2"}
                  {step === "reg_terms" && "Step 2 of 2"}
                  {step === "reg_otp" && "OTP Verification"}
                  {step === "onboard_mode" && "Step 1 of 3"}
                  {step === "onboard_details" && "Step 2 of 3"}
                  {step === "onboard_ops" && "Step 3 of 3"}
                </div>
                
                <div className="mt-6">
                  {step === "reg_details" && (
                    <>
                      <h2 className="text-xl md:text-2xl font-black">Let's Get You Registered</h2>
                      <p className="text-xs text-[#ECFFED]/85 mt-1">Fill in your details to sell with us</p>
                    </>
                  )}
                  {step === "reg_terms" && (
                    <>
                      <div className="inline-block bg-[#FFC727] text-[#1A3F1C] text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-2">
                        Vendor Agreement
                      </div>
                      <h2 className="text-xl md:text-2xl font-black">Terms & Conditions</h2>
                      <p className="text-xs text-[#ECFFED]/85 mt-1">Please read carefully before joining us as a vendor</p>
                    </>
                  )}
                  {step === "reg_otp" && (
                    <>
                      <h2 className="text-xl md:text-2xl font-black">Verify Phone</h2>
                      <p className="text-xs text-[#ECFFED]/85 mt-1">Authenticate your phone number to proceed</p>
                    </>
                  )}
                  {step === "onboard_mode" && (
                    <>
                      <h2 className="text-xl md:text-2xl font-black">Welcome Onboard, Vendor! 🎉</h2>
                      <p className="text-xs text-[#ECFFED]/85 mt-1">Join thousands of vendors growing their food business with OunjeMarket.</p>
                    </>
                  )}
                  {step === "onboard_details" && (
                    <>
                      <h2 className="text-xl md:text-2xl font-black">Store Details</h2>
                      <p className="text-xs text-[#ECFFED]/85 mt-1">Tell us a bit about your culinary business</p>
                    </>
                  )}
                  {step === "onboard_ops" && (
                    <>
                      <h2 className="text-xl md:text-2xl font-black">Operations & Payouts</h2>
                      <p className="text-xs text-[#ECFFED]/85 mt-1">Set your working hours and bank credentials for direct payments</p>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Dots indicator for onboarding steps */}
            {!isLogin && ["onboard_mode", "onboard_details", "onboard_ops"].includes(step) && (
              <div className="flex justify-center gap-1.5 pt-6 bg-white">
                <div className={`w-6 h-1.5 rounded-full transition-all ${step === "onboard_mode" ? "bg-[#2C5E2E]" : "bg-gray-200"}`} />
                <div className={`w-6 h-1.5 rounded-full transition-all ${step === "onboard_details" ? "bg-[#2C5E2E]" : "bg-gray-200"}`} />
                <div className={`w-6 h-1.5 rounded-full transition-all ${step === "onboard_ops" ? "bg-[#2C5E2E]" : "bg-gray-200"}`} />
              </div>
            )}

            <div className="p-6 md:p-8 bg-white">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 text-xs p-3.5 rounded-xl border border-red-100 mb-6 font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* LOGIN FLOW */}
              {isLogin && (
                <>
                  {step === "phone" && (
                    <>
                      {/* Toggle tabs */}
                      <div className="flex bg-gray-50 rounded-xl p-1 mb-8 border border-gray-100">
                        <button
                          type="button"
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
                          Vendor Login
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsLogin(false);
                            handleReset();
                            setStep("reg_details");
                          }}
                          className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                            !isLogin 
                              ? "bg-[#2C5E2E] text-white shadow-md"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          Register Kitchen
                        </button>
                      </div>

                      <form onSubmit={handleSendOtp} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Phone Number</label>
                          <div className="relative flex items-center">
                            <Phone className="absolute left-4 w-4 h-4 text-gray-400" />
                            <input
                              type="tel"
                              required
                              placeholder="e.g. +2348022000008"
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
                          className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#2C5E2E]/25 transition-all text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <KeyRound className="w-4 h-4" />
                          )}
                          Send Login OTP
                        </button>
                      </form>
                    </>
                  )}

                  {step === "otp" && (
                    <>
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-100 shadow-sm">
                          <KeyRound className="w-6 h-6 text-[#2C5E2E]" />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#1A3F1C]">Enter OTP Code</h3>
                        <p className="text-gray-400 text-xs mt-1">
                          We sent a code to your phone number: <span className="font-bold text-[#1A3F1C]">{phone}</span>
                        </p>
                      </div>

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
                          className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer"
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
                </>
              )}

              {/* REGISTRATION & ONBOARDING FLOW */}
              {!isLogin && (
                <>
                  {/* Step 1: Let's Get You Registered (Image 1) */}
                  {step === "reg_details" && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Business Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your business name"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold placeholder-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                        <div className="flex bg-white border border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#2C5E2E] transition-colors items-center px-4">
                          <span className="text-sm shrink-0 mr-2 select-none">🇳🇬</span>
                          <span className="text-sm font-extrabold text-gray-500 mr-2 shrink-0">+234</span>
                          <input
                            type="tel"
                            required
                            placeholder="8012345678"
                            value={phone.replace(/^\+234/, "")}
                            onChange={(e) => setPhone("+234" + e.target.value.replace(/[^\d]/g, ""))}
                            className="w-full py-3.5 text-sm focus:outline-none text-gray-800 font-semibold placeholder-gray-300"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">NIN or Passport</label>
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-100 transition-colors cursor-pointer text-center relative overflow-hidden min-h-[140px]"
                        >
                          {documentPreview ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#ECFFED]/95 backdrop-blur-sm p-4 text-center">
                              <Check className="w-8 h-8 text-[#2C5E2E] mb-2" />
                              <span className="text-xs font-bold text-[#1A3F1C] truncate max-w-[80%]">{documentName}</span>
                              <span className="text-[10px] text-gray-400 mt-1 font-bold">Click to replace photo</span>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#2C5E2E] shadow-sm mb-3">
                                <Camera className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-bold text-gray-600 block">Tap to upload or take photo</span>
                              <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-extrabold">JPG, PNG supported</span>
                            </>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep("reg_terms")}
                        disabled={!businessName.trim() || phone.replace(/^\+234/, "").trim().length < 8 || !documentName}
                        className={`w-full py-4 rounded-2xl font-extrabold text-sm transition-all shadow-md mt-6 text-center cursor-pointer ${
                          businessName.trim() && phone.replace(/^\+234/, "").trim().length >= 8 && documentName
                            ? "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white shadow-[#2C5E2E]/25 hover:scale-102"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        }`}
                      >
                        Continue
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsLogin(true);
                          handleReset();
                        }}
                        className="w-full text-center mt-4 text-xs font-bold text-[#2C5E2E] hover:underline cursor-pointer"
                      >
                        Already have an account? Login
                      </button>
                      
                      <p className="text-[10px] text-gray-400 font-semibold text-center mt-6 leading-relaxed max-w-[85%] mx-auto">
                        By continuing, I accept the <span className="font-bold text-gray-500">Terms & Conditions</span> & <span className="font-bold text-gray-500">Privacy Policy</span>
                      </p>
                    </div>
                  )}

                  {/* Step 2: Terms & Conditions obligations screen (Image 2 & 3) */}
                  {step === "reg_terms" && (
                    <div className="space-y-4">
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block mb-2">Your Obligations</span>
                      
                      <div className="divide-y divide-gray-50">
                        {/* obligation 1 */}
                        <div className="py-3.5 flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-400">01</span>
                              <h4 className="text-sm font-extrabold text-[#1A3F1C]">Order Fulfillment</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 font-semibold leading-relaxed">
                              You agree to accurately prepare and fulfil all orders placed through the app.
                            </p>
                          </div>
                        </div>

                        {/* obligation 2 */}
                        <div className="py-3.5 flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                            <Shield className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-400">02</span>
                              <h4 className="text-sm font-extrabold text-[#1A3F1C]">Food Quality & Hygiene</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 font-semibold leading-relaxed">
                              You are responsible for maintaining food quality and hygiene standards to protect customer safety.
                            </p>
                          </div>
                        </div>

                        {/* obligation 3 */}
                        <div className="py-3.5 flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-400">03</span>
                              <h4 className="text-sm font-extrabold text-[#1A3F1C]">Pricing & Menu</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 font-semibold leading-relaxed">
                              You may set your own prices and must keep your menu and pricing up to date on the platform.
                            </p>
                          </div>
                        </div>

                        {/* obligation 4 */}
                        <div className="py-3.5 flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                            <DollarSign className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-400">04</span>
                              <h4 className="text-sm font-extrabold text-[#1A3F1C]">Payouts</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 font-semibold leading-relaxed">
                              You will receive your full payment for each order based on the prices you set, following successful completion.
                            </p>
                          </div>
                        </div>

                        {/* obligation 5 */}
                        <div className="py-3.5 flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-gray-400">05</span>
                              <h4 className="text-sm font-extrabold text-[#1A3F1C]">Account Termination</h4>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 font-semibold leading-relaxed">
                              OUNJE reserves the right to suspend or remove vendors who receive repeated complaints or violate platform guidelines. You will be given 3 warnings, and if you don't comply, your account will be terminated.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 text-amber-800 text-[10px] font-bold p-3.5 rounded-2xl border border-amber-100 flex items-center gap-2 leading-relaxed mt-4">
                        <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>These terms may be updated occasionally. Continued use of the platform means you accept.</span>
                      </div>

                      <div className="flex flex-col gap-3 mt-6">
                        <button
                          type="button"
                          onClick={async () => {
                            setTermsAccepted(true);
                            setStep("reg_otp");
                            setErrorMsg("");
                            setLoading(true);
                            try {
                              const response: any = await apiClient.post("/api/auth/request-phone-otp", {
                                phone,
                                role: "vendor",
                                flow: "signup",
                              });
                              setReference(response.reference);
                            } catch (err: any) {
                              console.error(err);
                              setErrorMsg(err.message || "Failed to send OTP. Please go back and retry.");
                              setStep("reg_details");
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold py-3.5 rounded-2xl shadow-md text-sm transition-all hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept & Continue</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleGoBack}
                          className="w-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer text-center"
                        >
                          Read Later
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Registration OTP checkpoint */}
                  {step === "reg_otp" && (
                    <div>
                      <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                          <KeyRound className="w-6 h-6 text-[#2C5E2E]" />
                        </div>
                        <h3 className="text-xl font-extrabold text-[#1A3F1C]">Enter OTP Code</h3>
                        <p className="text-gray-400 text-xs mt-1">
                          We sent a code to your phone number: <span className="font-bold text-[#1A3F1C]">{phone}</span>
                        </p>
                      </div>

                      <form onSubmit={handleVerifyRegOtp} className="space-y-4">
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
                          className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-sm mt-2 flex items-center justify-center gap-2 cursor-pointer"
                        >
                          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                          Verify OTP
                        </button>

                        <button
                          type="button"
                          onClick={handleGoBack}
                          className="w-full text-center mt-2 text-xs font-bold text-gray-400 hover:text-gray-600 hover:underline cursor-pointer"
                        >
                          Go Back
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Step 4: Selling Mode Onboarding (Image 4) */}
                  {step === "onboard_mode" && (
                    <div>
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block mb-4">How do you sell?</span>
                      
                      <div className="space-y-4">
                        {/* physical */}
                        <div 
                          onClick={() => setSellingMode("physical")}
                          className={`border-2 rounded-3xl p-5 flex items-center justify-between cursor-pointer transition-all ${
                            sellingMode === "physical" 
                              ? "border-[#2C5E2E] bg-[#ECFFED]/20 shadow-sm animate-none" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex gap-4 items-center">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                              sellingMode === "physical" ? "bg-[#2C5E2E] text-white" : "bg-[#ECFFED] text-[#2C5E2E]"
                            }`}>
                              <Store className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-extrabold text-[#1A3F1C]">Physical Vendor</h4>
                              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                                You have a shop or outlet where customers visit in person.
                              </p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                            sellingMode === "physical" ? "border-[#2C5E2E] bg-[#2C5E2E] text-white" : "border-gray-300 bg-white"
                          }`}>
                            {sellingMode === "physical" && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* online */}
                        <div 
                          onClick={() => setSellingMode("online")}
                          className={`border-2 rounded-3xl p-5 flex items-center justify-between cursor-pointer transition-all ${
                            sellingMode === "online" 
                              ? "border-[#2C5E2E] bg-[#ECFFED]/20 shadow-sm animate-none" 
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex gap-4 items-center">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
                              sellingMode === "online" ? "bg-[#2C5E2E] text-white" : "bg-[#ECFFED] text-[#2C5E2E]"
                            }`}>
                              <MapPin className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-extrabold text-[#1A3F1C]">Online Vendor</h4>
                              <p className="text-[11px] text-gray-500 font-semibold mt-0.5">
                                You cook from home or don't have a physical shop yet.
                              </p>
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                            sellingMode === "online" ? "border-[#2C5E2E] bg-[#2C5E2E] text-white" : "border-gray-300 bg-white"
                          }`}>
                            {sellingMode === "online" && <Check className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setStoreName(businessName);
                          setStep("onboard_details");
                        }}
                        disabled={!sellingMode}
                        className={`w-full py-4 rounded-2xl font-extrabold text-sm transition-all shadow-md mt-8 flex items-center justify-center gap-2 cursor-pointer ${
                          sellingMode 
                            ? "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white shadow-[#2C5E2E]/25 hover:scale-102"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        }`}
                      >
                        <span>Get Started</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Step 5: Store Details Onboarding (Image 5) */}
                  {step === "onboard_details" && (
                    <div className="space-y-5 text-left">
                      {/* Store Name */}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Store Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mama's Kitchen"
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                        />
                      </div>

                      {/* Business Registration */}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Is your business registered?</label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setIsRegistered("yes")}
                            className={`py-3 rounded-2xl font-bold text-xs border text-center transition-all cursor-pointer ${
                              isRegistered === "yes" 
                                ? "border-[#2C5E2E] bg-[#ECFFED]/30 text-[#1A3F1C] font-extrabold" 
                                : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            Yes, it is
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsRegistered("no");
                              setShowCacHelpModal(true);
                            }}
                            className={`py-3 rounded-2xl font-bold text-xs border text-center transition-all cursor-pointer ${
                              isRegistered === "no" 
                                ? "border-[#2C5E2E] bg-[#ECFFED]/30 text-[#1A3F1C] font-extrabold" 
                                : "border-gray-200 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            Not yet
                          </button>
                        </div>
                      </div>

                      {isRegistered === "no" && (
                        <div className="mt-1">
                          {requestCacHelp ? (
                            <div className="bg-[#ECFFED] text-[#2C5E2E] text-[11px] p-3.5 rounded-2xl border border-[#2C5E2E]/10 flex items-center gap-2 font-semibold animate-fadeIn">
                              <Check className="w-3.5 h-3.5 shrink-0 text-[#2C5E2E]" />
                              <span>OunjéFood will assist you with business registration for free!</span>
                            </div>
                          ) : (
                            <div className="bg-gray-50 text-gray-500 text-[11px] p-3.5 rounded-2xl border border-gray-200/50 flex items-center gap-2 font-semibold animate-fadeIn">
                              <X className="w-3.5 h-3.5 shrink-0 text-gray-400" />
                              <span>You chose to handle business registration yourself.</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* CAC Input Field */}
                      {isRegistered === "yes" && (
                        <div className="mt-3">
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">CAC Registration Number</label>
                          <input
                            type="text"
                            required
                            placeholder="Enter your CAC registration number"
                            value={cacNumber}
                            onChange={(e) => setCacNumber(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                          />
                        </div>
                      )}

                      {/* Service Offer */}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">What kind of service do you offer?</label>
                        <div className="space-y-3">
                          {/* Instant Meal */}
                          <div 
                            onClick={() => setServiceType("instant")}
                            className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                              serviceType === "instant" 
                                ? "border-[#2C5E2E] bg-[#ECFFED]/25" 
                                : "border-gray-100 hover:border-gray-200 bg-gray-50/25"
                            }`}
                          >
                            <div className="flex gap-3 items-center">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                serviceType === "instant" ? "bg-[#2C5E2E] text-white" : "bg-[#ECFFED] text-[#2C5E2E]"
                              }`}>
                                <Clock className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs font-extrabold text-[#1A3F1C]">Instant Meal</h4>
                                <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Ready-to-serve meals prepared fresh on the spot</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                              serviceType === "instant" ? "border-[#2C5E2E] bg-[#2C5E2E] text-white" : "border-gray-300 bg-white"
                            }`}>
                              {serviceType === "instant" && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </div>

                          {/* Pre-order */}
                          <div 
                            onClick={() => setServiceType("preorder")}
                            className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                              serviceType === "preorder" 
                                ? "border-[#2C5E2E] bg-[#ECFFED]/25" 
                                : "border-gray-100 hover:border-gray-200 bg-gray-50/25"
                            }`}
                          >
                            <div className="flex gap-3 items-center">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                serviceType === "preorder" ? "bg-[#2C5E2E] text-white" : "bg-[#ECFFED] text-[#2C5E2E]"
                              }`}>
                                <Calendar className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs font-extrabold text-[#1A3F1C]">Pre-order</h4>
                                <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Customers place orders in advance for a set time</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                              serviceType === "preorder" ? "border-[#2C5E2E] bg-[#2C5E2E] text-white" : "border-gray-300 bg-white"
                            }`}>
                              {serviceType === "preorder" && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </div>

                          {/* Hybrid */}
                          <div 
                            onClick={() => setServiceType("hybrid")}
                            className={`border-2 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${
                              serviceType === "hybrid" 
                                ? "border-[#2C5E2E] bg-[#ECFFED]/25" 
                                : "border-gray-100 hover:border-gray-200 bg-gray-50/25"
                            }`}
                          >
                            <div className="flex gap-3 items-center">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                serviceType === "hybrid" ? "bg-[#2C5E2E] text-white" : "bg-[#ECFFED] text-[#2C5E2E]"
                              }`}>
                                <Store className="w-4 h-4" />
                              </div>
                              <div className="text-left">
                                <h4 className="text-xs font-extrabold text-[#1A3F1C]">Hybrid</h4>
                                <p className="text-[10px] text-gray-400 mt-0.5 font-semibold">Offer both instant and pre-order meals</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ml-2 ${
                              serviceType === "hybrid" ? "border-[#2C5E2E] bg-[#2C5E2E] text-white" : "border-gray-300 bg-white"
                            }`}>
                              {serviceType === "hybrid" && <Check className="w-2.5 h-2.5" />}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={handleGoBack}
                          className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-xs cursor-pointer text-center"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep("onboard_ops")}
                          disabled={
                            !storeName.trim() || 
                            !isRegistered || 
                            (isRegistered === "yes" && !cacNumber.trim()) ||
                            !serviceType
                          }
                          className={`flex-1 py-3.5 rounded-2xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                            storeName.trim() && 
                            isRegistered && 
                            (isRegistered === "no" || cacNumber.trim()) && 
                            serviceType
                              ? "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white shadow-[#2C5E2E]/20"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                          }`}
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Operations & Payouts Setup */}
                  {step === "onboard_ops" && (
                    <form onSubmit={handleCompleteRegistration} className="space-y-5 text-left">
                      {/* Working Days */}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Working Days</label>
                        <div className="flex flex-wrap gap-2">
                          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                            const isSelected = workingDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setWorkingDays(workingDays.filter((d) => d !== day));
                                  } else {
                                    setWorkingDays([...workingDays, day]);
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer ${
                                  isSelected 
                                    ? "border-[#2C5E2E] bg-[#ECFFED] text-[#2C5E2E] font-extrabold" 
                                    : "border-gray-200 text-gray-500 hover:bg-gray-50 bg-white"
                                }`}
                              >
                                {day.substring(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Operating Hours */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Open Time</label>
                          <div className="relative flex items-center">
                            <Clock className="absolute left-4 w-4 h-4 text-gray-400" />
                            <input
                              type="time"
                              required
                              value={openingTime}
                              onChange={(e) => setOpeningTime(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1.5">Close Time</label>
                          <div className="relative flex items-center">
                            <Clock className="absolute left-4 w-4 h-4 text-gray-400" />
                            <input
                              type="time"
                              required
                              value={closingTime}
                              onChange={(e) => setClosingTime(e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Location Address */}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Kitchen Location Address</label>
                        <div className="relative flex items-center">
                          <MapPin className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. 15 Herbert Macaulay Way, Yaba, Lagos"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                          />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Email Address (Optional)</label>
                        <div className="relative flex items-center">
                          <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            placeholder="kitchen@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                          />
                        </div>
                      </div>

                      {/* Bank Details section */}
                      <div className="pt-3 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block mb-3">Bank Details (for weekly payouts)</span>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-1.5">Bank Name</label>
                            <div className="relative flex items-center">
                              <Landmark className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                              <select
                                required
                                value={bankCode}
                                onChange={(e) => {
                                  const selected = banksList.find(b => b.code === e.target.value);
                                  setBankCode(e.target.value);
                                  setBankName(selected ? selected.name : "");
                                }}
                                className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold appearance-none cursor-pointer"
                              >
                                <option value="">Select Bank</option>
                                {banksList.map(bank => (
                                  <option key={bank.code} value={bank.code}>
                                    {bank.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-1.5">Account Number</label>
                            <input
                              type="text"
                              required
                              maxLength={10}
                              placeholder="10-digit account number"
                              value={accountNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/[^\d]/g, "");
                                setAccountNumber(val);
                              }}
                              className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-black text-gray-400 mb-1.5">Account Name</label>
                            <div className="relative flex items-center">
                              <input
                                type="text"
                                required
                                placeholder="Payout Account Holder Name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-5 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold pr-10"
                              />
                              {fetchingAccount && (
                                <div className="absolute right-4">
                                  <Loader2 className="w-4 h-4 text-[#2C5E2E] animate-spin" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={handleGoBack}
                          className="flex-1 py-3.5 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-50 font-bold text-xs cursor-pointer text-center bg-white"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading || workingDays.length === 0 || !bankName || accountNumber.length !== 10 || !accountName.trim() || !location.trim()}
                          className={`flex-1 py-3.5 rounded-2xl font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer ${
                            !loading && workingDays.length > 0 && bankName && accountNumber.length === 10 && accountName.trim() && location.trim()
                              ? "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white shadow-[#2C5E2E]/25 hover:scale-102"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                          }`}
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Creating Buka...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Complete Setup</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

            </div>
          </div>

        </div>
      </main>

      {/* CAC Help Modal */}
      <AnimatePresence>
        {showCacHelpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCacHelpModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-[2rem] p-6 md:p-8 max-w-sm w-full relative z-10 shadow-2xl border border-gray-100 text-center"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowCacHelpModal(false)}
                className="absolute right-5 top-5 w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Icon Badge */}
              <div className="mx-auto w-16 h-16 rounded-full bg-[#FFF4EB] flex items-center justify-center mb-5 mt-2">
                <FileText className="w-8 h-8 text-[#FF7A00]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-extrabold text-[#1A3F1C] mb-2 px-2">
                Get Your Business Registered
              </h3>
              <p className="text-gray-500 text-sm font-semibold leading-relaxed mb-6 px-4">
                Would you like OunjéFood to assist with your business registration? It's 100% free — no payback.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setRequestCacHelp(true);
                    setShowCacHelpModal(false);
                  }}
                  className="w-full bg-[#1A3F1C] hover:bg-[#2C5E2E] text-white font-extrabold py-4 rounded-2xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer"
                >
                  Yes, I'd love OunjéFood's Help
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRequestCacHelp(false);
                    setShowCacHelpModal(false);
                  }}
                  className="w-full bg-[#F5F7F9] hover:bg-[#EAEFF3] text-gray-700 font-extrabold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm cursor-pointer"
                >
                  No, I'll handle it myself
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
