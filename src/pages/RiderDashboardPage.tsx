import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bike, ShoppingBag, Landmark, ArrowUpRight, TrendingUp, X, AlertCircle, CheckCircle2, Loader2, LogOut, MapPin } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiClient } from "../utils/apiClient";
import { useAuthStore } from "../hooks/useAuthStore";

export default function RiderDashboardPage() {
  const navigate = useNavigate();
  const { logout, user, role } = useAuthStore();

  const [availableJobs, setAvailableJobs] = useState<any[]>([]);
  const [ongoingJob, setOngoingJob] = useState<any>(null);
  const [balance, setBalance] = useState(0);
  const [completedToday, setCompletedToday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Status/OTP form
  const [deliveryOtp, setDeliveryOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");

  // Payout states
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("058");
  const [accountName, setAccountName] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState("");
  const [payoutErrorMsg, setPayoutErrorMsg] = useState("");

  const [dashboardError, setDashboardError] = useState("");

  const fetchRiderData = async () => {
    try {
      // 1. Fetch available requests
      const availRes: any = await apiClient.get("/api/orders/rider/requests");
      if (availRes && availRes.orders) {
        setAvailableJobs(availRes.orders);
      } else {
        setAvailableJobs([]);
      }

      // 2. Fetch current ongoing job
      const ongoingRes: any = await apiClient.get("/api/orders/rider/ongoing");
      if (ongoingRes && ongoingRes.order) {
        setOngoingJob(ongoingRes.order);
      } else {
        setOngoingJob(null);
      }

      // 3. Fetch payout balance
      const balanceRes: any = await apiClient.get("/api/payouts/balance");
      if (balanceRes && balanceRes.balance !== undefined) {
        setBalance(balanceRes.balance);
      } else if (balanceRes && balanceRes.availableBalance !== undefined) {
        setBalance(balanceRes.availableBalance);
      }

      // 4. Fetch completed orders today
      const completedRes: any = await apiClient.get("/api/orders/rider/completed-today");
      if (completedRes && completedRes.orders) {
        setCompletedToday(completedRes.orders);
      } else {
        setCompletedToday([]);
      }

      setDashboardError("");
    } catch (err: any) {
      console.error(err);
      setDashboardError(err.message || "Failed to synchronize rider logistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role !== "rider") {
      navigate("/rider/auth");
      return;
    }
    fetchRiderData();
    const interval = setInterval(fetchRiderData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, [role]);

  const handleAcceptJob = async (orderId: string) => {
    try {
      setLoading(true);
      await apiClient.put(`/api/orders/rider/${orderId}/accept`, {});
      fetchRiderData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to accept order.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (action: "pickup" | "on-the-way" | "arrived") => {
    if (!ongoingJob) return;
    try {
      setLoading(true);
      await apiClient.put(`/api/orders/rider/${ongoingJob._id}/${action}`, {});
      fetchRiderData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || `Failed to update status to ${action}.`);
      setLoading(false);
    }
  };

  const handleCompleteDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ongoingJob || !deliveryOtp.trim()) return;

    setLoading(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      await apiClient.put(`/api/orders/rider/${ongoingJob._id}/complete`, { otp: deliveryOtp });
      setOtpSuccess("Delivery verified and completed! Earnings credited to wallet.");
      setDeliveryOtp("");
      // Refresh after a short delay
      setTimeout(fetchRiderData, 2000);
    } catch (err: any) {
      console.error(err);
      setOtpError(err.message || "Invalid delivery verification code. Please check with customer.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutLoading(true);
    setPayoutSuccessMsg("");
    setPayoutErrorMsg("");

    try {
      const amountNum = parseFloat(payoutAmount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Please enter a valid payout amount.");
      }
      if (amountNum > balance) {
        throw new Error("Payout amount exceeds available balance.");
      }

      await apiClient.post("/api/payouts/request", {
        amount: amountNum,
        bankDetails: {
          accountNumber,
          bankCode,
          accountName,
        },
      });

      setPayoutSuccessMsg("Payout request submitted successfully! Funds will reach your bank shortly.");
      setPayoutAmount("");
      setAccountName("");
      setAccountNumber("");

      setTimeout(fetchRiderData, 2000);
    } catch (err: any) {
      console.error(err);
      setPayoutErrorMsg(err.message || "Failed to process withdrawal request.");
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading && availableJobs.length === 0 && !ongoingJob) {
    return (
      <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-[#2C5E2E] animate-spin mb-4" />
          <p className="text-gray-500 font-semibold">Opening Rider Dashboard...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans text-gray-800">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8">

        {/* Top welcome banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ECFFED] text-[#2C5E2E] rounded-2xl flex items-center justify-center shadow-inner">
              <Bike className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-[#1A3F1C]">
                {user?.name || "Rider Officer"}
              </h1>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">Rider Force Logistics Dashboard</p>
            </div>
          </div>

          <button
            id="rider-logout-btn"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors border border-red-200 w-full sm:w-auto"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {dashboardError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <span className="text-xs text-red-600 font-semibold">{dashboardError}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Wallet Balance Card */}
          <div className="bg-gradient-to-r from-[#2C5E2E] to-[#1A3F1C] text-white rounded-3xl p-6 shadow-md border border-[#2C5E2E]/10 flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Available Earnings</span>
              <Landmark className="w-5 h-5 text-[#FFC727]" />
            </div>
            <div>
              <h2 className="text-3xl font-black">₦{balance.toLocaleString()}</h2>
            </div>
            <button
              id="payout-request-trigger"
              onClick={() => setIsPayoutOpen(true)}
              className="w-full bg-[#FFC727] hover:bg-[#ffda55] text-[#1A3F1C] font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors mt-2"
            >
              Withdraw Earnings <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Active Job State */}
          <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ongoing Trip</span>
              <Bike className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-[#1A3F1C]">
                {ongoingJob ? `Order #${ongoingJob.orderNumber || ongoingJob._id?.substring(0, 8).toUpperCase()}` : "No Active Trip"}
              </h2>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">
                {ongoingJob ? `Current status: ${ongoingJob.status}` : "Accept a dispatch request below"}
              </p>
            </div>
            {ongoingJob && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-md font-bold self-start mt-2 uppercase">
                {ongoingJob.status}
              </span>
            )}
          </div>

          {/* Total completed today */}
          <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deliveries Today</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-[#1A3F1C]">{completedToday.length}</h2>
              <p className="text-[10px] text-gray-400 font-semibold mt-1">Trips completed today</p>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-bold self-start mt-2 border border-emerald-100">
              Active Rider
            </span>
          </div>
        </div>

        {/* Ongoing Job Workspace */}
        {ongoingJob && (
          <div className="bg-white rounded-3xl border border-[#2C5E2E]/10 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-extrabold text-[#1A3F1C] flex items-center gap-2">
                <Bike className="w-5 h-5 text-[#2C5E2E]" /> Active Ongoing Trip
              </h3>
              <span className="text-xs font-bold text-[#2C5E2E] bg-[#ECFFED] px-3 py-1 rounded-full uppercase">
                {ongoingJob.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pickup & Delivery locations */}
              <div className="space-y-5">
                <div className="flex gap-3.5 items-start">
                  <div className="w-9 h-9 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pickup From (Buka)</h4>
                    <p className="font-extrabold text-sm text-[#1A3F1C]">{ongoingJob.vendor?.name || "Buka Kitchen"}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {ongoingJob.vendor?.address || ongoingJob.vendor?.location?.address || "Lagos, Nigeria"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start border-t border-gray-50 pt-4">
                  <div className="w-9 h-9 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Deliver To (Customer)</h4>
                    <p className="font-extrabold text-sm text-[#1A3F1C]">{ongoingJob.customer?.name || "Ounje Customer"}</p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {ongoingJob.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Delivery Actions & OTP confirmation */}
              <div className="bg-gray-50/50 rounded-3xl p-5 md:p-6 border border-gray-100 flex flex-col justify-between gap-6">
                <div>
                  <h4 className="font-extrabold text-sm text-[#1A3F1C] mb-2">Logistics Control Panel</h4>
                  <p className="text-xs text-gray-400">Update status as you proceed with delivery.</p>
                </div>

                {/* Transit actions */}
                <div className="space-y-4">
                  {ongoingJob.status === "confirmed" && (
                    <button
                      id="rider-pickup-btn"
                      onClick={() => handleStatusUpdate("pickup")}
                      className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors text-sm"
                    >
                      Confirm Package Pick Up
                    </button>
                  )}

                  {ongoingJob.status === "ready" && (
                    <button
                      id="rider-pickup-btn"
                      onClick={() => handleStatusUpdate("pickup")}
                      className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors text-sm"
                    >
                      Confirm Package Pick Up
                    </button>
                  )}

                  {ongoingJob.status === "out_for_delivery" && (
                    <button
                      id="rider-ontheway-btn"
                      onClick={() => handleStatusUpdate("on-the-way")}
                      className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors text-sm"
                    >
                      Mark as On the Way
                    </button>
                  )}

                  {ongoingJob.status === "riding" && (
                    <button
                      id="rider-arrived-btn"
                      onClick={() => handleStatusUpdate("arrived")}
                      className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors text-sm"
                    >
                      Arrived at Destination
                    </button>
                  )}

                  {/* Complete Delivery OTP Form */}
                  {(ongoingJob.status === "arrived" || ongoingJob.status === "out_for_delivery" || ongoingJob.status === "riding") && (
                    <form onSubmit={handleCompleteDelivery} className="space-y-3 pt-3 border-t border-gray-100">
                      {otpSuccess && <p className="text-xs font-semibold text-emerald-600">{otpSuccess}</p>}
                      {otpError && <p className="text-xs font-semibold text-red-600">{otpError}</p>}

                      <div className="flex gap-2">
                        <input
                          id="rider-otp-input"
                          type="text"
                          required
                          maxLength={6}
                          placeholder="Enter Customer OTP"
                          value={deliveryOtp}
                          onChange={(e) => setDeliveryOtp(e.target.value)}
                          className="flex-1 bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-bold tracking-wider"
                        />
                        <button
                          id="rider-complete-btn"
                          type="submit"
                          className="bg-[#FFC727] hover:bg-[#ffda55] text-[#1A3F1C] font-extrabold px-4 rounded-xl text-xs transition-colors"
                        >
                          Verify & Complete
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Available Dispatch Job List */}
        <div className="bg-white rounded-3xl border border-[#2C5E2E]/10 shadow-sm p-6 md:p-8 space-y-6">
          <h3 className="text-lg font-extrabold text-[#1A3F1C] border-b border-gray-100 pb-3 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#2C5E2E]" /> Available Deliveries nearby
          </h3>

          {availableJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#2C5E2E]/20" />
              <p className="text-sm font-semibold">Listening for active dispatch requests...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableJobs.map((job) => (
                <div key={job._id} className="border border-gray-100 rounded-3xl p-5 bg-gray-50/20 flex flex-col justify-between h-48">
                  <div>
                    <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-50">
                      <span className="font-extrabold text-xs text-[#2C5E2E]">Order #{job.orderNumber || job._id.substring(0, 8).toUpperCase()}</span>
                      <span className="text-[10px] text-gray-400 font-bold">₦{job.deliveryFee || 500} payout</span>
                    </div>

                    <p className="text-xs text-gray-700 font-bold truncate">From: {job.vendor?.name || "Buka Kitchen"}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{job.vendor?.address || "Yaba, Lagos"}</p>

                    <p className="text-xs text-gray-700 font-bold truncate mt-2">To: {job.customer?.name || "Customer"}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{job.deliveryAddress}</p>
                  </div>

                  <button
                    id={`claim-btn-${job._id}`}
                    onClick={() => handleAcceptJob(job._id)}
                    className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-2 rounded-xl text-xs shadow-sm mt-3"
                  >
                    Accept Dispatch Job
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Withdrawal request modal */}
      {isPayoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPayoutOpen(false)} />

          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 z-10 space-y-6">
            <button
              onClick={() => {
                setIsPayoutOpen(false);
                setPayoutSuccessMsg("");
                setPayoutErrorMsg("");
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Landmark className="w-6 h-6 text-[#2C5E2E]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1A3F1C]">Withdraw Earnings</h3>
              <p className="text-gray-400 text-xs mt-1">Get your rider payout immediately.</p>
            </div>

            {payoutSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-800 text-xs font-semibold leading-relaxed">
                {payoutSuccessMsg}
              </div>
            )}

            {payoutErrorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-800 text-xs font-semibold leading-relaxed">
                {payoutErrorMsg}
              </div>
            )}

            {!payoutSuccessMsg && (
              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Amount (₦)</label>
                  <input
                    id="payout-amount-input"
                    type="number"
                    required
                    placeholder="e.g. 2500"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-[#1A3F1C] font-extrabold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Bank</label>
                  <select
                    id="payout-bank-select"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] font-semibold text-gray-700"
                  >
                    <option value="058">Guaranty Trust Bank (GTBank)</option>
                    <option value="011">First Bank of Nigeria</option>
                    <option value="057">Access Bank</option>
                    <option value="033">United Bank for Africa (UBA)</option>
                    <option value="035">Wema Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Account Number</label>
                  <input
                    id="payout-account-input"
                    type="text"
                    required
                    maxLength={10}
                    placeholder="10-digit NUBAN number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Account Name</label>
                  <input
                    id="payout-name-input"
                    type="text"
                    required
                    placeholder="Beneficiary Name"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-gray-800"
                  />
                </div>

                <button
                  id="payout-submit-btn"
                  type="submit"
                  disabled={payoutLoading}
                  className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] disabled:opacity-55 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm mt-2 flex items-center justify-center gap-2"
                >
                  {payoutLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4" />
                  )}
                  Submit Payout Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
