import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Plus, Minus, Trash2, MapPin, CreditCard, Wallet, Landmark, Loader2, AlertCircle, Sparkles, Locate, CheckCircle2, XCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LoginModal from "../modals/LoginModal";
import { useCartStore } from "../hooks/useCartStore";
import { useAuthStore } from "../hooks/useAuthStore";
import { apiClient } from "../utils/apiClient";
import { loadGoogleMapsScript } from "../utils/googleMapsLoader";

export default function CustomerCheckoutPage() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.items);
  const vendorId = useCartStore((state) => state.vendorId);
  const vendorName = useCartStore((state) => state.vendorName);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const { isAuthenticated, role, user } = useAuthStore();

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "wallet">("card");
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [googleReady, setGoogleReady] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [deliveryLat, setDeliveryLat] = useState<number | null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number | null>(null);
  const [vendorCoords, setVendorCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchVendorCoords = async () => {
      if (!vendorId) return;
      try {
        const response: any = await apiClient.get(`/api/vendors/vendor/${vendorId}`);
        if (response && response.location?.coordinates) {
          setVendorCoords(response.location.coordinates);
        }
      } catch (err) {
        console.error("Failed to load vendor coordinates on checkout:", err);
      }
    };
    fetchVendorCoords();
  }, [vendorId]);

  // Paystack payment process states
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<"initiating" | "blocked" | "processing" | "verifying" | "success" | "failed">("initiating");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentOrderId, setPaymentOrderId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [paymentAccessCode, setPaymentAccessCode] = useState("");

  const popupRef = useRef<Window | null>(null);
  const intervalRef = useRef<any>(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startPaymentPolling = (popupWindow: Window | null, reference: string, orderId: string) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setPaymentStep("processing");

    const poll = async () => {
      // 1. Check if the popup was closed manually
      if (popupWindow && popupWindow.closed) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        setPaymentStep("verifying");
        try {
          const verifyResponse: any = await apiClient.get("/api/payments/verify", { reference });
          if (verifyResponse.success && verifyResponse.data?.status === "success") {
            handlePaymentSuccess(orderId);
          } else {
            handlePaymentFailure(verifyResponse.data?.reason || "Payment window was closed before completion.");
          }
        } catch (err) {
          handlePaymentFailure("Payment window was closed before completion.");
        }
        return;
      }

      // 2. Poll verification endpoint
      try {
        const verifyResponse: any = await apiClient.get("/api/payments/verify", { reference });
        if (verifyResponse.success && verifyResponse.data?.status === "success") {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (popupWindow) {
            popupWindow.close();
          }
          handlePaymentSuccess(orderId);
        } else if (verifyResponse.data?.status === "failed") {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (popupWindow) {
            popupWindow.close();
          }
          handlePaymentFailure(verifyResponse.data?.reason || "Transaction failed or was declined.");
        }
      } catch (err: any) {
        console.error("Error verifying payment during polling:", err);
      }
    };

    poll();
    intervalRef.current = setInterval(poll, 3000);
  };

  const handlePaymentSuccess = (orderId: string) => {
    setPaymentStep("success");
    clearCart();
    setTimeout(() => {
      setIsPaymentProcessing(false);
      navigate(`/customer/order/${orderId}`);
    }, 2000);
  };

  const handlePaymentFailure = (reason: string) => {
    setPaymentStep("failed");
    setPaymentError(reason);
  };

  const cancelPayment = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (popupRef.current) {
      popupRef.current.close();
      popupRef.current = null;
    }
    setIsPaymentProcessing(false);
  };

  const openPaymentWindowManually = () => {
    if (paymentAccessCode && (window as any).PaystackPop) {
      try {
        const PaystackPop = (window as any).PaystackPop;
        const popup = new PaystackPop();
        popup.resumeTransaction(paymentAccessCode);
        return;
      } catch (err) {
        console.error("Failed to resume Paystack inline transaction:", err);
      }
    }

    if (!paymentUrl) return;

    const width = 600;
    const height = 800;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const popup = window.open(
      paymentUrl,
      "OunjePaystackPayment",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    popupRef.current = popup;
    startPaymentPolling(popup, paymentRef, paymentOrderId);
  };

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setGoogleReady(true))
      .catch(() => setGoogleReady(false));

    // Load Paystack Inline JS script dynamically
    const scriptId = "paystack-inline-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://js.paystack.co/v2/inline.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (googleReady && window.google?.maps?.places) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, [googleReady]);

  const handleAddressChange = (val: string) => {
    setDeliveryAddress(val);
    setDeliveryLat(null);
    setDeliveryLng(null);

    if (val.trim().length > 0 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: val,
          componentRestrictions: { country: "ng" },
          types: ["geocode", "establishment"],
        },
        (predictions: any, status: any) => {
          if (status === "OK" && predictions) {
            setSuggestions(predictions.map((p: any) => p.description));
            setShowDropdown(true);
          } else {
            setSuggestions([]);
            setShowDropdown(false);
          }
        }
      );
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (address: string) => {
    setDeliveryAddress(address);
    setShowDropdown(false);

    if (window.google?.maps?.Geocoder) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results: any, status: any) => {
        if (status === "OK" && results && results[0]) {
          setDeliveryLat(results[0].geometry.location.lat());
          setDeliveryLng(results[0].geometry.location.lng());
        }
      });
    }
  };

  const handleGPSLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setDeliveryLat(latitude);
        setDeliveryLng(longitude);

        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results: any, status: any) => {
              setIsLocating(false);
              if (status === "OK" && results && results[0]) {
                setDeliveryAddress(results[0].formatted_address);
              } else {
                setDeliveryAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
            }
          );
        } else {
          setIsLocating(false);
          setDeliveryAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      (error) => {
        console.error("GPS Geolocate error:", error);
        setIsLocating(false);
        alert("Could not detect location. Please search manually.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Pre-fill fields if user is logged in
  useEffect(() => {
    if (user) {
      let profileAddress = "";
      let profileCoords: [number, number] | null = null;

      const userLoc = user.location as any;
      if (userLoc && typeof userLoc === "object") {
        profileAddress = userLoc.address || "";
        if (Array.isArray(userLoc.coordinates) && userLoc.coordinates.length === 2) {
          profileCoords = [userLoc.coordinates[0], userLoc.coordinates[1]];
        }
      } else if (typeof user.location === "string") {
        profileAddress = user.location;
      }

      if (!profileAddress && user.address) {
        profileAddress = user.address;
      }

      if (!profileCoords && Array.isArray((user as any).coordinates) && (user as any).coordinates.length === 2) {
        profileCoords = [(user as any).coordinates[0], (user as any).coordinates[1]];
      }

      if (profileAddress) {
        setDeliveryAddress(profileAddress);
      }
      if (profileCoords) {
        setDeliveryLng(profileCoords[0]);
        setDeliveryLat(profileCoords[1]);
      }
      if (user.phone) {
        setPhoneNumber(user.phone);
      }
    }
  }, [user]);

  // Distance and delivery fee tiers from Ounje Algorithm
  const DELIVERY_TIERS = [
    { max: 1.5, base: 500, start: 0 },
    { max: 3.5, base: 700, start: 1.5 },
    { max: 6.0, base: 750, start: 3.5 },
    { max: 10.0, base: 900, start: 6.0 },
    { max: 15.0, base: 1200, start: 10.0 },
    { max: Infinity, base: 1400, start: 15.0 },
  ];

  function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function computeDeliveryFee(distanceKm: number): number {
    const tier = DELIVERY_TIERS.find((t) => distanceKm <= t.max) || DELIVERY_TIERS[DELIVERY_TIERS.length - 1];
    if (distanceKm <= 1.5) return tier.base;
    const extra = (distanceKm - tier.start) * 150;
    const raw = tier.base + extra;
    return Math.ceil((distanceKm > 15 ? Math.min(raw, 1900) : raw) / 10) * 10;
  }

  const getDeliveryDistanceKm = () => {
    if (!vendorCoords?.length || deliveryLat === null || deliveryLng === null) return undefined;
    const [vLng, vLat] = vendorCoords;
    return haversineKm(vLat, vLng, deliveryLat, deliveryLng);
  };

  const calculatedDistance = getDeliveryDistanceKm();
  const deliveryFee = calculatedDistance !== undefined
    ? computeDeliveryFee(calculatedDistance)
    : (deliveryAddress.trim() ? 500 : null);

  const serviceFee = 100;
  const discountAmount = promoDiscount;
  const finalTotal = deliveryFee !== null ? Math.max(0, cartTotal + deliveryFee + serviceFee - discountAmount) : null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setCheckoutError("");

    try {
      // Direct mock discount or call backend endpoint if available
      // Backend promo lookup could be /api/promo/validate or similar
      // For simplicity, simulate code check or fallback gracefully
      if (promoCode.toUpperCase() === "OUNJE10") {
        setPromoDiscount(Math.round(cartTotal * 0.1));
        setPromoApplied(true);
      } else {
        setCheckoutError("Invalid promo code. Try OUNJE10.");
      }
    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || "Failed to validate promo code.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    if (role !== "customer") {
      setCheckoutError("Only customer accounts can place orders. Please log out and sign in as a customer.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setCheckoutError("Delivery address is required.");
      return;
    }

    if (!phoneNumber.trim()) {
      setCheckoutError("Phone number is required.");
      return;
    }

    setLoading(true);
    setCheckoutError("");

    try {
      const finalOrderItems = [];

      // 1. Process custom swallow combo Plates & Combos
      for (const item of cartItems) {
        if (item.itemType === "Plate" || (item.itemIds && item.itemIds.length > 0)) {
          // It's a custom plate combo, build it first on the backend
          const formData = new FormData();
          formData.append("name", item.name);
          formData.append("vendor", vendorId || "");
          formData.append("totalPrice", String(item.price));
          formData.append("items", JSON.stringify(item.itemIds));

          const builtPlate: any = await apiClient.post("/api/plates/build-plate", formData, { isMultipart: true });

          finalOrderItems.push({
            itemId: builtPlate._id,
            itemType: "Plate",
            quantity: item.quantity,
          });
        } else if (item.itemType === "Combo") {
          finalOrderItems.push({
            itemId: item.id,
            itemType: "Combo",
            quantity: item.quantity,
            comboSelections: item.comboSelections,
          });
        } else {
          // Regular menu item
          finalOrderItems.push({
            itemId: item.id,
            itemType: "FoodItem",
            quantity: item.quantity,
          });
        }
      }

      // 2. Create the final order on the backend
      const orderPayload = {
        vendorId,
        deliveryAddress,
        phone: phoneNumber,
        items: finalOrderItems,
        paymentMethod: paymentMethod === "wallet" ? "wallet" : "paystack",
        promoCode: promoApplied ? promoCode : undefined,
        deliveryLatitude: deliveryLat || undefined,
        deliveryLongitude: deliveryLng || undefined,
      };

      const orderResponse: any = await apiClient.post("/api/orders", orderPayload);
      const createdOrder = orderResponse.order || orderResponse.data;
      const orderId = createdOrder._id;

      // 3. Initiate payment verification/simulation if payment method is "card" or "bank"
      if (paymentMethod === "card" || paymentMethod === "bank") {
        setPaymentStep("initiating");
        setIsPaymentProcessing(true);
        setPaymentError("");
        try {
          const paymentResponse: any = await apiClient.post("/api/payments/initiate", { orderId });
          const authUrl = paymentResponse.data?.authorization_url || paymentResponse.authorization_url;
          const reference = paymentResponse.data?.reference || paymentResponse.reference;
          const accessCode = paymentResponse.data?.access_code || paymentResponse.access_code;

          if (accessCode && (window as any).PaystackPop) {
            setPaymentUrl(authUrl);
            setPaymentRef(reference);
            setPaymentOrderId(orderId);
            setPaymentAccessCode(accessCode);

            // Resume transaction with official Paystack Inline modal on screen
            const PaystackPop = (window as any).PaystackPop;
            const popup = new PaystackPop();
            popup.resumeTransaction(accessCode);

            // Start polling status check on screen without popup window
            startPaymentPolling(null, reference, orderId);
            return;
          } else if (authUrl) {
            setPaymentUrl(authUrl);
            setPaymentRef(reference);
            setPaymentOrderId(orderId);
            setPaymentAccessCode("");

            // Centered popup positioning (Fallback)
            const width = 600;
            const height = 800;
            const left = window.screenX + (window.outerWidth - width) / 2;
            const top = window.screenY + (window.outerHeight - height) / 2;

            const popup = window.open(
              authUrl,
              "OunjePaystackPayment",
              `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
            );

            popupRef.current = popup;

            // Check if popup blocker triggered
            if (popup === null || popup.closed || typeof popup.closed === "undefined") {
              setPaymentStep("blocked");
            } else {
              startPaymentPolling(popup, reference, orderId);
            }
            return;
          } else {
            throw new Error("Missing authorization details in response.");
          }
        } catch (paymentErr: any) {
          console.error("Payment initiation failed:", paymentErr);
          setIsPaymentProcessing(false);
          setCheckoutError("Could not initialize payment. Please try again or choose another payment option.");
          return;
        }
      }

      // Clear local shopping cart and navigate to tracking page
      clearCart();
      navigate(`/customer/order/${orderId}`);

    } catch (err: any) {
      console.error(err);
      setCheckoutError(err.message || "Failed to place order. Please check details and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 bg-[#2C5E2E]/10 text-[#2C5E2E] rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-extrabold text-[#1A3F1C] mb-2">Your Cart is Empty</h3>
          <p className="text-gray-500 text-sm mb-8">Add delicious meals from local buka kitchens to get started with your checkout.</p>
          <button
            id="back-to-browse-btn"
            onClick={() => navigate("/customer/browse")}
            className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors text-sm"
          >
            Start Browsing Food
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans text-gray-800">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8 mt-10">
          <button
            id="back-btn"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A3F1C]">Secure Checkout</h1>
            <p className="text-xs text-gray-500 font-semibold">Buka: <span className="text-[#2C5E2E]">{vendorName}</span></p>
          </div>
        </div>

        {checkoutError && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Unable to Complete Order</h4>
              <p className="text-xs text-red-600 mt-1 font-semibold">{checkoutError}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Delivery Details & Payment */}
          <div className="lg:col-span-7 space-y-6">

            {/* Delivery details card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2C5E2E]/10 shadow-sm space-y-5">
              <h3 className="text-lg font-extrabold text-[#1A3F1C] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2C5E2E]" /> Delivery Address
              </h3>

              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Address details</label>
                  <div className="relative flex items-center">
                    <input
                      id="address-input"
                      type="text"
                      required
                      placeholder="e.g. 15 Herbert Macaulay Way, Yaba, Lagos"
                      value={deliveryAddress}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-4 pr-12 text-sm focus:outline-none focus:border-[#2C5E2E] focus:bg-white text-gray-800 font-semibold transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleGPSLocate}
                      disabled={isLocating}
                      className="absolute right-3 p-2 text-gray-400 hover:text-[#2C5E2E] transition-colors rounded-xl hover:bg-gray-100 flex items-center justify-center"
                      title="Detect current GPS location"
                    >
                      {isLocating ? (
                        <Loader2 className="w-5 h-5 text-[#2C5E2E] animate-spin" />
                      ) : (
                        <Locate className="w-5 h-5 text-gray-400 fill-transparent" />
                      )}
                    </button>
                  </div>

                  {/* Google Autocomplete Suggestions Dropdown */}
                  {showDropdown && suggestions.length > 0 && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                        {suggestions.map((addr, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectSuggestion(addr)}
                            className="w-full text-left px-5 py-3.5 hover:bg-gray-50 text-xs font-semibold text-gray-700 border-b border-gray-50 last:border-0 transition-colors flex items-start gap-2.5"
                          >
                            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                            <span>{addr}</span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Delivery Phone Number</label>
                  <input
                    id="phone-input"
                    type="tel"
                    required
                    placeholder="e.g. 08022000008"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] focus:bg-white text-gray-800 font-semibold transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Payment options card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#2C5E2E]/10 shadow-sm space-y-5">
              <h3 className="text-lg font-extrabold text-[#1A3F1C] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#2C5E2E]" /> Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  id="pay-bank-btn"
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${paymentMethod === "bank"
                    ? "border-[#2C5E2E] bg-[#ECFFED]/30 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <Landmark className={`w-6 h-6 ${paymentMethod === "bank" ? "text-[#2C5E2E]" : "text-gray-400"}`} />
                  <div>
                    <span className="font-extrabold text-xs text-gray-800 block">Bank Transfer</span>
                    <span className="text-[10px] text-gray-400">Pay via Paystack Transfer</span>
                  </div>
                </button>

                <button
                  id="pay-card-btn"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${paymentMethod === "card"
                    ? "border-[#2C5E2E] bg-[#ECFFED]/30 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <CreditCard className={`w-6 h-6 ${paymentMethod === "card" ? "text-[#2C5E2E]" : "text-gray-400"}`} />
                  <div>
                    <span className="font-extrabold text-xs text-gray-800 block">Online Card</span>
                    <span className="text-[10px] text-gray-400">Paystack Checkout sandbox</span>
                  </div>
                </button>

                <button
                  id="pay-wallet-btn"
                  onClick={() => setPaymentMethod("wallet")}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all ${paymentMethod === "wallet"
                    ? "border-[#2C5E2E] bg-[#ECFFED]/30 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <Wallet className={`w-6 h-6 ${paymentMethod === "wallet" ? "text-[#2C5E2E]" : "text-gray-400"}`} />
                  <div>
                    <span className="font-extrabold text-xs text-gray-800 block">Ounje Wallet</span>
                    <span className="text-[10px] text-gray-400">Deduct from profile balance</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Guest/Checkout Authentication prompt */}
            {!isAuthenticated && (
              <div className="bg-gradient-to-r from-[#2C5E2E] to-[#1A3F1C] rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="font-extrabold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FFC727]" /> Login to complete checkout
                  </h4>
                  <p className="text-white/80 text-xs mt-1.5 max-w-md">Verify your email with a quick OTP to save addresses, track orders, and pay with wallet.</p>
                </div>
                <button
                  id="login-trigger-btn"
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-[#FFC727] hover:bg-[#ffda55] text-[#1A3F1C] font-extrabold px-6 py-3 rounded-2xl text-sm whitespace-nowrap transition-colors shadow-md"
                >
                  Log In / Sign Up
                </button>
              </div>
            )}

            {isAuthenticated && role !== "customer" && (
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-800">Logged In as {role}</h4>
                  <p className="text-xs text-amber-700 mt-1">Please log out and sign in with a Customer account to place this order.</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm space-y-6">
              <h3 className="text-lg font-extrabold text-[#1A3F1C] border-b border-gray-100 pb-3">Order Summary</h3>

              {/* Items List */}
              <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-[#1A3F1C]">{item.name}</h4>
                      {item.options && item.options.length > 0 && (
                        <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                          + {item.options.join(", ")}
                        </p>
                      )}
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            id={`decrease-qty-${item.id}`}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2 text-gray-500 hover:bg-gray-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-700">{item.quantity}</span>
                          <button
                            id={`increase-qty-${item.id}`}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2 text-gray-500 hover:bg-gray-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          id={`remove-item-${item.id}`}
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <span className="font-extrabold text-sm text-[#2C5E2E] whitespace-nowrap">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo code field */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  id="promo-input"
                  type="text"
                  placeholder="Promo Code (OUNJE10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied || promoLoading}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-semibold"
                />
                <button
                  id="apply-promo-btn"
                  type="submit"
                  disabled={promoApplied || promoLoading || !promoCode.trim()}
                  className="bg-[#2C5E2E] hover:bg-[#1A3F1C] disabled:opacity-40 text-white font-bold px-4 rounded-xl text-xs transition-colors whitespace-nowrap flex items-center justify-center"
                >
                  {promoLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Apply"}
                </button>
              </form>

              {promoApplied && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-2 px-3 text-xs font-semibold flex justify-between items-center">
                  <span>Promo Code Applied!</span>
                  <span>- ₦{promoDiscount.toLocaleString()}</span>
                </div>
              )}

              {/* Pricing breakdown */}
              <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs font-semibold">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee !== null ? `₦${deliveryFee.toLocaleString()}` : "Set address"}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Service Fee</span>
                  <span>₦{serviceFee.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>- ₦{promoDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-[#1A3F1C] pt-2 border-t border-dashed border-gray-200">
                  <span>Total amount</span>
                  <span className="text-[#2C5E2E] text-base">
                    {finalTotal !== null ? `₦${finalTotal.toLocaleString()}` : "Set address to view"}
                  </span>
                </div>
              </div>

              {/* Action checkout button */}
              <button
                id="place-order-btn"
                onClick={handlePlaceOrder}
                disabled={loading || (isAuthenticated && role !== "customer")}
                className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] disabled:opacity-55 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#2C5E2E]/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                {!isAuthenticated ? "Log in to Place Order" : "Place Order & Pay"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />

      {/* Paystack Payment Processing Overlay Modal */}
      {isPaymentProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 border border-gray-100 shadow-2xl flex flex-col items-center text-center space-y-6 animate-scale-up">

            {paymentStep === "initiating" && (
              <>
                <div className="w-16 h-16 bg-[#ECFFED] text-[#2C5E2E] rounded-full flex items-center justify-center animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#1A3F1C] mb-2">Initiating Payment</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                    Securing a connection to the Paystack checkout gateway. Please wait...
                  </p>
                </div>
              </>
            )}

            {paymentStep === "blocked" && (
              <>
                <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-amber-800 mb-2">Popup Blocked!</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto mb-4">
                    Your browser blocked the secure payment window. Click below to proceed with your payment.
                  </p>
                  <button
                    onClick={openPaymentWindowManually}
                    className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-sm mb-3 flex items-center justify-center gap-2"
                  >
                    Open Payment Window
                  </button>
                  <button
                    onClick={cancelPayment}
                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-3 px-6 rounded-2xl transition-all text-xs"
                  >
                    Choose Another Method
                  </button>
                </div>
              </>
            )}

            {paymentStep === "processing" && (
              <>
                <div className="w-16 h-16 bg-[#ECFFED] text-[#2C5E2E] rounded-full flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#2C5E2E]/20 animate-spin" style={{ animationDuration: '6s' }} />
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#1A3F1C] mb-2">
                    {paymentAccessCode ? "Secure Payment Active" : "Awaiting Payment"}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                    {paymentAccessCode
                      ? "A secure Paystack checkout modal is overlaying your screen. Please complete your payment."
                      : "A secure checkout window has been opened. Please complete your transaction in that window."}
                  </p>
                  <div className="space-y-3 w-full">
                    {paymentAccessCode && (
                      <button
                        onClick={openPaymentWindowManually}
                        className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                      >
                        Reopen Payment Modal
                      </button>
                    )}
                    {!paymentAccessCode && (
                      <button
                        onClick={() => startPaymentPolling(popupRef.current, paymentRef, paymentOrderId)}
                        className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                      >
                        Verify Payment
                      </button>
                    )}
                    <button
                      onClick={cancelPayment}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-3 px-6 rounded-2xl transition-all text-xs"
                    >
                      Cancel Payment
                    </button>
                  </div>
                </div>
              </>
            )}

            {paymentStep === "verifying" && (
              <>
                <div className="w-16 h-16 bg-[#ECFFED] text-[#2C5E2E] rounded-full flex items-center justify-center animate-pulse">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#1A3F1C] mb-2">Verifying Transaction</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                    Confirming transaction status with Paystack. Please do not close or refresh this page.
                  </p>
                </div>
              </>
            )}

            {paymentStep === "success" && (
              <>
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-emerald-800 mb-2">Payment Successful!</h3>
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs mx-auto">
                    Your payment of <span className="font-bold text-[#1A3F1C]">₦{finalTotal?.toLocaleString()}</span> has been confirmed. Setting up your order tracking...
                  </p>
                </div>
              </>
            )}

            {paymentStep === "failed" && (
              <>
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-red-800 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 text-xs leading-relaxed max-w-xs mx-auto mb-6">
                    {paymentError || "The transaction could not be completed successfully."}
                  </p>
                  <div className="space-y-3 w-full">
                    <button
                      onClick={openPaymentWindowManually}
                      className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                    >
                      Retry Payment
                    </button>
                    <button
                      onClick={cancelPayment}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold py-3 px-6 rounded-2xl transition-all text-xs"
                    >
                      Choose Another Method
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
