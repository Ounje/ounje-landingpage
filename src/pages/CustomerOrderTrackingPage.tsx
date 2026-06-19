import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Phone, ShieldAlert, Loader2, Utensils, CheckCircle, Bike, Star, Copy, Check, MessageSquare, ClipboardCheck, Play } from "lucide-react";
import { io, Socket } from "socket.io-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiClient } from "../utils/apiClient";
import { useAuthStore } from "../hooks/useAuthStore";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://ounje-mobile-backend.pxxl.pro").replace(/\/$/, "");

const ORDER_STEPS = [
  {
    key: "confirming",
    title: "Confirming",
    icon: Clock,
    steps: [
      { message: "Awaiting Buka confirmation" },
      { message: "Order Confirmed" },
    ],
  },
  {
    key: "packaging",
    title: "Packaging",
    icon: Utensils,
    steps: [
      { message: "Kitchen is preparing your meal" },
      { message: "Food is packaged for dispatch" },
    ],
  },
  {
    key: "riding",
    title: "On the Way",
    icon: Bike,
    steps: [
      { message: "Finding a nearby rider" },
      { message: "Rider assigned, heading to Buka" },
      { message: "Package picked up by rider" },
      { message: "Rider is heading your way" },
    ],
  },
  {
    key: "delivered",
    title: "Delivered",
    icon: CheckCircle,
    steps: [{ message: "Order completed, enjoy your meal!" }],
  },
];

function getStatusMapping(status: string, subStatus: string) {
  const s = status?.toLowerCase() || "";
  const sub = subStatus?.toLowerCase() || "";

  if (s === "confirming") {
    if (sub === "confirmed") return { phaseIndex: 0, subStepIndex: 1 };
    return { phaseIndex: 0, subStepIndex: 0 };
  }
  if (s === "packaging") {
    if (sub === "ready" || sub === "packaged") return { phaseIndex: 1, subStepIndex: 1 };
    return { phaseIndex: 1, subStepIndex: 0 };
  }
  if (s === "riding") {
    if (sub === "rider_assigned") return { phaseIndex: 2, subStepIndex: 1 };
    if (sub === "picked_up") return { phaseIndex: 2, subStepIndex: 2 };
    if (sub === "on_the_way") return { phaseIndex: 2, subStepIndex: 3 };
    return { phaseIndex: 2, subStepIndex: 0 }; // looking_for_rider
  }
  if (s === "delivered") {
    return { phaseIndex: 3, subStepIndex: 0 };
  }
  return { phaseIndex: 0, subStepIndex: 0 };
}

export default function CustomerOrderTrackingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Ratings State
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    type: "Vendor" | "Rider";
    stars: number;
    comment: string;
    submitting: boolean;
    success: boolean;
  }>({
    isOpen: false,
    type: "Vendor",
    stars: 0,
    comment: "",
    submitting: false,
    success: false,
  });

  // Keep track of rated targets to disable button
  const [ratedTargets, setRatedTargets] = useState<Record<string, boolean>>({});

  const fetchOrderDetails = async () => {
    if (!id) return;
    try {
      const response: any = await apiClient.get(`/api/orders/${id}`);
      if (response.success && response.order) {
        setOrder(response.order);
      } else {
        setOrder(response);
      }
      setError("");
    } catch (err: any) {
      console.error("HTTP fetch order error:", err);
      setError(err.message || "Failed to sync order status.");
    } finally {
      setLoading(false);
    }
  };

  // 1. WebSocket Live Synchronization
  useEffect(() => {
    if (!id) return;
    const token = useAuthStore.getState().token;
    
    // Connect to websocket room for live order events
    const socket = io(BASE_URL, {
      auth: { token: `Bearer ${token}` },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socket.on("connect", () => {
      console.log("Joined order tracking socket channel for:", id);
      socket.emit("join_order", { orderId: id });
    });

    socket.on("order_status_update", (payload: any) => {
      console.log("Socket order status update received:", payload);
      if (payload) {
        setOrder((prev: any) => {
          const updated = payload.order || payload;
          return { ...prev, ...updated };
        });
      }
    });

    socket.on("otp_update", (payload: any) => {
      console.log("Socket OTP update received:", payload);
      if (payload?.otp) {
        setOrder((prev: any) => prev ? { ...prev, deliveryOtpCode: payload.otp } : null);
      }
    });

    socket.on("disconnect", () => {
      console.log("Order tracking socket disconnected.");
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // 2. HTTP Fallback Polling (polls every 15 seconds)
  useEffect(() => {
    fetchOrderDetails();
    const interval = setInterval(fetchOrderDetails, 15000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-[#2C5E2E] animate-spin mb-4" />
          <p className="text-gray-500 font-semibold">Initializing order tracker...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h3>
          <p className="text-gray-500 text-sm mb-6">{error || "This order may have expired or is unauthorized."}</p>
          <button
            id="back-to-browse-btn"
            onClick={() => navigate("/customer/browse")}
            className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
          >
            Back to Browse
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const { phaseIndex: currentPhaseIndex, subStepIndex: currentSubStepIndex } = getStatusMapping(order.status, order.subStatus);

  const riderName = order.rider?.user?.name || order.rider?.name || order.rider?.firstName || "Your Rider";
  const riderPhone = order.rider?.user?.phone || order.rider?.phone || order.rider?.phoneNumber;
  const vendorName = order.vendor?.name || "Buka Kitchen";
  const pickupAddress = order.vendor?.location?.address || order.vendor?.address || "Restaurant Location";
  const activePhase = ORDER_STEPS[currentPhaseIndex] || ORDER_STEPS[0];
  const orderNumber = order.orderNumber || order._id?.substring(0, 8).toUpperCase();

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOtp = () => {
    if (order.deliveryOtpCode) {
      navigator.clipboard.writeText(order.deliveryOtpCode);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  // Submit Rating Handler
  const handleRateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ratingModal.stars === 0) return;

    setRatingModal((prev) => ({ ...prev, submitting: true }));
    try {
      const endpoint = ratingModal.type === "Vendor" ? "/api/vendors/review" : "/api/riders/review";
      const payload = ratingModal.type === "Vendor"
        ? {
            vendorId: order.vendor?.id || order.vendor?._id || order.vendor,
            rating: ratingModal.stars,
            comment: ratingModal.comment,
            orderId: order._id || order.id,
          }
        : {
            riderId: order.rider?.id || order.rider?._id || order.rider,
            rating: ratingModal.stars,
            comment: ratingModal.comment,
            orderId: order._id || order.id,
          };

      await apiClient.post(endpoint, payload);
      
      // Update local rated status
      setRatedTargets((prev) => ({ ...prev, [ratingModal.type]: true }));
      setRatingModal((prev) => ({ ...prev, success: true }));

      setTimeout(() => {
        setRatingModal({
          isOpen: false,
          type: "Vendor",
          stars: 0,
          comment: "",
          submitting: false,
          success: false,
        });
      }, 2000);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit rating. Please try again.");
      setRatingModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans text-gray-800">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 py-8 space-y-8 mt-12">
        {/* Header navigation bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="back-to-browse-btn"
              onClick={() => navigate("/customer/browse")}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors shadow-sm cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                Order #{orderNumber}
              </h1>
              <p className="text-xs text-gray-400 font-bold flex items-center gap-2">
                Status: 
                <span className="text-[#2C5E2E] font-black uppercase bg-[#ECFFED] px-2.5 py-0.5 rounded-full border border-[#2C5E2E]/10">
                  {order.status}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyOrderNumber}
            className="self-start sm:self-center flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2 rounded-2xl text-xs font-bold text-[#1A3F1C] transition-colors cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Order Number</span>
              </>
            )}
          </button>
        </div>

        {/* Live Delivery OTP Alert */}
        {order.status === "riding" && order.deliveryOtpCode && (
          <div className="bg-gradient-to-r from-[#FFC727] to-[#e0af22] rounded-3xl p-6 shadow-md border border-amber-300 text-[#1A3F1C] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="font-extrabold text-lg flex items-center gap-2 justify-center md:justify-start">
                <ShieldAlert className="w-5 h-5" /> Delivery Code Required
              </h4>
              <p className="text-xs text-[#1A3F1C]/85 font-semibold">Share this secure verification OTP code with the rider when they arrive to confirm delivery.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-2xl px-6 py-3.5 text-center shadow-inner select-all">
                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-extrabold block">Delivery OTP</span>
                <span className="text-3xl font-black text-[#1A3F1C] tracking-[0.1em]">{order.deliveryOtpCode}</span>
              </div>
              <button
                onClick={handleCopyOtp}
                className="w-12 h-12 bg-white/20 hover:bg-white/35 rounded-2xl flex items-center justify-center transition-colors cursor-pointer text-[#1A3F1C]"
                title="Copy OTP Code"
              >
                {copiedOtp ? <Check className="w-5 h-5 text-emerald-800" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        )}

        {/* Main tracking layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Order Progress Stepper */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[#2C5E2E]/10 shadow-sm space-y-8">
            <h3 className="text-lg font-extrabold text-[#1A3F1C] border-b border-gray-100 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2C5E2E]" /> Live Progress
            </h3>

            {/* Stepper Phase Grid */}
            <div className="flex justify-between items-start gap-1 pb-6 border-b border-gray-50">
              {ORDER_STEPS.map((step, idx) => {
                const isActive = idx === currentPhaseIndex;
                const isCompleted = idx < currentPhaseIndex;
                const Icon = step.icon;

                return (
                  <div key={step.key} className="flex-1 flex flex-col items-center relative text-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                        isCompleted 
                          ? "bg-[#2C5E2E] border-[#2C5E2E] text-white" 
                          : isActive 
                            ? "bg-[#ECFFED] border-[#2C5E2E] text-[#2C5E2E] scale-110 shadow-md shadow-[#2C5E2E]/10" 
                            : "bg-gray-50 border-gray-200 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <span 
                      className={`text-[10px] font-bold mt-2 leading-tight ${
                        isActive ? "text-[#2C5E2E] font-black" : isCompleted ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </span>
                    {idx < ORDER_STEPS.length - 1 && (
                      <div 
                        className={`absolute left-[58%] right-0 top-5 h-[2px] w-[84%] -z-0 transition-colors duration-300 ${
                          idx < currentPhaseIndex ? "bg-[#2C5E2E]" : "bg-gray-100"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Sub-steps status logs */}
            <div className="space-y-6">
              <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Phase Details</span>
              <div className="relative pl-7 space-y-6">
                <div className="absolute left-3 top-2 bottom-2 w-[2px] bg-gray-100" />
                
                {activePhase.steps.map((step, idx) => {
                  const isActive = idx === currentSubStepIndex;
                  const isCompleted = idx < currentSubStepIndex;

                  return (
                    <div key={idx} className="relative flex items-start gap-4">
                      <div 
                        className={`absolute -left-[23px] w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted 
                            ? "bg-[#2C5E2E] border-[#2C5E2E] text-white" 
                            : isActive 
                              ? "bg-[#FFC727] border-[#2C5E2E] scale-110 animate-pulse shadow-sm shadow-[#2C5E2E]/15" 
                              : "bg-white border-gray-200"
                        }`}
                      >
                        {isCompleted && <span className="text-[8px] font-bold">✓</span>}
                      </div>

                      <div>
                        <h4 className={`text-sm font-bold ${isActive ? "text-[#2C5E2E] text-base font-black" : isCompleted ? "text-[#1A3F1C]/80" : "text-gray-400"}`}>
                          {step.message}
                        </h4>
                        {isActive && (
                          <p className="text-xs text-gray-400 font-semibold mt-0.5 leading-snug">Current active stage of your order.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Post Delivery Rating Panels */}
            {order.status === "delivered" && (
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">How was your experience?</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Buka Rating Card */}
                  <div className="bg-[#ECFFED]/30 rounded-2xl p-4 border border-[#2C5E2E]/10 flex flex-col justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1A3F1C]">Rate Buka</h4>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5">Let us know how the food tasted!</p>
                    </div>
                    <button
                      onClick={() => setRatingModal({ isOpen: true, type: "Vendor", stars: 0, comment: "", submitting: false, success: false })}
                      disabled={ratedTargets["Vendor"]}
                      className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer text-center ${
                        ratedTargets["Vendor"]
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                          : "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white hover:scale-102"
                      }`}
                    >
                      {ratedTargets["Vendor"] ? "Buka Rated ✓" : "Rate Buka"}
                    </button>
                  </div>

                  {/* Rider Rating Card */}
                  {order.rider && (
                    <div className="bg-[#ECFFED]/30 rounded-2xl p-4 border border-[#2C5E2E]/10 flex flex-col justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-extrabold text-[#1A3F1C]">Rate Rider</h4>
                        <p className="text-xs text-gray-500 font-semibold mt-0.5">Rate the speed and friendliness!</p>
                      </div>
                      <button
                        onClick={() => setRatingModal({ isOpen: true, type: "Rider", stars: 0, comment: "", submitting: false, success: false })}
                        disabled={ratedTargets["Rider"]}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer text-center ${
                          ratedTargets["Rider"]
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            : "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white hover:scale-102"
                        }`}
                      >
                        {ratedTargets["Rider"] ? "Rider Rated ✓" : "Rate Rider"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Order Details & Logistics */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Logistics summary */}
            <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm space-y-5">
              <h3 className="text-base font-extrabold text-[#1A3F1C] border-b border-gray-100 pb-2">Logistics Summary</h3>

              {/* Vendor details */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Buka Kitchen</h4>
                  <p className="font-extrabold text-sm text-[#1A3F1C] truncate">{vendorName}</p>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5 truncate">{pickupAddress}</p>
                </div>
              </div>

              {/* Rider details */}
              {order.rider ? (
                <div className="flex gap-3 items-start border-t border-gray-50 pt-4">
                  <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                    <Bike className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Assigned Rider</h4>
                    <p className="font-extrabold text-sm text-[#1A3F1C] truncate">{riderName}</p>
                    {riderPhone ? (
                      <a 
                        href={`tel:${riderPhone}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#2C5E2E] font-bold mt-1 hover:underline cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{riderPhone}</span>
                      </a>
                    ) : (
                      <p className="text-xs text-gray-400 font-semibold mt-0.5">Phone unavailable</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 items-start border-t border-gray-50 pt-4 text-gray-400">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center shrink-0">
                    <Bike className="w-4 h-4 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Rider Details</h4>
                    <p className="text-xs font-semibold mt-1">Finding a nearby rider...</p>
                  </div>
                </div>
              )}

              {/* Delivery destination */}
              <div className="flex gap-3 items-start border-t border-gray-50 pt-4">
                <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Delivery Destination</h4>
                  <p className="text-xs text-gray-500 font-bold leading-relaxed mt-1">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>

            {/* Billing invoice details */}
            <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-[#1A3F1C] border-b border-gray-100 pb-2">Items Summary</h3>
              
              <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto pr-1">
                {order.items?.map((item: any, i: number) => (
                  <div key={i} className="py-2.5 flex justify-between text-xs font-semibold">
                    <span className="text-gray-600 truncate pr-3">
                      {item.name || item.item?.name || "Dish"} <span className="text-gray-400 font-extrabold">× {item.quantity}</span>
                    </span>
                    <span className="text-gray-800 shrink-0">
                      ₦{((item.price || item.item?.price || 0) * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2 text-xs font-semibold text-gray-400">
                <div className="flex justify-between">
                  <span>Food Subtotal</span>
                  <span className="text-gray-700">₦{(order.foodTotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-gray-700">₦{(order.deliveryFee || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span className="text-gray-700">₦{(order.serviceFee || 0).toLocaleString()}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100/50">
                    <span>Discount Code</span>
                    <span>- ₦{order.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-[#1A3F1C] pt-3 border-t border-dashed border-gray-200">
                  <span>Grand Total</span>
                  <span className="text-[#2C5E2E] text-base">₦{(order.totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Ratings Modal overlay */}
      {ratingModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => {
              if (!ratingModal.submitting) {
                setRatingModal((prev) => ({ ...prev, isOpen: false }));
              }
            }}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 z-10 text-center space-y-6">
            
            {/* Header info */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2C5E2E] bg-[#ECFFED] px-3.5 py-1 rounded-full">
                Order Feedback
              </span>
              <h3 className="text-xl font-black text-[#1A3F1C] mt-3">
                Rate Ounje {ratingModal.type}
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                How would you rate {ratingModal.type === "Vendor" ? vendorName : riderName}?
              </p>
            </div>

            {ratingModal.success ? (
              <div className="py-8 space-y-3 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-sm text-[#1A3F1C]">Feedback Submitted!</h4>
                <p className="text-xs text-gray-400">Thank you for helping us improve our Bukas and riders.</p>
              </div>
            ) : (
              <form onSubmit={handleRateSubmit} className="space-y-6 text-left">
                {/* 5 Stars picker */}
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isSelected = starValue <= ratingModal.stars;
                    return (
                      <button
                        key={starValue}
                        type="button"
                        onClick={() => setRatingModal((prev) => ({ ...prev, stars: starValue }))}
                        className="p-1 hover:scale-115 active:scale-95 transition-transform cursor-pointer"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            isSelected 
                              ? "fill-amber-400 text-amber-400" 
                              : "text-gray-300 hover:text-amber-300"
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Comment box */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Write a comment (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Enter your experience here..."
                    value={ratingModal.comment}
                    onChange={(e) => setRatingModal((prev) => ({ ...prev, comment: e.target.value }))}
                    className="w-full bg-[#ECFFED]/25 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-[#2C5E2E] transition-colors"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={ratingModal.submitting}
                    onClick={() => setRatingModal((prev) => ({ ...prev, isOpen: false }))}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 border border-gray-200 font-bold py-3.5 rounded-2xl text-xs transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={ratingModal.stars === 0 || ratingModal.submitting}
                    className="flex-1 bg-[#2C5E2E] hover:bg-[#1A3F1C] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    {ratingModal.submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
