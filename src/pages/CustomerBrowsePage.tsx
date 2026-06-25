import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Search, Star, Clock, Utensils, ArrowLeft, Locate, Loader2, ChefHat, Flame, Sparkles, SlidersHorizontal, Home, ShoppingBag, Headphones, User, LogOut, Wallet, CreditCard, Plus, Minus, Trash2, HelpCircle, ChevronDown, ChevronUp, MessageSquare, ShieldAlert, CheckCircle2, FileText, Landmark, Copy, Check, Info, Gift, Key, Phone, Mail, Camera, Upload, History, Truck, XCircle } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { loadGoogleMapsScript } from "../utils/googleMapsLoader";
import { apiClient } from "../utils/apiClient";
import { checkVendorStatus } from "../utils/vendorStatus";
import { useAuthStore } from "../hooks/useAuthStore";
import { useCartStore } from "../hooks/useCartStore";
import LoginModal from "../modals/LoginModal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../components/ui/dropdown-menu";

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

function getDistanceKm(vendorCoords?: [number, number] | null, customerCoords?: [number, number] | null): number | undefined {
  if (!vendorCoords?.length || !customerCoords?.length) return undefined;
  const [vLng, vLat] = vendorCoords;
  const [cLng, cLat] = customerCoords;
  return haversineKm(vLat, vLng, cLat, cLng);
}

function estimateFee(vendorCoords?: [number, number] | null, customerCoords?: [number, number] | null): number | undefined {
  const dist = getDistanceKm(vendorCoords, customerCoords);
  if (dist === undefined) return undefined;
  return computeDeliveryFee(dist);
}

function estimateDeliveryTime(
  vendorCoords?: [number, number] | null,
  customerCoords?: [number, number] | null,
  prepTimeMin?: number
): string {
  const dist = getDistanceKm(vendorCoords, customerCoords);
  const prep = prepTimeMin || 20;
  if (dist === undefined) {
    return `${prep}-${prep + 10} min`;
  }
  const travelTime = Math.ceil(dist * 3); // ~20km/h average speed in Lagos traffic
  const totalMin = prep + travelTime;
  const lowerRange = Math.round(totalMin / 5) * 5;
  const upperRange = lowerRange + 10;
  return `${lowerRange}-${upperRange} min`;
}

export default function CustomerBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialLocation = searchParams.get("location") || "";
  const currentLocParam = searchParams.get("location") || "";

  const queryTab = searchParams.get("tab");
  const [currentTab, setCurrentTab] = useState<"home" | "plates" | "orders" | "support" | "profile" | "wallet" | "earn" | "profile-details">((queryTab as any) || "home");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t && ["home", "plates", "orders", "support", "profile", "wallet", "earn", "profile-details"].includes(t)) {
      setCurrentTab(t as any);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as any);
    const newParams: Record<string, string> = {};
    const loc = searchParams.get("location");
    if (loc) newParams.location = loc;
    newParams.tab = tab;
    setSearchParams(newParams);
  };
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [customerCoords, setCustomerCoords] = useState<[number, number] | null>(null);

  const { isAuthenticated, user, logout, updateUser } = useAuthStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [ordersActiveSubTab, setOrdersActiveSubTab] = useState<"cart" | "ongoing" | "completed">("cart");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});
  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({});

  // Profile Avatar & Webcam state/refs
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Profile details location suggestions & GPS
  const [detailsSuggestions, setDetailsSuggestions] = useState<string[]>([]);
  const [showDetailsDropdown, setShowDetailsDropdown] = useState(false);
  const [isLocatingDetails, setIsLocatingDetails] = useState(false);

  const getProfileLocationData = () => {
    if (!isAuthenticated || !user) return { address: "", coords: null as [number, number] | null };

    let address = "";
    let coords: [number, number] | null = null;

    const userLoc = user.location as any;
    if (userLoc && typeof userLoc === "object") {
      address = userLoc.address || "";
      if (Array.isArray(userLoc.coordinates) && userLoc.coordinates.length === 2) {
        coords = [userLoc.coordinates[0], userLoc.coordinates[1]];
      }
    } else if (typeof user.location === "string") {
      address = user.location;
    }

    if (!address && user.address) {
      address = user.address;
    }

    if (!coords && Array.isArray((user as any).coordinates) && (user as any).coordinates.length === 2) {
      coords = [(user as any).coordinates[0], (user as any).coordinates[1]];
    }

    return { address, coords };
  };

  // Sync location and coords from profile on mount/login if not set in URL
  useEffect(() => {
    const locParam = searchParams.get("location");
    if (!locParam) {
      const { address, coords } = getProfileLocationData();
      if (address) {
        setLocationInput(address);
        setSearchParams({ location: address });
        if (coords) {
          setCustomerCoords(coords);
        }
      }
    }
  }, [isAuthenticated, user, searchParams, setSearchParams]);

  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletBankDetails, setWalletBankDetails] = useState<any>(null);
  const [walletTransactions, setWalletTransactions] = useState<any[]>([]);
  const [walletCopied, setWalletCopied] = useState(false);
  const [walletSearchQuery, setWalletSearchQuery] = useState("");
  const [walletFilter, setWalletFilter] = useState("all");
  const [referralData, setReferralData] = useState<any>(null);
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralCodeInput, setReferralCodeInput] = useState("");
  const [isActivatingCode, setIsActivatingCode] = useState(false);
  const [referralCopied, setReferralCopied] = useState(false);
  const [detailsFirstName, setDetailsFirstName] = useState("");
  const [detailsLastName, setDetailsLastName] = useState("");
  const [detailsPhone, setDetailsPhone] = useState("");
  const [detailsEmail, setDetailsEmail] = useState("");
  const [detailsAddress, setDetailsAddress] = useState("");
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchCustomerOrders = async () => {
        setOrdersLoading(true);
        try {
          const res: any = await apiClient.get("/api/orders");
          if (res && res.success && res.data) {
            setOrders(res.data);
          } else if (Array.isArray(res)) {
            setOrders(res);
          } else if (res && Array.isArray(res.orders)) {
            setOrders(res.orders);
          }
        } catch (err) {
          console.error("Failed to fetch customer orders:", err);
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchCustomerOrders();
    }
  }, [isAuthenticated, currentTab]);

  useEffect(() => {
    if (isAuthenticated && (currentTab === "profile" || currentTab === "wallet")) {
      const fetchWallet = async () => {
        setWalletLoading(true);
        try {
          const res: any = await apiClient.get("/api/customers/wallet");
          if (res && res.success) {
            setWalletBalance(res.balance ?? 0);
            setWalletBankDetails(res.bankDetails ?? null);
            setWalletTransactions(res.transactions ?? []);
          } else if (res) {
            if (typeof res.balance === "number") setWalletBalance(res.balance);
            if (res.bankDetails) setWalletBankDetails(res.bankDetails);
            if (Array.isArray(res.transactions)) setWalletTransactions(res.transactions);
          }
        } catch (err) {
          console.error("Failed to fetch customer wallet:", err);
        } finally {
          setWalletLoading(false);
        }
      };
      fetchWallet();
    }
  }, [isAuthenticated, currentTab]);

  const filteredTransactions = walletTransactions.filter((tx) => {
    if (walletSearchQuery.trim()) {
      const q = walletSearchQuery.toLowerCase();
      const desc = (tx.description || tx.narration || "").toLowerCase();
      if (!desc.includes(q)) return false;
    }
    if (walletFilter !== "all") {
      const type = (tx.type || "").toLowerCase();
      if (walletFilter === "earnings") {
        return type === "credit" || type === "earning";
      }
      if (walletFilter === "withdrawals") {
        return type === "debit" || type === "withdrawal";
      }
      if (walletFilter === "refunds") {
        return type === "refund";
      }
    }
    return true;
  });

  useEffect(() => {
    if (isAuthenticated && currentTab === "earn") {
      const fetchReferralCode = async () => {
        setReferralLoading(true);
        try {
          const res: any = await apiClient.get("/api/referrals/my-code");
          if (res && res.success) {
            setReferralData(res.hasCode ? res.referral : null);
          }
        } catch (err) {
          console.error("Failed to fetch referral details:", err);
        } finally {
          setReferralLoading(false);
        }
      };
      fetchReferralCode();
    }
  }, [isAuthenticated, currentTab]);

  const handleActivateReferralCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralCodeInput.trim() || isActivatingCode) return;

    setIsActivatingCode(true);
    try {
      const res: any = await apiClient.post("/api/referrals/link", { code: referralCodeInput.trim() });
      if (res && res.success) {
        alert(res.message || "Referral code activated successfully!");
        setReferralCodeInput("");
        const detailsRes: any = await apiClient.get("/api/referrals/my-code");
        if (detailsRes && detailsRes.success) {
          setReferralData(detailsRes.hasCode ? detailsRes.referral : null);
        }
      } else {
        alert(res.message || "Failed to activate referral code.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to link referral code. Please check that it is valid.");
    } finally {
      setIsActivatingCode(false);
    }
  };

  useEffect(() => {
    if (user && currentTab === "profile-details") {
      const parts = (user.name || "").trim().split(/\s+/);
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ") || "";
      setDetailsFirstName(first);
      setDetailsLastName(last);
      setDetailsPhone(user.phone ? String(user.phone) : "");
      setDetailsEmail(user.email || "");

      let addr = "";
      if (user.location && typeof user.location === "object") {
        addr = (user.location as any).address || "";
      } else if (typeof user.location === "string") {
        addr = user.location;
      }
      if (!addr && user.address) {
        addr = user.address;
      }
      setDetailsAddress(addr);
    }
  }, [user, currentTab]);

  // Avatar selection and capture handlers
  const handleAvatarPlusClick = () => {
    setIsAvatarMenuOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        updateUser({ avatarUrl: dataUrl });
        setIsAvatarMenuOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    setIsAvatarMenuOpen(false);

    // Wait briefly for modal video ref to mount
    setTimeout(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error("Camera access error:", err);
        setCameraError(err.message || "Failed to access webcam. Please verify camera permissions.");
      }
    }, 200);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    
    const videoWidth = video.videoWidth || 480;
    const videoHeight = video.videoHeight || 480;
    const size = Math.min(videoWidth, videoHeight);
    
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    
    if (ctx) {
      // Draw square cropping center frame
      const sx = (videoWidth - size) / 2;
      const sy = (videoHeight - size) / 2;
      ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
      
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      updateUser({ avatarUrl: dataUrl });
      stopCamera();
    }
  };

  // Details autocomplete address change
  const handleDetailsAddressChange = (val: string) => {
    setDetailsAddress(val);
    if (val.trim().length > 0 && autocompleteService) {
      autocompleteService.getPlacePredictions(
        {
          input: val,
          componentRestrictions: { country: "ng" },
          types: ["geocode", "establishment"],
        },
        (predictions: any, status: any) => {
          if (status === "OK" && predictions) {
            setDetailsSuggestions(predictions.map((p: any) => p.description));
            setShowDetailsDropdown(true);
          } else {
            setDetailsSuggestions([]);
            setShowDetailsDropdown(false);
          }
        }
      );
    } else {
      setDetailsSuggestions([]);
      setShowDetailsDropdown(false);
    }
  };

  const handleLocateMeForDetails = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocatingDetails(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results: any, status: any) => {
              setIsLocatingDetails(false);
              if (status === "OK" && results && results[0]) {
                const address = results[0].formatted_address;
                setDetailsAddress(address);
              } else {
                const locStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                setDetailsAddress(locStr);
              }
            }
          );
        } else {
          setIsLocatingDetails(false);
          const locStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setDetailsAddress(locStr);
        }
      },
      (error) => {
        console.error("GPS Geolocation error in profile details:", error);
        setIsLocatingDetails(false);
        alert("Could not detect location. Please type manually.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSaveProfileDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingDetails) return;

    setIsSavingDetails(true);
    try {
      const originalParts = (user?.name || "").trim().split(/\s+/);
      const originalFirst = originalParts[0] || "";
      const originalLast = originalParts.slice(1).join(" ") || "";
      const originalPhone = user?.phone ? String(user?.phone) : "";
      
      let originalAddress = "";
      if (user?.location && typeof user.location === "object") {
        originalAddress = (user.location as any).address || "";
      } else if (typeof user?.location === "string") {
        originalAddress = user.location;
      }
      if (!originalAddress && user?.address) {
        originalAddress = user.address;
      }

      // Build payload including only non-empty values to avoid validation check errors for blank optional parameters
      const payload: any = {};
      
      const first = (detailsFirstName.trim() || originalFirst).trim();
      if (first) payload.firstName = first;

      const last = (detailsLastName.trim() || originalLast).trim();
      if (last) payload.lastName = last;

      const phoneVal = (detailsPhone.trim() || originalPhone).trim();
      if (phoneVal) payload.phone = phoneVal;

      const locVal = (detailsAddress.trim() || originalAddress).trim();
      if (locVal) payload.location = locVal;

      const emailVal = (detailsEmail.trim() || user?.email || "").trim();
      if (emailVal) payload.email = emailVal;

      const res: any = await apiClient.put("/api/customers/profile", payload);
      if (res && res.success) {
        alert(res.message || "Profile updated successfully!");

        const updatedCustomer = res.customer || {};
        updateUser({
          name: `${payload.firstName || originalFirst} ${payload.lastName || originalLast}`.trim(),
          phone: payload.phone || originalPhone,
          email: payload.email || user?.email || "",
          address: payload.location || originalAddress,
          location: updatedCustomer.location || { address: payload.location || originalAddress, coordinates: updatedCustomer.location?.coordinates || [0, 0] }
        });

        handleTabChange("profile");
      } else {
        alert(res.message || "Failed to update profile details.");
      }
    } catch (err: any) {
      console.error("Save details error:", err);
      
      // Parse detailed validation messages from the backend if available
      let errorMsg = err.message || "Failed to update profile details. Please try again.";
      if (err.data && typeof err.data === "object") {
        if (err.data.message) {
          errorMsg = err.data.message;
        }
        if (Array.isArray(err.data.errors) && err.data.errors.length > 0) {
          const detail = err.data.errors.map((e: any) => e.message || JSON.stringify(e)).join(", ");
          errorMsg = `${errorMsg}: ${detail}`;
        } else if (err.data.error && typeof err.data.error === "object" && err.data.error.message) {
          errorMsg = err.data.error.message;
        } else if (typeof err.data.error === "string") {
          errorMsg = err.data.error;
        }
      }
      alert(errorMsg);
    } finally {
      setIsSavingDetails(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setDebouncedSearchQuery("");
      setActiveSearchQuery("");
      setSearchSuggestions([]);
      setShowSuggestionsDropdown(false);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const [searchResults, setSearchResults] = useState<{
    vendors: any[];
    fooditems: any[];
    combos: any[];
    plates: any[];
  }>({ vendors: [], fooditems: [], combos: [], plates: [] });
  const [searchFilter, setSearchFilter] = useState<"all" | "vendors" | "food" | "combos" | "plates">("all");

  const [vendors, setVendors] = useState<any[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Infinite scroll pagination visible item counts
  const [visibleVendorsCount, setVisibleVendorsCount] = useState(6);
  const [visibleSearchVendorsCount, setVisibleSearchVendorsCount] = useState(6);
  const [visibleSearchFoodCount, setVisibleSearchFoodCount] = useState(6);
  const [visibleSearchCombosCount, setVisibleSearchCombosCount] = useState(6);
  const [visibleSearchPlatesCount, setVisibleSearchPlatesCount] = useState(6);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset scroll pagination visible item counts when filters/search query changes
  useEffect(() => {
    setVisibleVendorsCount(6);
    setVisibleSearchVendorsCount(6);
    setVisibleSearchFoodCount(6);
    setVisibleSearchCombosCount(6);
    setVisibleSearchPlatesCount(6);
  }, [selectedCategory, activeSearchQuery, searchFilter]);

  // Check if there are more items to load in the current view
  const hasMoreToLoad = (() => {
    if (loading) return false;
    if (!activeSearchQuery.trim() && searchFilter === "all") {
      return visibleVendorsCount < filteredVendors.length;
    } else {
      if (searchFilter === "all") {
        return (
          visibleSearchVendorsCount < searchResults.vendors.length ||
          visibleSearchFoodCount < searchResults.fooditems.length ||
          visibleSearchCombosCount < searchResults.combos.length ||
          visibleSearchPlatesCount < searchResults.plates.length
        );
      } else if (searchFilter === "vendors") {
        return visibleSearchVendorsCount < searchResults.vendors.length;
      } else if (searchFilter === "food") {
        return visibleSearchFoodCount < searchResults.fooditems.length;
      } else if (searchFilter === "combos") {
        return visibleSearchCombosCount < searchResults.combos.length;
      } else if (searchFilter === "plates") {
        return visibleSearchPlatesCount < searchResults.plates.length;
      }
    }
    return false;
  })();

  const hasItemsToDisplay = (() => {
    if (!activeSearchQuery.trim() && searchFilter === "all") {
      return filteredVendors.length > 0;
    }
    return (
      searchResults.vendors.length > 0 ||
      searchResults.fooditems.length > 0 ||
      searchResults.combos.length > 0 ||
      searchResults.plates.length > 0
    );
  })();

  // IntersectionObserver to trigger loading more items
  useEffect(() => {
    if (!hasMoreToLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          if (!activeSearchQuery.trim() && searchFilter === "all") {
            setVisibleVendorsCount((prev) => Math.min(prev + 6, filteredVendors.length));
          } else {
            if (searchFilter === "all" || searchFilter === "vendors") {
              setVisibleSearchVendorsCount((prev) => Math.min(prev + 6, searchResults.vendors.length));
            }
            if (searchFilter === "all" || searchFilter === "food") {
              setVisibleSearchFoodCount((prev) => Math.min(prev + 6, searchResults.fooditems.length));
            }
            if (searchFilter === "all" || searchFilter === "combos") {
              setVisibleSearchCombosCount((prev) => Math.min(prev + 6, searchResults.combos.length));
            }
            if (searchFilter === "all" || searchFilter === "plates") {
              setVisibleSearchPlatesCount((prev) => Math.min(prev + 6, searchResults.plates.length));
            }
          }
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [
    hasMoreToLoad,
    activeSearchQuery,
    searchFilter,
    filteredVendors.length,
    searchResults.vendors.length,
    searchResults.fooditems.length,
    searchResults.combos.length,
    searchResults.plates.length
  ]);

  useEffect(() => {
    document.title = "Ounjé | Browse Local Bukás in Lagos";
    loadGoogleMapsScript()
      .then(() => setGoogleReady(true))
      .catch(() => setGoogleReady(false));
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSearchSuggestions = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchSuggestions([]);
        setShowSuggestionsDropdown(false);
        return;
      }

      try {
        const response: any = await apiClient.get("/api/search/suggestions", { q: debouncedSearchQuery.trim() });
        if (response.success && (response.suggestions || response.results)) {
          setSearchSuggestions(response.suggestions || response.results || []);
          setShowSuggestionsDropdown(true);
        } else {
          setSearchSuggestions([]);
        }
      } catch (err) {
        console.error("Error fetching search suggestions:", err);
        setSearchSuggestions([]);
      }
    };

    fetchSearchSuggestions();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    if (googleReady && window.google?.maps?.places) {
      setAutocompleteService(new window.google.maps.places.AutocompleteService());
    }
  }, [googleReady]);

  const handleLocationChange = (val: string) => {
    setLocationInput(val);
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

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (window.google?.maps?.Geocoder) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat: latitude, lng: longitude } },
            (results: any, status: any) => {
              setIsLocating(false);
              if (status === "OK" && results && results[0]) {
                const address = results[0].formatted_address;
                setLocationInput(address);
                setSearchParams({ location: address });
              } else {
                const locStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                setLocationInput(locStr);
                setSearchParams({ location: locStr });
              }
            }
          );
        } else {
          setIsLocating(false);
          const locStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocationInput(locStr);
          setSearchParams({ location: locStr });
        }
      },
      (error) => {
        console.error("GPS Geolocation error:", error);
        setIsLocating(false);
        alert("Could not detect location. Please search manually.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Fetch vendors/search from backend
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const loc = searchParams.get("location");
        let lat: number | undefined = undefined;
        let lng: number | undefined = undefined;

        const { address: profileAddress, coords: profileCoords } = getProfileLocationData();

        if (loc && loc === profileAddress && profileCoords) {
          lng = profileCoords[0];
          lat = profileCoords[1];
        } else if (loc && window.google?.maps?.Geocoder) {
          try {
            const coords = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ address: loc }, (results: any, status: any) => {
                if (status === "OK" && results && results[0]) {
                  resolve({
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng(),
                  });
                } else {
                  reject(new Error("Geocoding failed"));
                }
              });
            });
            lat = coords.lat;
            lng = coords.lng;
          } catch (e) {
            console.error("Geocoding failed, searching active list", e);
          }
        }

        if (lat !== undefined && lng !== undefined) {
          setCustomerCoords([lng, lat]);
        } else {
          setCustomerCoords(null);
        }

        let response: any;

        // Always load nearby vendors list first to ensure local search fallbacks work instantly
        const allVendorsRes: any = await apiClient.get("/api/vendors/all", lat && lng ? { lat, lng } : undefined);
        let fetchedAllVendors: any[] = [];
        if (allVendorsRes.success && allVendorsRes.data) {
          setVendors(allVendorsRes.data);
          fetchedAllVendors = allVendorsRes.data;
        }

        if (activeSearchQuery.trim() || searchFilter !== "all") {
          const queryParams: any = {};
          if (activeSearchQuery.trim()) {
            queryParams.q = activeSearchQuery.trim();
          }
          if (lat && lng) {
            queryParams.lat = lat;
            queryParams.lng = lng;
          }

          if (searchFilter === "all") {
            response = await apiClient.get("/api/search", queryParams);
            console.log("Search 'all' endpoint raw response:", response);
            if (response.success && response.results) {
              let matchedVendors = response.results.vendors || [];
              if (matchedVendors.length === 0 && activeSearchQuery.trim()) {
                const q = activeSearchQuery.toLowerCase();
                matchedVendors = fetchedAllVendors.filter(v =>
                  (v.name || "").toLowerCase().includes(q) ||
                  (v.storeDetails?.[0]?.storeName || "").toLowerCase().includes(q)
                ).map(v => ({
                  id: v.id || v._id,
                  name: v.storeDetails?.[0]?.storeName || v.name,
                  servicesOffered: v.storeDetails?.[0]?.servicesOffered || "Local Meals",
                  averageRating: v.averageRating || v.rating || 0,
                  totalRating: v.ratingCount || 0,
                  image: v.profileImage || v.logoUrl || "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
                  location: v.location,
                  deliveryFee: v.fulfillmentSettings?.deliveryPrice,
                  isOpen: checkVendorStatus(v).isOpen
                }));
              }
              setSearchResults({
                vendors: matchedVendors,
                fooditems: response.results.fooditems || [],
                combos: response.results.combos || [],
                plates: response.results.plates || [],
              });
            }
          } else if (searchFilter === "vendors") {
            response = await apiClient.get("/api/search/vendors", queryParams);
            console.log("Search 'vendors' endpoint raw response:", response);
            if (response.success && response.results) {
              let matchedVendors = response.results || [];
              if (matchedVendors.length === 0 && activeSearchQuery.trim()) {
                const q = activeSearchQuery.toLowerCase();
                matchedVendors = fetchedAllVendors.filter(v =>
                  (v.name || "").toLowerCase().includes(q) ||
                  (v.storeDetails?.[0]?.storeName || "").toLowerCase().includes(q)
                ).map(v => ({
                  id: v.id || v._id,
                  name: v.storeDetails?.[0]?.storeName || v.name,
                  servicesOffered: v.storeDetails?.[0]?.servicesOffered || "Local Meals",
                  averageRating: v.averageRating || v.rating || 0,
                  totalRating: v.ratingCount || 0,
                  image: v.profileImage || v.logoUrl || "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
                  location: v.location,
                  deliveryFee: v.fulfillmentSettings?.deliveryPrice,
                  isOpen: checkVendorStatus(v).isOpen
                }));
              }
              setSearchResults({
                vendors: matchedVendors,
                fooditems: [],
                combos: [],
                plates: [],
              });
            }
          } else if (searchFilter === "food") {
            response = await apiClient.get("/api/search/food", queryParams);
            if (response.success && response.results) {
              setSearchResults({
                vendors: [],
                fooditems: response.results,
                combos: [],
                plates: [],
              });
            }
          } else if (searchFilter === "combos") {
            response = await apiClient.get("/api/search/combos", queryParams);
            if (response.success && response.results) {
              setSearchResults({
                vendors: [],
                fooditems: [],
                combos: response.results,
                plates: [],
              });
            }
          } else if (searchFilter === "plates") {
            response = await apiClient.get("/api/search/plates", queryParams);
            if (response.success && response.results) {
              setSearchResults({
                vendors: [],
                fooditems: [],
                combos: [],
                plates: response.results,
              });
            }
          }
        } else {
          setSearchResults({ vendors: [], fooditems: [], combos: [], plates: [] });
        }
      } catch (err) {
        console.error("Error loading vendors/search:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, [searchParams, googleReady, activeSearchQuery, searchFilter]);

  // Filter vendors locally based on category pills
  useEffect(() => {
    let result = vendors;

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((v) => {
        const services = v.storeDetails?.[0]?.servicesOffered || "";
        return services.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    setFilteredVendors(result);
  }, [vendors, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearchQuery(searchQuery);
    setShowSuggestionsDropdown(false);
  };

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ location: locationInput });
  };

  return (
    <div className="bg-[#ECFFED] min-h-screen md:h-screen md:overflow-hidden flex font-sans text-gray-800 pb-20 md:pb-0">

      {/* 1. DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-[#1A3F1C] text-white border-r border-[#2C5E2E]/20 h-full shrink-0">
        <div className="p-6 border-b border-[#2C5E2E]/20 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ECFFED] rounded-xl flex items-center justify-center shadow-inner">
            <img
              src="/images/ounje-logo.png"
              alt="Ounje logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>

            <h2 className="text-white text-[15px] md:text-[17px] font-extrabold uppercase tracking-wide">OUNJEFOOD</h2>
            <p className="text-[10px] text-[#ECFFED]/60 font-bold uppercase tracking-wider">Customer Portal</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "plates", label: "Plates", icon: Utensils },
            { id: "orders", label: "Orders", icon: ShoppingBag, badge: cartItemsCount },
            { id: "support", label: "Support", icon: Headphones },
            { id: "profile", label: "Profile", icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === "profile" && ["wallet", "earn", "profile-details"].includes(currentTab));
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer select-none ${isActive
                  ? "bg-[#ECFFED] text-[#1A3F1C] shadow-md shadow-black/10 scale-102"
                  : "text-[#ECFFED]/80 hover:text-white hover:bg-white/5"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? "bg-[#1A3F1C] text-white" : "bg-[#ECFFED] text-[#1A3F1C]"
                    }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        {isAuthenticated && user && (
          <div className="p-4 border-t border-[#2C5E2E]/20 bg-[#122E14]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 bg-[#2C5E2E] rounded-full overflow-hidden flex items-center justify-center font-black text-xs text-white">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold truncate text-white">{user.name}</p>
                <p className="text-[9px] text-[#ECFFED]/60 font-semibold truncate">{user.email || user.phone || "No details"}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-2 bg-[#2C5E2E]/20 hover:bg-[#2C5E2E]/40 border border-[#2C5E2E]/40 text-[#ECFFED] py-2.5 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        )}
      </div>

      {/* 2. MOBILE BOTTOM TAB NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-white border-t border-gray-100 py-3.5 px-4 flex justify-around items-center rounded-t-3xl shadow-lg md:hidden">
        {[
          { id: "home", label: "Home", icon: Home },
          { id: "plates", label: "Plates", icon: Utensils },
          { id: "orders", label: "Orders", icon: ShoppingBag, badge: cartItemsCount },
          { id: "support", label: "Support", icon: Headphones },
          { id: "profile", label: "Profile", icon: User }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (item.id === "profile" && ["wallet", "earn", "profile-details"].includes(currentTab));
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-1.5 transition-all select-none relative ${isActive
                ? "bg-[#ECFFED] text-[#2C5E2E] px-4 py-2 rounded-full font-bold text-xs scale-105 shadow-sm"
                : "flex-col items-center justify-center text-gray-400"
                }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {isActive ? (
                <span className="text-xs font-black">{item.label}</span>
              ) : (
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
              )}
              {item.badge && item.badge > 0 && !isActive ? (
                <span className="absolute -top-1.5 -right-1.5 bg-[#2C5E2E] text-white text-[8px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* 3. CONTENT AREA */}
      <div className="flex-1 md:overflow-y-auto overflow-x-hidden md:h-full bg-[#F4FBF4] flex flex-col pb-12">

        {/* Render Guest State warning for Orders and Profile tabs if not logged in */}
        {!isAuthenticated && (currentTab === "orders" || currentTab === "profile") ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center px-4 max-w-md mx-auto">
            <div className="w-16 h-16 bg-[#ECFFED] text-[#2C5E2E] rounded-full flex items-center justify-center mb-6 border border-[#2C5E2E]/10">
              <User className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-[#1A3F1C] mb-2">Access Portal Dashboard</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Please sign in to your Ounjé account to review your active orders, track package delivery progress, and update your personal settings.
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold px-8 py-3 rounded-2xl text-xs transition-all shadow-md hover:scale-[1.02] cursor-pointer"
            >
              Log In / Register
            </button>
          </div>
        ) : (
          /* Main Tab Routing */
          (() => {
            switch (currentTab) {
              case "home":
              default:
                return (
                  <main className="max-w-7xl mx-auto w-full px-4 md:px-8 py-8 flex-1">
                    {/* Header bar */}
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        onClick={() => navigate("/")}
                        className="p-2 bg-white rounded-full hover:bg-gray-50 border border-gray-100 transition-colors shadow-sm cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#2C5E2E]" />
                      </button>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A3F1C]">Browse Local Food</h1>
                        <p className="text-gray-500 text-sm">Showing authentic bukás delivering to your area</p>
                      </div>
                    </div>

                    {/* Location & Search Controls */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#2C5E2E]/10 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Location Update */}
                      <div className="relative">
                        <form onSubmit={handleLocationSubmit} className="relative flex items-center">
                          <MapPin className="absolute left-4 w-5 h-5 text-[#2C5E2E]" />
                          <input
                            type="text"
                            placeholder="Enter your location..."
                            value={locationInput}
                            onChange={(e) => handleLocationChange(e.target.value)}
                            onFocus={() => {
                              if (locationInput.trim().length > 0) setShowDropdown(true);
                            }}
                            className="w-full bg-[#ECFFED]/30 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-36 text-[#1A3F1C] font-semibold focus:outline-none focus:border-[#2C5E2E] transition-colors"
                          />
                          <div className="absolute right-2 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleLocateMe}
                              disabled={isLocating}
                              title="Locate using GPS"
                              className="p-1.5 rounded-lg text-[#2C5E2E] hover:bg-[#ECFFED] transition-colors disabled:opacity-55 cursor-pointer"
                            >
                              <Locate className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
                            </button>
                            <button
                              type="submit"
                              className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              Update
                            </button>
                          </div>
                        </form>

                        {showDropdown && suggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left max-h-60 overflow-y-auto">
                            {suggestions.map((loc) => (
                              <button
                                key={loc}
                                onClick={() => {
                                  setLocationInput(loc);
                                  setShowDropdown(false);
                                  setSearchParams({ location: loc });
                                }}
                                className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[#ECFFED] text-gray-700 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                              >
                                <MapPin className="w-3.5 h-3.5 text-[#FFC727] shrink-0" />
                                <span className="truncate">{loc}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Keyword Search */}
                      <div className="flex gap-2.5 items-stretch relative">
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center">
                          <Search
                            className="absolute left-4 w-5 h-5 text-[#2C5E2E] cursor-pointer hover:scale-105 transition-transform"
                            onClick={() => {
                              setActiveSearchQuery(searchQuery);
                              setShowSuggestionsDropdown(false);
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search dishes, bukás or grills..."
                            value={searchQuery}
                            onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setShowSuggestionsDropdown(true);
                            }}
                            onFocus={() => {
                              if (searchSuggestions.length > 0) setShowSuggestionsDropdown(true);
                            }}
                            className="w-full bg-[#ECFFED]/30 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-[#1A3F1C] focus:outline-none focus:border-[#2C5E2E] transition-colors font-semibold"
                          />

                          {showSuggestionsDropdown && searchSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 text-left max-h-60 overflow-y-auto">
                              {searchSuggestions.map((sug, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setSearchQuery(sug.name || sug.text || sug);
                                    setActiveSearchQuery(sug.name || sug.text || sug);
                                    setShowSuggestionsDropdown(false);
                                  }}
                                  className="w-full px-4 py-3 hover:bg-[#ECFFED] text-gray-700 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0 cursor-pointer flex items-center gap-2.5"
                                >
                                  <Utensils className="w-3.5 h-3.5 text-[#2C5E2E] shrink-0" />
                                  <span className="truncate">{sug.name || sug.text || sug}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </form>

                        {/* Filter Pill Menu */}
                        <DropdownMenu open={showFilterDropdown} onOpenChange={setShowFilterDropdown}>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border transition-all cursor-pointer font-bold text-sm select-none shrink-0 h-full focus:outline-none ${searchFilter !== "all"
                                ? "bg-[#2C5E2E] border-[#2C5E2E] text-white shadow-md shadow-[#2C5E2E]/20"
                                : "bg-white border-gray-200 text-[#1A3F1C]/75 hover:bg-gray-55"
                                }`}
                            >
                              <SlidersHorizontal className="w-4 h-4 shrink-0" />
                              <span className="hidden sm:inline">
                                {searchFilter === "all"
                                  ? "All"
                                  : searchFilter === "vendors"
                                    ? "Vendors"
                                    : searchFilter === "food"
                                      ? "Dishes"
                                      : searchFilter === "combos"
                                        ? "Combos"
                                        : "Plates"}
                              </span>
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-55 overflow-hidden focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150">
                            {[
                              { id: "all", label: "All Results", desc: "Search everything" },
                              { id: "vendors", label: "Bukás & Vendors", desc: "Local vendors" },
                              { id: "food", label: "Dishes & Sides", desc: "Individual items" },
                              { id: "combos", label: "Value Combos", desc: "Special package deals" },
                              { id: "plates", label: "Custom Plates", desc: "Build your plate" },
                            ].map((f) => (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => {
                                  setSearchFilter(f.id as any);
                                  setShowFilterDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-[#ECFFED] transition-colors flex flex-col cursor-pointer ${searchFilter === f.id ? "bg-[#ECFFED]/70 border-r-4 border-[#2C5E2E]" : ""
                                  }`}
                              >
                                <span className={`text-sm font-bold ${searchFilter === f.id ? "text-[#2C5E2E]" : "text-[#1A3F1C]"}`}>
                                  {f.label}
                                </span>
                                <span className="text-[10px] text-gray-450 font-medium mt-0.5 leading-none">
                                  {f.desc}
                                </span>
                              </button>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Category Selection Pills */}
                    <div className="flex gap-2.5 overflow-x-auto pb-4 pr-1 scrollbar-none mb-6">
                      {["All", "Local Meals", "Grills", "Swallow", "Soups", "Drinks"].map((cat) => {
                        const isSelected = selectedCategory === cat;
                        return (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer shadow-sm ${isSelected
                              ? "bg-[#2C5E2E] text-white border border-[#2C5E2E]"
                              : "bg-white text-[#1A3F1C] border border-[#2C5E2E]/10 hover:bg-[#ECFFED]"
                              }`}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>

                    {/* Vendors & Search Loading states */}
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-24">
                        <Loader2 className="w-12 h-12 text-[#2C5E2E] animate-spin mb-4" />
                        <p className="text-gray-500 font-semibold">Scanning local bukás in your neighborhood...</p>
                      </div>
                    ) : !activeSearchQuery.trim() && searchFilter === "all" ? (
                      /* Default list of vendors */
                      filteredVendors.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredVendors.slice(0, visibleVendorsCount).map((vendor) => {
                            const vendorId = vendor.id || vendor._id;
                            const storeName = vendor.storeDetails?.[0]?.storeName || vendor.name || "Buka Kitchen";
                            const services = vendor.storeDetails?.[0]?.servicesOffered || "Local Meals";
                            const rating = vendor.averageRating || vendor.rating || 0;
                            const reviews = vendor.ratingCount || 0;
                            const image = vendor.profileImage || vendor.logoUrl || "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80";
                            const address = vendor.location?.address || "Lagos, Nigeria";
                            const { isOpen, reason: closedReason } = checkVendorStatus(vendor);

                            const calculatedFee = estimateFee(vendor.location?.coordinates, customerCoords);
                            const deliveryFeeStr = calculatedFee !== undefined ? `₦${calculatedFee.toLocaleString()}` : (vendor.fulfillmentSettings?.deliveryPrice ? `₦${vendor.fulfillmentSettings.deliveryPrice}` : "₦500");
                            const prepMin = vendor.fulfillmentSettings?.preparationTimeMin;
                            const deliveryTimeStr = vendor.estimatedDeliveryTime
                              ? (typeof vendor.estimatedDeliveryTime === "number" ? `${vendor.estimatedDeliveryTime} min` : vendor.estimatedDeliveryTime)
                              : estimateDeliveryTime(vendor.location?.coordinates, customerCoords, prepMin);

                            return (
                              <div
                                key={vendorId}
                                onClick={() => navigate(`/customer/vendor/${vendorId}${currentLocParam ? `?location=${encodeURIComponent(currentLocParam)}` : ""}`)}
                                className={`bg-white rounded-3xl overflow-hidden border border-[#2C5E2E]/10 hover:shadow-lg transition-all duration-300 group cursor-pointer ${!isOpen ? "opacity-75" : ""}`}
                              >
                                <div className="h-48 relative overflow-hidden bg-gray-100">
                                  <img
                                    src={image}
                                    alt={storeName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1 shadow-md border border-gray-100">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
                                    <span className="font-extrabold text-[#1A3F1C] text-xs">{rating > 0 ? rating.toFixed(1) : "New"}</span>
                                    {reviews > 0 && <span className="text-[10px] text-gray-400">({reviews})</span>}
                                  </div>
                                </div>
                                <div className="p-5">
                                  <h3 className="font-extrabold text-gray-800 text-lg mb-1 group-hover:text-[#2C5E2E] transition-colors truncate">{storeName}</h3>
                                  <p className="text-[10px] text-[#2C5E2E] font-black uppercase tracking-wider mb-3">{services}</p>
                                  {!isOpen && (
                                    <p className="text-[11px] text-red-600 font-bold mb-2.5 flex items-center gap-1 leading-snug">
                                      <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                      <span>{closedReason}</span>
                                    </p>
                                  )}
                                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                                    <MapPin className="w-3.5 h-3.5 text-[#2C5E2E]/40" />
                                    <span className="truncate">{address}</span>
                                  </div>
                                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                      <Clock className="w-4 h-4 text-[#FFC727]" />
                                      <span className="font-medium">
                                        {customerCoords ? deliveryTimeStr : "Set location"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                      <Utensils className="w-4 h-4 text-[#2C5E2E]" />
                                      <span className="font-bold text-[#1A3F1C]">
                                        {customerCoords ? `${deliveryFeeStr} delivery` : "Set location"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-white rounded-3xl p-12 text-center border border-[#2C5E2E]/10">
                          <div className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-7 h-7 text-[#2C5E2E]" />
                          </div>
                          <h3 className="text-lg font-bold text-[#1A3F1C] mb-1">No bukás found</h3>
                          <p className="text-gray-400 text-sm max-w-sm mx-auto">
                            We couldn't find any vendors matching your criteria. Try changing your search query or looking in another location.
                          </p>
                        </div>
                      )
                    ) : (
                      /* Keyword Search Results mapping */
                      (() => {
                        const hasVendors = searchResults.vendors.length > 0;
                        const hasFood = searchResults.fooditems.length > 0;
                        const hasCombos = searchResults.combos.length > 0;
                        const hasPlates = searchResults.plates.length > 0;
                        const hasAny = hasVendors || hasFood || hasCombos || hasPlates;

                        if (!hasAny) {
                          return (
                            <div className="bg-white rounded-3xl p-12 text-center border border-[#2C5E2E]/10">
                              <div className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-7 h-7 text-[#2C5E2E]" />
                              </div>
                              <h3 className="text-lg font-bold text-[#1A3F1C] mb-1">No results found</h3>
                              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                We couldn't find any matches for "{activeSearchQuery}" matching this filter. Try a different search term or category.
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-12">
                            {hasVendors && (
                              <div className="space-y-4">
                                <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                                  <ChefHat className="w-5 h-5 text-[#2C5E2E]" /> Matching Bukás & Restaurants
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {searchResults.vendors.slice(0, visibleSearchVendorsCount).map((vendor) => {
                                    const vendorId = vendor.id || vendor._id;
                                    const storeName = vendor.name || "Buka Kitchen";
                                    const services = vendor.servicesOffered || "Local Meals";
                                    const rating = vendor.averageRating || vendor.rating || 0;
                                    const reviews = vendor.totalRating || vendor.ratingCount || 0;
                                    const image = vendor.image || "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80";
                                    const address = vendor.location?.address || "Lagos, Nigeria";
                                    const isOpen = vendor.isOpen !== false;

                                    const calculatedFee = estimateFee(vendor.location?.coordinates, customerCoords);
                                    const deliveryFeeStr = calculatedFee !== undefined ? `₦${calculatedFee.toLocaleString()}` : (vendor.deliveryFee !== undefined ? `₦${vendor.deliveryFee}` : "₦500");
                                    const prepMin = vendor.fulfillmentSettings?.preparationTimeMin;
                                    const deliveryTimeStr = vendor.estimatedDeliveryTime
                                      ? (typeof vendor.estimatedDeliveryTime === "number" ? `${vendor.estimatedDeliveryTime} min` : vendor.estimatedDeliveryTime)
                                      : estimateDeliveryTime(vendor.location?.coordinates, customerCoords, prepMin);

                                    return (
                                      <div
                                        key={vendorId}
                                        onClick={() => navigate(`/customer/vendor/${vendorId}${currentLocParam ? `?location=${encodeURIComponent(currentLocParam)}` : ""}`)}
                                        className={`bg-white rounded-3xl overflow-hidden border border-[#2C5E2E]/10 hover:shadow-lg transition-all duration-300 group cursor-pointer ${!isOpen ? "opacity-75" : ""}`}
                                      >
                                        <div className="h-48 relative overflow-hidden bg-gray-100">
                                          <img
                                            src={image}
                                            alt={storeName}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                          />
                                          <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1 shadow-md border border-gray-100">
                                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                            <span className="font-extrabold text-[#1A3F1C] text-xs">{rating > 0 ? rating.toFixed(1) : "New"}</span>
                                            {reviews > 0 && <span className="text-[10px] text-gray-400">({reviews})</span>}
                                          </div>
                                        </div>
                                        <div className="p-5">
                                          <h3 className="font-extrabold text-gray-800 text-lg mb-1 group-hover:text-[#2C5E2E] transition-colors truncate">{storeName}</h3>
                                          <p className="text-[10px] text-[#2C5E2E] font-black uppercase tracking-wider mb-3">{services}</p>
                                          {!isOpen && (
                                            <p className="text-[11px] text-red-600 font-bold mb-2.5 flex items-center gap-1 leading-snug">
                                              <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                              <span>Closed</span>
                                            </p>
                                          )}
                                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                                            <MapPin className="w-3.5 h-3.5 text-[#2C5E2E]/40" />
                                            <span className="truncate">{address}</span>
                                          </div>
                                          <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                              <Clock className="w-4 h-4 text-[#FFC727]" />
                                              <span className="font-medium">
                                                {customerCoords ? deliveryTimeStr : "Set location"}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-500">
                                              <Utensils className="w-4 h-4 text-[#2C5E2E]" />
                                              <span className="font-bold text-[#1A3F1C]">
                                                {customerCoords ? `${deliveryFeeStr} delivery` : "Set location"}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {hasFood && (
                              <div className="space-y-4">
                                <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                                  <Utensils className="w-5 h-5 text-[#2C5E2E]" /> Individual Food & Sides
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {searchResults.fooditems.slice(0, visibleSearchFoodCount).map((food: any) => {
                                    const vendorId = food.vendor?.id || food.vendor;
                                    return (
                                      <div
                                        key={food.id || food._id}
                                        onClick={() => navigate(`/customer/vendor/${vendorId}${currentLocParam ? `?location=${encodeURIComponent(currentLocParam)}` : ""}`)}
                                        className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 group"
                                      >
                                        {food.image && (
                                          <img
                                            src={food.image}
                                            alt={food.name}
                                            className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-gray-100"
                                          />
                                        )}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                          <div>
                                            <h4 className="font-extrabold text-[#1A3F1C] text-base mb-1 group-hover:text-[#2C5E2E] transition-colors truncate">{food.name}</h4>
                                            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-2">{food.description || "Authentic Naija recipe prepared fresh."}</p>
                                          </div>
                                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-100">
                                            <span className="font-extrabold text-[#2C5E2E] text-base">₦{food.price.toLocaleString()}</span>
                                            <span className="text-[10px] bg-[#2C5E2E] text-white px-3 py-1.5 rounded-xl font-extrabold shadow-sm group-hover:bg-[#1A3F1C] transition-colors">
                                              Order Menu
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {hasCombos && (
                              <div className="space-y-4">
                                <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                                  <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" /> Special Value Combos
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {searchResults.combos.slice(0, visibleSearchCombosCount).map((combo: any) => {
                                    const vendorId = combo.vendor?.id || combo.vendor;
                                    return (
                                      <div
                                        key={combo.id}
                                        onClick={() => navigate(`/customer/vendor/${vendorId}${currentLocParam ? `?location=${encodeURIComponent(currentLocParam)}` : ""}`)}
                                        className="bg-gradient-to-br from-amber-50/45 via-white to-emerald-50/20 rounded-3xl p-5 border border-amber-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 relative overflow-hidden group"
                                      >
                                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-2xl shadow-sm">
                                          Combo Deal
                                        </div>
                                        {combo.image && (
                                          <img
                                            src={combo.image}
                                            alt={combo.name}
                                            className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-amber-100"
                                          />
                                        )}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                          <div>
                                            <h4 className="font-extrabold text-[#1A3F1C] text-base mb-1 group-hover:text-[#2C5E2E] transition-colors truncate">{combo.name}</h4>
                                            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-2">{combo.description || "Curated local value combo package."}</p>
                                          </div>
                                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-100">
                                            <span className="font-extrabold text-[#2C5E2E] text-base">₦{combo.basePrice ? combo.basePrice.toLocaleString() : (combo.price || 0).toLocaleString()}</span>
                                            <span className="text-[10px] bg-[#2C5E2E] text-white px-3 py-1.5 rounded-xl font-extrabold shadow-sm group-hover:bg-[#1A3F1C] transition-colors">
                                              Order Combo
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {hasPlates && (
                              <div className="space-y-4">
                                <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                                  <Sparkles className="w-5 h-5 text-indigo-500" /> Custom Plates
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {searchResults.plates.slice(0, visibleSearchPlatesCount).map((plate: any) => {
                                    const vendorId = plate.vendor?.id || plate.vendor;
                                    return (
                                      <div
                                        key={plate.id}
                                        onClick={() => navigate(`/customer/vendor/${vendorId}${currentLocParam ? `?location=${encodeURIComponent(currentLocParam)}` : ""}`)}
                                        className="bg-white rounded-3xl p-5 border border-indigo-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 group"
                                      >
                                        {plate.image && (
                                          <img
                                            src={plate.image}
                                            alt={plate.name}
                                            className="w-24 h-24 rounded-2xl object-cover shrink-0"
                                          />
                                        )}
                                        <div className="flex-1 flex flex-col justify-between min-w-0">
                                          <div>
                                            <h4 className="font-extrabold text-[#1A3F1C] text-base mb-1 group-hover:text-[#2C5E2E] transition-colors truncate">{plate.name}</h4>
                                            <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-2">{plate.description || "Create a custom plate combo."}</p>
                                          </div>
                                          <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-100">
                                            <span className="font-extrabold text-[#2C5E2E] text-base">₦{plate.price ? plate.price.toLocaleString() : "0"}</span>
                                            <span className="text-[10px] bg-[#2C5E2E] text-white px-3 py-1.5 rounded-xl font-extrabold shadow-sm group-hover:bg-[#1A3F1C] transition-colors">
                                              Build Plate
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    )}
                    {/* Infinite Scroll Sentinel & Loading Indicator */}
                    {hasMoreToLoad ? (
                      <div ref={sentinelRef} className="py-8 flex flex-col items-center justify-center space-y-2 mt-8">
                        <Loader2 className="w-8 h-8 text-[#2C5E2E] animate-spin" />
                        <p className="text-xs text-[#2C5E2E]/60 font-bold uppercase tracking-wider animate-pulse">Loading more delicious options...</p>
                      </div>
                    ) : (
                      hasItemsToDisplay && !loading && (
                        <div className="py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-wider border-t border-dashed border-[#2C5E2E]/10 mt-12">
                          🎉 You've reached the end of the kitchen!
                        </div>
                      )
                    )}
                  </main>
                );

              case "plates":
                return (
                  <main className="max-w-md md:max-w-lg mx-auto w-full px-4 py-12 flex-1 flex flex-col justify-center space-y-8">
                    {/* Header: Explore + Coming Soon */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <h1 className="text-3xl font-black text-[#1A3F1C]">Explore</h1>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ECFFED] text-[#2C5E2E] border border-[#2C5E2E]/15 rounded-full text-[10px] font-extrabold select-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2C5E2E]"></span>
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs font-bold">Exciting new dining features are on the way</p>
                    </div>

                    {/* Central Premium Card */}
                    <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6 py-14">
                      {/* New Release Badge */}
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#ECFFED] text-[#2C5E2E] border border-[#2C5E2E]/15 rounded-full text-[10px] font-black uppercase tracking-wider select-none">
                        ✨ New Release
                      </span>

                      {/* Circular icon container */}
                      <div className="w-24 h-24 bg-[#ECFFED] rounded-full flex items-center justify-center text-[#2C5E2E]">
                        <Sparkles className="w-10 h-10 fill-current" />
                      </div>

                      {/* Main cooking callout */}
                      <div className="space-y-2">
                        <h2 className="text-2xl font-black text-[#1A3F1C] tracking-tight">
                          Something special is cooking!
                        </h2>
                        <p className="text-gray-400 text-xs md:text-sm font-semibold leading-relaxed max-w-xs mx-auto">
                          We are building premium features to take your OunjeFood experience to the next level. Stay tuned for updates!
                        </p>
                      </div>
                    </div>
                  </main>
                );

              case "orders": {
                const ongoingList = orders.filter(o => o.status !== "delivered");
                const completedList = orders.filter(o => o.status === "delivered");

                const renderOrderCard = (orderItem: any) => {
                  const orderId = orderItem._id || orderItem.id;
                  const orderNumber = orderItem.orderNumber || orderId.substring(0, 8).toUpperCase();
                  const vendorName = orderItem.vendorName || orderItem.vendor?.name || "Buka Kitchen";
                  
                  // Status color configurations
                  const status = (orderItem.status || "placed").toLowerCase();
                  let statusBg = "bg-emerald-50 text-emerald-600 border-emerald-100";
                  if (status === "cancelled") {
                    statusBg = "bg-red-50 text-red-650 border-red-150";
                  } else if (status === "delivered") {
                    statusBg = "bg-gray-100 text-gray-500 border-gray-200";
                  }

                  // Includes items list
                  const itemsListStr = orderItem.items && orderItem.items.length > 0
                    ? orderItem.items.map((i: any) => `${i.quantity}x ${i.itemId?.name || i.name || "Dish"}`).join(", ")
                    : "";

                  // Subtotal and delivery fee calculations
                  const deliveryPrice = orderItem.deliveryFee || 180;
                  const subTotal = Math.max(0, (orderItem.totalPrice || orderItem.total || 0) - deliveryPrice);

                  const isDetailsExpanded = !!expandedOrders[orderId];
                  const isHistoryExpanded = !!expandedHistory[orderId];

                  return (
                    <div 
                      key={orderId} 
                      className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex flex-col justify-between font-sans transition-all duration-300 relative text-left"
                    >
                      {/* Card Header Section */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-[#1A3F1C] text-sm md:text-base">
                              Order #{orderNumber}
                            </h4>
                            <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase border select-none ${statusBg}`}>
                              {status}
                            </span>
                            {status === "cancelled" && (
                              <div className="relative group inline-block">
                                <Info className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 inline ml-1 align-middle" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-52 p-2.5 bg-black/85 backdrop-blur-sm text-white text-[10px] font-semibold rounded-lg shadow-lg text-center z-30 transition-all leading-normal">
                                  {orderItem.cancellationReason || "Order was cancelled by customer / store."}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/85" />
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="font-extrabold text-sm text-gray-800">{vendorName}</p>
                          {itemsListStr && (
                            <p className="text-gray-555 text-xs font-semibold leading-relaxed truncate max-w-full">
                              Includes: {itemsListStr}
                            </p>
                          )}
                          
                          {/* Estimated Delivery / Completed badge */}
                          <div className="bg-[#ECFFED] text-[#2C5E2E] px-3.5 py-2 rounded-2xl text-xs font-black w-fit mt-3 flex items-center gap-2 border border-[#2C5E2E]/10">
                            {status === "delivered" ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Delivered successfully</span>
                              </>
                            ) : status === "cancelled" ? (
                              <>
                                <XCircle className="w-4 h-4 text-red-500" />
                                <span>Cancelled</span>
                              </>
                            ) : (
                              <>
                                <Truck className="w-4 h-4 animate-bounce" />
                                <span>Est. Delivery: {orderItem.estimatedDelivery || "Tomorrow, 2 PM"}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Pricing & Tracking Controls */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 w-full md:w-auto shrink-0 border-t md:border-0 pt-3 md:pt-0 border-gray-100">
                          <div className="text-left md:text-right">
                            <span className="font-black text-xl text-[#1A3F1C] block">
                              ₦{(orderItem.totalPrice || orderItem.total || 0).toLocaleString()}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                              Subtotal (₦{subTotal.toLocaleString()}) + Delivery (₦{deliveryPrice.toLocaleString()})
                            </span>
                          </div>
                          
                          {status !== "delivered" && status !== "cancelled" && (
                            <button
                              onClick={() => navigate(`/customer/order/${orderId}`)}
                              className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold px-4.5 py-2.5 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <MapPin className="w-3.5 h-3.5 fill-transparent" />
                              <span>Track Order</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Collapsible Details Area */}
                      {isDetailsExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-xs space-y-3 font-sans animate-fade-in">
                          <div>
                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block mb-1">Items Summary</span>
                            <div className="space-y-1.5 pl-2.5 border-l-2 border-[#2C5E2E]/10">
                              {orderItem.items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center text-[#1A3F1C] font-semibold">
                                  <span>{item.quantity}x {item.itemId?.name || item.name}</span>
                                  <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {orderItem.deliveryAddress && (
                            <div>
                              <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block mb-0.5">Delivery Address</span>
                              <p className="text-[#1A3F1C] font-semibold pl-2.5 border-l-2 border-[#2C5E2E]/10 truncate">{orderItem.deliveryAddress}</p>
                            </div>
                          )}
                          {orderItem.paymentMethod && (
                            <div>
                              <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block mb-0.5">Payment Method</span>
                              <p className="text-[#1A3F1C] font-semibold pl-2.5 border-l-2 border-[#2C5E2E]/10 uppercase">{orderItem.paymentMethod}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Order History timeline */}
                      {isHistoryExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-3 font-sans animate-fade-in">
                          <div className="pl-6 border-l-2 border-[#2C5E2E]/20 space-y-4 relative mt-2 ml-2">
                            {/* Placed step */}
                            <div className="relative">
                              <div className="absolute -left-[29px] top-0.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                              </div>
                              <div>
                                <span className="font-extrabold text-[11px] text-gray-700 block">Placed</span>
                                <span className="text-[10px] text-gray-400 font-medium">Order successfully submitted</span>
                              </div>
                            </div>

                            {/* Prepared step */}
                            <div className="relative">
                              <div className={`absolute -left-[29px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                                status === 'placed' ? 'bg-gray-200' : 'bg-emerald-500'
                              }`}>
                                {status !== 'placed' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                              </div>
                              <div>
                                <span className={`font-extrabold text-[11px] block ${status === 'placed' ? 'text-gray-400' : 'text-gray-700'}`}>Prepared</span>
                                <span className="text-[10px] text-gray-400 font-medium">Kitchen finished preparing meal</span>
                              </div>
                            </div>

                            {/* Transit/Delivered/Cancelled final step */}
                            {status === 'cancelled' ? (
                              <div className="relative">
                                <div className="absolute -left-[29px] top-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                  <XCircle className="w-2.5 h-2.5 text-white" />
                                </div>
                                <div>
                                  <span className="font-extrabold text-[11px] text-red-600 block">Cancelled</span>
                                  <span className="text-[10px] text-red-400 font-medium">{orderItem.cancellationReason || "Order was cancelled."}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <div className={`absolute -left-[29px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                                  status === 'delivered' ? 'bg-emerald-500' : 'bg-gray-200'
                                }`}>
                                  {status === 'delivered' && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <div>
                                  <span className={`font-extrabold text-[11px] block ${status === 'delivered' ? 'text-gray-700' : 'text-gray-405'}`}>Delivered</span>
                                  <span className="text-[10px] text-gray-400 font-medium">Order completed and delivered</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer Actions Expand/Timeline buttons */}
                      <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between">
                        <button
                          onClick={() => setExpandedHistory(prev => ({ ...prev, [orderId]: !prev[orderId] }))}
                          className="text-[11px] font-black text-[#2C5E2E] hover:text-[#1A3F1C] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Order History</span>
                        </button>
                        
                        <button
                          onClick={() => setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }))}
                          className="text-[11px] font-black text-gray-400 hover:text-gray-600 flex items-center gap-0.5 cursor-pointer transition-colors"
                        >
                          <span>{isDetailsExpanded ? "Collapse Details" : "Expand for Details"}</span>
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDetailsExpanded ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                };

                return (
                  <main className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 flex-1 space-y-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 bg-[#ECFFED] text-[#2C5E2E] rounded-2xl flex items-center justify-center shadow-sm border border-[#2C5E2E]/10 shrink-0">
                        <ShoppingBag className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A3F1C] tracking-tight">
                          Orders Portal
                        </h1>
                        <p className="text-gray-400 text-xs font-bold mt-0.5">
                          Review your active carts, track ongoing deliveries, or view completed orders
                        </p>
                      </div>
                    </div>

                    {/* Sub-tab Pills */}
                    <div className="bg-white rounded-3xl p-2 border border-[#2C5E2E]/10 flex gap-3 shadow-sm">
                      {[
                        { id: "cart", label: "My Cart", count: cartItemsCount },
                        { id: "ongoing", label: "Ongoing", count: ongoingList.length },
                        { id: "completed", label: "Completed", count: completedList.length }
                      ].map((subTab) => {
                        const isActive = ordersActiveSubTab === subTab.id;
                        return (
                          <button
                            key={subTab.id}
                            onClick={() => setOrdersActiveSubTab(subTab.id as any)}
                            className={`flex-1 py-3 px-4 text-center rounded-2xl transition-all cursor-pointer select-none flex flex-col items-center justify-center relative ${isActive
                              ? "bg-[#2C5E2E] text-white shadow-md scale-102"
                              : "bg-white text-gray-400 hover:text-[#1A3F1C]"
                              }`}
                          >
                            <div className="flex items-center gap-1.5 font-extrabold text-xs md:text-sm">
                              <span>{subTab.label}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${isActive ? "bg-white text-[#2C5E2E]" : "bg-[#2C5E2E]/10 text-[#2C5E2E]"}`}>
                                {subTab.count}
                              </span>
                            </div>
                            {(subTab.id === "ongoing" || subTab.id === "completed") && (
                              <span className={`text-[9px] font-bold mt-1 flex items-center gap-0.5 ${isActive ? "text-white/80" : "text-gray-400"}`}>
                                view detail ⌄
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Render active orders subtab content */}
                    {(() => {
                      switch (ordersActiveSubTab) {
                        case "cart":
                          return cartItems.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-[#2C5E2E]/10 animate-fade-in">
                              <div className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center mx-auto mb-4 text-[#2C5E2E]">
                                <ShoppingBag className="w-7 h-7" />
                              </div>
                              <h3 className="text-lg font-bold text-[#1A3F1C] mb-1">Your cart is empty</h3>
                              <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                                Add some delicious Nigerian dishes or custom plates to your cart and place an order!
                              </p>
                              <button
                                onClick={() => handleTabChange("home")}
                                className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
                              >
                                Find Food Items
                              </button>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
                              {/* Cart Items List */}
                              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm space-y-4">
                                <h3 className="font-extrabold text-[#1A3F1C] text-sm uppercase tracking-wider mb-2">Cart Selection</h3>
                                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto pr-1">
                                  {cartItems.map((item) => (
                                    <div key={item.id} className="py-4 flex items-center gap-4 justify-between">
                                      <div className="min-w-0 flex-1">
                                        <h4 className="font-extrabold text-gray-800 text-sm truncate">{item.name}</h4>
                                        <p className="text-gray-400 text-xs mt-0.5">₦{item.price.toLocaleString()} each</p>
                                        {item.options && item.options.length > 0 && (
                                          <p className="text-[10px] text-[#2C5E2E] font-medium mt-1 truncate">
                                            Toppings: {item.options.join(", ")}
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-2.5 shrink-0">
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                          className="w-7 h-7 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                        >
                                          -
                                        </button>
                                        <span className="text-xs font-extrabold w-4 text-center">{item.quantity}</span>
                                        <button
                                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                          className="w-7 h-7 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
                                        >
                                          +
                                        </button>
                                        <button
                                          onClick={() => removeItem(item.id)}
                                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1 cursor-pointer"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Cart Summary Panel */}
                              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm space-y-4 font-sans">
                                <h3 className="font-extrabold text-[#1A3F1C] text-sm uppercase tracking-wider mb-2">Order Pricing</h3>
                                <div className="space-y-3 text-xs font-semibold text-gray-400">
                                  <div className="flex justify-between">
                                    <span>Food Subtotal</span>
                                    <span className="text-gray-700 font-extrabold">₦{cartTotal.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>takeaway Packaging</span>
                                    <span className="text-gray-700 font-extrabold">₦100</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-gray-700 font-extrabold">₦500</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Service Charge</span>
                                    <span className="text-gray-700 font-extrabold">₦100</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-extrabold text-[#1A3F1C] border-t border-dashed border-gray-200 pt-3 mt-3">
                                    <span>Grand Total</span>
                                    <span className="text-[#2C5E2E]">₦{(cartTotal + 100 + 500 + 100).toLocaleString()}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => navigate("/customer/checkout")}
                                  className="w-full mt-4 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-md hover:scale-[1.01] transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                  Proceed to Checkout <ArrowLeft className="w-4 h-4 rotate-180" />
                                </button>
                              </div>
                            </div>
                          );

                        case "ongoing":
                          return ordersLoading ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-gray-150 animate-fade-in">
                              <Loader2 className="w-8 h-8 text-[#2C5E2E] animate-spin mx-auto mb-2" />
                              <p className="text-gray-400 text-xs">Syncing ongoing deliveries...</p>
                            </div>
                          ) : ongoingList.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-[#2C5E2E]/10 animate-fade-in">
                              <div className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center mx-auto mb-4 text-[#2C5E2E]">
                                <SlidersHorizontal className="w-7 h-7" />
                              </div>
                              <h3 className="text-lg font-bold text-[#1A3F1C] mb-1">No active orders</h3>
                              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                You do not have any pending orders currently. Check out our bukás list to place your first order.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-6 animate-fade-in">
                              {ongoingList.map((orderItem) => renderOrderCard(orderItem))}
                            </div>
                          );

                        case "completed":
                          return ordersLoading ? (
                            <div className="text-center py-12 bg-white rounded-3xl border border-gray-150 animate-fade-in">
                              <Loader2 className="w-8 h-8 text-[#2C5E2E] animate-spin mx-auto mb-2" />
                              <p className="text-gray-400 text-xs">Syncing order history...</p>
                            </div>
                          ) : completedList.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-[#2C5E2E]/10 font-sans animate-fade-in">
                              <div className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center mx-auto mb-4 text-[#2C5E2E]">
                                <Clock className="w-7 h-7" />
                              </div>
                              <h3 className="text-lg font-bold text-[#1A3F1C] mb-1">No past orders</h3>
                              <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                You haven't completed any orders yet. Place an order today and enjoy our fast Nigerian food delivery service.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-6 animate-fade-in">
                              {completedList.map((orderItem) => renderOrderCard(orderItem))}
                            </div>
                          );
                      }
                    })()}
                  </main>
                );
              }

              case "support":
                return (
                  <main className="max-w-4xl mx-auto w-full px-4 md:px-8 py-8 flex-1 space-y-8">

                    {/* Header Banner */}
                    <div className="bg-gradient-to-r from-[#1A3F1C] to-[#2C5E2E] text-white rounded-3xl p-6 md:p-8 shadow-md border border-[#2C5E2E]/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">
                      <div className="space-y-1.5 z-10 relative">
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Support Desk</h1>
                        <p className="text-xs text-[#ECFFED]/80 font-bold">Hello! How can we assist you with your Ounjé order today?</p>
                      </div>

                      <button
                        onClick={() => window.open("https://wa.me/2348123358739?text=Hello%20OunjéSupport", "_blank")}
                        className="bg-[#ECFFED] text-[#1A3F1C] text-xs font-black px-5 py-2.5 rounded-full shadow-sm hover:scale-103 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <span className="w-2 h-2 bg-[#25D366] rounded-full inline-block animate-ping" />
                        <span>Live Help Active</span>
                      </button>
                    </div>

                    {/* Help Topics Grid */}
                    <div className="space-y-4">
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Help Topics</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          {
                            title: "Delivery Issue",
                            desc: "Rider hasn't arrived or food is late",
                            icon: Locate,
                            bgColor: "bg-amber-50 text-amber-600 border-amber-100",
                          },
                          {
                            title: "Menu or App Issue",
                            desc: "Problems placing orders or updating settings",
                            icon: Utensils,
                            bgColor: "bg-red-50 text-red-600 border-red-100",
                          },
                          {
                            title: "Talk to an Agent",
                            desc: "Connect directly with our Whatsapp line",
                            icon: Headphones,
                            bgColor: "bg-[#ECFFED] text-[#2C5E2E] border-emerald-100",
                          }
                        ].map((topic, i) => {
                          const Icon = topic.icon;
                          return (
                            <div
                              key={i}
                              onClick={() => window.open(`https://wa.me/2348123358739?text=Hello%20OunjéSupport%20regarding%20${encodeURIComponent(topic.title)}`, "_blank")}
                              className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer group`}
                            >
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${topic.bgColor}`}>
                                <Icon className="w-5 h-5 shrink-0" />
                              </div>
                              <div>
                                <h4 className="font-extrabold text-sm text-[#1A3F1C] group-hover:text-[#2C5E2E] transition-colors">{topic.title}</h4>
                                <p className="text-xs text-gray-400 font-semibold mt-1 leading-normal">{topic.desc}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* FAQs Section */}
                    <div className="space-y-4 font-sans">
                      <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block">Frequently Asked Questions</span>
                      <div className="space-y-3">
                        {[
                          {
                            q: "Where is my ongoing order?",
                            a: "You can track your order in real-time in the 'Orders' tab. Simply locate the active order and click 'Track Order' to view live map status."
                          },
                          {
                            q: "How do I request a refund?",
                            a: "If there's an issue with your food items (e.g. spilled packaging or missing dishes), message our WhatsApp support desk within 24 hours of delivery with your order number."
                          },
                          {
                            q: "Can I change my delivery address?",
                            a: "Addresses cannot be changed once a rider is assigned to dispatch your meal. If no rider is assigned yet, contact support immediately via Live Help."
                          }
                        ].map((faq, idx) => {
                          const isExpanded = expandedFaq === idx;
                          return (
                            <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                              <button
                                onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-[#1A3F1C] hover:bg-[#ECFFED]/20 transition-colors cursor-pointer select-none"
                              >
                                <span>{faq.q}</span>
                                {isExpanded ? <ChevronUp className="w-4 h-4 text-[#2C5E2E]" /> : <ChevronDown className="w-4 h-4 text-[#2C5E2E]" />}
                              </button>
                              {isExpanded && (
                                <div className="px-6 pb-4 pt-1 text-xs text-gray-500 font-medium leading-relaxed border-t border-gray-50">
                                  {faq.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </main>
                );

              case "profile":
                return (
                  <main className="max-w-md md:max-w-4xl mx-auto w-full px-4 py-8 flex-1 space-y-6 animate-fadeIn">

                    <div className="md:grid md:grid-cols-5 md:gap-8 md:items-start space-y-6 md:space-y-0">

                      {/* Left Column (Col Span 2) */}
                      <div className="md:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm flex items-center gap-4">
                          <div className="relative">
                            <div className="w-16 h-16 bg-[#ECFFED] text-[#2C5E2E] rounded-full overflow-hidden flex items-center justify-center font-black text-2xl border border-[#2C5E2E]/10">
                              {user?.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                user?.name?.charAt(0).toUpperCase() || "C"
                              )}
                            </div>
                            <button
                              onClick={handleAvatarPlusClick}
                              className="absolute -bottom-1.5 -right-1 bg-[#2C5E2E] text-white w-6 h-6 rounded-full flex items-center justify-center shadow border-2 border-white cursor-pointer hover:bg-[#1A3F1C] focus:outline-none"
                            >
                              <span className="text-[10px] font-black">+</span>
                            </button>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h2 className="font-extrabold text-lg text-gray-800 truncate">{user?.name || "buikem Customer"}</h2>
                            <p className="text-xs text-gray-400 font-bold truncate mt-0.5">{user?.email || user?.phone || "No details set"}</p>
                          </div>
                        </div>

                        {/* O-Credit Wallet Box */}
                        <div
                          onClick={() => handleTabChange("wallet")}
                          className="bg-gradient-to-r from-[#ECFFED] to-white rounded-3xl p-5 border border-[#2C5E2E]/15 shadow-sm flex items-center justify-between gap-4 cursor-pointer hover:scale-[1.01] transition-transform"
                        >
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-sm text-[#1A3F1C] flex items-center gap-1.5">
                              <Wallet className="w-4 h-4" /> O-Credit Wallet
                            </h4>
                            <p className="text-[10px] text-gray-400 font-bold">Fund wallet for instant checkout discounts</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-400 block uppercase tracking-wider font-extrabold">Balance</span>
                            <span className="text-base font-black text-[#2C5E2E]">
                              {walletLoading ? (
                                <span className="text-xs text-gray-400">Loading...</span>
                              ) : walletBalance !== null ? (
                                `₦${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              ) : (
                                "₦0.00"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Column (Col Span 3) */}
                      <div className="md:col-span-3 space-y-6">
                        {/* Personal Settings group */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider px-6 pt-5 block">Personal Settings</span>
                          <div className="divide-y divide-gray-50">
                            <button
                              onClick={() => handleTabChange("profile-details")}
                              className="w-full text-left px-6 py-4 hover:bg-[#ECFFED]/25 flex justify-between items-center transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center"><User className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-gray-700">Profile Details</span>
                              </div>
                              <span className="text-gray-300 text-xs">➔</span>
                            </button>

                            <button
                              onClick={() => handleTabChange("earn")}
                              className="w-full text-left px-6 py-4 hover:bg-[#ECFFED]/25 flex justify-between items-center transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-gray-700">Earn with OunjéFood</span>
                              </div>
                              <span className="text-gray-300 text-xs">➔</span>
                            </button>
                          </div>
                        </div>

                        {/* Help & Legal links */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider px-6 pt-5 block">Help & Legal</span>
                          <div className="divide-y divide-gray-50">
                            <button
                              onClick={() => handleTabChange("support")}
                              className="w-full text-left px-6 py-4 hover:bg-[#ECFFED]/25 flex justify-between items-center transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center"><HelpCircle className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-gray-700">FAQs</span>
                              </div>
                              <span className="text-gray-300 text-xs">➔</span>
                            </button>

                            <button
                              onClick={() => handleTabChange("support")}
                              className="w-full text-left px-6 py-4 hover:bg-[#ECFFED]/25 flex justify-between items-center transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center"><MessageSquare className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-gray-700">Get Help</span>
                              </div>
                              <span className="text-gray-300 text-xs">➔</span>
                            </button>

                            <button
                              onClick={() => navigate("/privacyandcompliance")}
                              className="w-full text-left px-6 py-4 hover:bg-[#ECFFED]/25 flex justify-between items-center transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center"><FileText className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-gray-700">Legal & Privacy</span>
                              </div>
                              <span className="text-gray-300 text-xs">➔</span>
                            </button>
                          </div>
                        </div>

                        {/* Actions group */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                          <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider px-6 pt-5 block">Account Actions</span>
                          <div className="divide-y divide-gray-50">
                            <button
                              onClick={() => {
                                logout();
                                navigate("/");
                              }}
                              className="w-full text-left px-6 py-4 hover:bg-red-50/20 flex justify-between items-center transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"><LogOut className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-red-600">Sign Out</span>
                              </div>
                              <span className="text-red-300 text-xs">➔</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm("Are you sure you want to permanently delete your Ounjé account? This action is irreversible and will delete your active order history.")) {
                                  logout();
                                  alert("Your account has been deleted successfully.");
                                  navigate("/");
                                }
                              }}
                              className="w-full text-left px-6 py-4 hover:bg-red-50/20 flex justify-between items-center transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"><Trash2 className="w-4 h-4" /></div>
                                <span className="text-xs font-bold text-red-600">Delete Account</span>
                              </div>
                              <span className="text-red-300 text-xs">➔</span>
                            </button>
                          </div>
                        </div>
                      </div>

                    </div>
                  </main>
                );

              case "wallet":
                return (
                  <main className="max-w-md md:max-w-5xl mx-auto w-full px-4 py-8 flex-1 space-y-6 animate-fadeIn">
                    {/* Header: Back arrow + Title */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleTabChange("profile")}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors shadow-sm cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#2C5E2E]" />
                      </button>
                      <h1 className="text-xl font-extrabold text-[#1A3F1C]">O-Credit Wallet</h1>
                    </div>

                    <div className="md:grid md:grid-cols-12 md:gap-8 md:items-start space-y-6 md:space-y-0">

                      {/* Left Column (Col Span 5) */}
                      <div className="md:col-span-5 space-y-6">
                        {/* Available Balance Card */}
                        <div className="bg-[#ECFFED] border border-[#2C5E2E]/15 rounded-[28px] p-6 shadow-sm flex items-center justify-between gap-4 overflow-hidden relative">
                          <div className="space-y-1 z-10">
                            <span className="text-[10px] text-[#2C5E2E] uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                              <Wallet className="w-3.5 h-3.5" /> Available Balance
                            </span>
                            <h2 className="text-3xl font-black text-[#1A3F1C] tracking-tight">
                              {walletLoading ? (
                                <span className="text-xl text-gray-400">Loading...</span>
                              ) : walletBalance !== null ? (
                                `₦${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              ) : (
                                "₦0.00"
                              )}
                            </h2>
                          </div>
                          <div className="w-20 h-20 shrink-0 z-10 select-none">
                            <img
                              src="/images/wallet_balance_illustration.png"
                              alt="Wallet illustration"
                              className="w-full h-full object-contain rounded-full border border-[#2C5E2E]/10 bg-white/40 p-1"
                            />
                          </div>
                        </div>

                        {/* Bank Account Details Card */}
                        <div className="space-y-2.5">
                          <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Bank Account Details</span>
                          <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-5">
                            {/* Bank Name */}
                            <div>
                              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Bank</span>
                              <div className="flex items-center gap-2.5 mt-1.5">
                                <div className="w-8 h-8 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center border border-[#2C5E2E]/10">
                                  <Landmark className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-black text-gray-800">
                                  {walletBankDetails?.bankName || "Paystack-Titan"}
                                </span>
                              </div>
                            </div>

                            {/* Account Name */}
                            <div className="border-t border-gray-50 pt-4">
                              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Account Name</span>
                              <p className="text-sm font-black text-gray-800 mt-1 uppercase">
                                {walletBankDetails?.accountName || `OUNJEFOOD/USER ${user?.name || "CUSTOMER"}`}
                              </p>
                            </div>

                            {/* Account Number */}
                            <div className="border-t border-gray-50 pt-4 flex items-center justify-between gap-4">
                              <div>
                                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">Account Number</span>
                                {walletBankDetails?.status === "processing" ? (
                                  <p className="text-xs text-amber-600 font-bold mt-1 leading-snug">
                                    {walletBankDetails?.message || "Preparing your bank details..."}
                                  </p>
                                ) : (
                                  <p className="text-base font-black text-[#1A3F1C] tracking-wider mt-1 select-all">
                                    {walletBankDetails?.accountNumber || "9902384729"}
                                  </p>
                                )}
                              </div>
                              {walletBankDetails?.status !== "processing" && (
                                <button
                                  onClick={() => {
                                    const accNum = walletBankDetails?.accountNumber || "9902384729";
                                    navigator.clipboard.writeText(accNum);
                                    setWalletCopied(true);
                                    setTimeout(() => setWalletCopied(false), 2000);
                                  }}
                                  className="flex items-center gap-1.5 bg-[#ECFFED] hover:bg-[#d5ffd7] border border-[#2C5E2E]/20 px-4 py-2.5 rounded-2xl text-xs font-black text-[#2C5E2E] transition-all cursor-pointer shadow-sm select-none"
                                >
                                  {walletCopied ? (
                                    <>
                                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                                      <span>Copied</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* How to top up info box */}
                        <div className="bg-[#EFF6FF] rounded-3xl p-5 border border-blue-100 text-blue-900 flex gap-3.5 items-start">
                          <div className="w-8 h-8 rounded-xl bg-blue-100/60 text-blue-700 flex items-center justify-center shrink-0">
                            <Info className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-extrabold text-xs text-blue-950">How to top up your wallet</h4>
                            <p className="text-[11px] text-blue-800/90 font-medium leading-relaxed">
                              Transfer money from any banking app directly to the Titan Paystack account details displayed above. Your wallet balance will update instantly upon successful transfer.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Column (Col Span 7) */}
                      <div className="md:col-span-7 space-y-3">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Transaction History</span>

                        {/* Search & filters */}
                        <div className="space-y-3">
                          <div className="relative flex items-center">
                            <Search className="absolute left-4 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search transactions..."
                              value={walletSearchQuery}
                              onChange={(e) => setWalletSearchQuery(e.target.value)}
                              className="w-full bg-white border border-gray-150 rounded-2xl py-3 pl-11 pr-4 text-xs font-medium text-gray-700 focus:outline-none focus:border-[#2C5E2E] transition-colors"
                            />
                          </div>

                          {/* Filter pills */}
                          <div className="flex gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                            {["All", "Earnings", "Withdrawals", "Refunds"].map((pill) => {
                              const isSelected = walletFilter === pill.toLowerCase();
                              return (
                                <button
                                  key={pill}
                                  onClick={() => setWalletFilter(pill.toLowerCase())}
                                  className={`px-5 py-2.5 border rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${isSelected
                                    ? "bg-[#ECFFED] text-[#2C5E2E] border-[#2C5E2E]/25 shadow-sm"
                                    : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                  {pill}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* History list card */}
                        <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-sm min-h-48 flex flex-col items-center justify-center text-center">
                          {filteredTransactions.length === 0 ? (
                            <div className="space-y-3">
                              <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto">
                                <Clock className="w-5 h-5" />
                              </div>
                              <p className="text-gray-400 text-xs font-semibold">No transactions found</p>
                            </div>
                          ) : (
                            <div className="w-full divide-y divide-gray-50 text-left">
                              {filteredTransactions.map((tx: any, idx: number) => {
                                const isPositive = tx.type === "credit" || tx.type === "EARNING" || tx.type === "REFUND";
                                const txAmount = tx.amount ?? 0;
                                return (
                                  <div key={tx._id || idx} className="py-3.5 flex justify-between items-center text-xs font-bold border-b border-gray-50 last:border-b-0">
                                    <div className="text-left space-y-0.5">
                                      <p className="text-gray-800 font-bold">{tx.description || tx.narration || "Wallet Top-up"}</p>
                                      <p className="text-[10px] text-gray-400 font-semibold">{new Date(tx.createdAt || tx.date).toLocaleDateString(undefined, { dateStyle: "medium" })}</p>
                                    </div>
                                    <span className={isPositive ? "text-emerald-600 font-extrabold text-sm" : "text-gray-800 font-extrabold text-sm"}>
                                      {isPositive ? "+" : "-"} ₦{txAmount.toLocaleString()}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </main>
                );

              case "earn":
                return (
                  <main className="max-w-md md:max-w-4xl mx-auto w-full px-4 py-8 flex-1 space-y-6 animate-fadeIn">
                    {/* Header: Back arrow + Title */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleTabChange("profile")}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors shadow-sm cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#2C5E2E]" />
                      </button>
                      <h1 className="text-xl font-extrabold text-[#1A3F1C]">Earn with OunjéFood</h1>
                    </div>

                    <div className="md:grid md:grid-cols-12 md:gap-8 md:items-start space-y-6 md:space-y-0">

                      {/* Left Column (Col Span 6) */}
                      <div className="md:col-span-6 space-y-6">
                        {/* Top Promo Section */}
                        <div className="flex flex-col items-center text-center space-y-4 py-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                          <div className="w-16 h-16 bg-[#ECFFED] rounded-full flex items-center justify-center text-[#2C5E2E]">
                            <Gift className="w-8 h-8" />
                          </div>
                          <div className="space-y-1.5">
                            <h2 className="text-xl font-black text-[#1A3F1C] tracking-tight">Invite Friends, Get Paid!</h2>
                            <p className="text-gray-400 text-xs font-bold leading-relaxed max-w-xs mx-auto">
                              Earn ₦200 on every friend's qualifying meal order above ₦2,500 when they use your code.
                            </p>
                          </div>
                        </div>

                        {/* Referral Code Card */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
                          {referralLoading ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Loader2 className="w-8 h-8 text-[#2C5E2E] animate-spin mb-2" />
                              <p className="text-gray-400 text-xs font-semibold">Checking referral status...</p>
                            </div>
                          ) : referralData ? (
                            // Active referral code state
                            <div className="space-y-4 text-center">
                              <div>
                                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Your Active Referral Code</span>
                                <div className="flex items-center justify-center gap-3 mt-3">
                                  <div className="bg-[#ECFFED]/50 border border-dashed border-[#2C5E2E]/30 rounded-2xl px-6 py-3.5 text-center shadow-inner select-all">
                                    <span className="text-2xl font-black text-[#1A3F1C] tracking-wider uppercase">{referralData.code}</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(referralData.code);
                                      setReferralCopied(true);
                                      setTimeout(() => setReferralCopied(false), 2000);
                                    }}
                                    className="w-12 h-12 bg-[#ECFFED] hover:bg-[#d5ffd7] border border-[#2C5E2E]/20 rounded-2xl flex items-center justify-center transition-colors cursor-pointer text-[#2C5E2E] shadow-sm select-none"
                                  >
                                    {referralCopied ? <Check className="w-5 h-5 text-emerald-700" /> : <Copy className="w-5 h-5" />}
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-4 text-left">
                                <div>
                                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Successful Referrals</span>
                                  <span className="text-base font-black text-gray-800">{referralData.successfulReferrals}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-wider block">Total Earnings</span>
                                  <span className="text-base font-black text-[#2C5E2E]">₦{referralData.totalEarnings.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Activate referral code input state
                            <form onSubmit={handleActivateReferralCode} className="space-y-5">
                              <div className="space-y-1">
                                <h3 className="text-sm font-black text-gray-800">Activate Referral Code</h3>
                                <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                                  Enter the personalized referral code you received from our support team to start earning.
                                </p>
                              </div>

                              <div className="relative flex items-center">
                                <Key className="absolute left-4 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="e.g. SOUTH200"
                                  value={referralCodeInput}
                                  onChange={(e) => setReferralCodeInput(e.target.value)}
                                  className="w-full bg-[#ECFFED]/25 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-[#1A3F1C] placeholder-gray-300 focus:outline-none focus:border-[#2C5E2E] transition-colors uppercase"
                                />
                              </div>

                              <div className="space-y-3">
                                <button
                                  type="submit"
                                  disabled={isActivatingCode || !referralCodeInput.trim()}
                                  className="w-full bg-[#8DA18F] hover:bg-[#7a8e7c] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 select-none"
                                >
                                  {isActivatingCode ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      <span>Activating Code...</span>
                                    </>
                                  ) : (
                                    <span>Activate Code</span>
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    window.open(`https://wa.me/2349012345678?text=${encodeURIComponent("Hello Ounje Support, I'd like to request my personalized referral code to start earning.")}`, "_blank");
                                  }}
                                  className="w-full bg-white hover:bg-gray-50 border border-emerald-500 text-emerald-600 font-extrabold py-3 rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 select-none"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  <span>Request a code via WhatsApp</span>
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </div>

                      {/* Right Column (Col Span 6) */}
                      <div className="md:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-5">
                        <h3 className="text-sm font-black text-gray-800">How it works</h3>
                        <div className="space-y-6">
                          {/* Step 1 */}
                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              1
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-gray-800">Activate your code</h4>
                              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                                Enter the code given to you by Ounje support or the IT portal to register your referral profile.
                              </p>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              2
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-gray-800">Share with friends</h4>
                              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                                Send your referral code to your community, family, and friends.
                              </p>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                              3
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-black text-gray-800">Get rewarded</h4>
                              <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                                When they place an order of ₦2,500 or more, you'll receive ₦200 credited straight to your O-Credit wallet!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </main>
                );

              case "profile-details":
                return (
                  <main className="max-w-md md:max-w-2xl mx-auto w-full px-4 py-8 flex-1 space-y-6 animate-fadeIn">
                    {/* Header: Back arrow + Title */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleTabChange("profile")}
                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors shadow-sm cursor-pointer"
                      >
                        <ArrowLeft className="w-5 h-5 text-[#2C5E2E]" />
                      </button>
                      <h1 className="text-xl font-extrabold text-[#1A3F1C]">Profile Details</h1>
                    </div>

                    {/* Profile Details Edit Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm space-y-5">
                      <form onSubmit={handleSaveProfileDetails} className="space-y-5">
                        <div className="space-y-1">
                          <h3 className="text-sm font-black text-gray-800">Edit Personal Information</h3>
                          <p className="text-[11px] text-gray-400 font-semibold leading-relaxed">
                            Keep your contact information and delivery address up to date to ensure accurate deliveries.
                          </p>
                        </div>

                        {/* First & Last Name side-by-side on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">First Name</label>
                            <div className="relative flex items-center">
                              <User className="absolute left-4 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                required
                                placeholder="First Name"
                                value={detailsFirstName}
                                onChange={(e) => setDetailsFirstName(e.target.value)}
                                className="w-full bg-[#ECFFED]/25 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-[#1A3F1C] placeholder-gray-300 focus:outline-none focus:border-[#2C5E2E] transition-colors"
                              />
                            </div>
                          </div>

                          {/* Last Name */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Last Name</label>
                            <div className="relative flex items-center">
                              <User className="absolute left-4 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Last Name"
                                value={detailsLastName}
                                onChange={(e) => setDetailsLastName(e.target.value)}
                                className="w-full bg-[#ECFFED]/25 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-[#1A3F1C] placeholder-gray-300 focus:outline-none focus:border-[#2C5E2E] transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Phone & Email side-by-side on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Phone Number */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Phone Number</label>
                            <div className="relative flex items-center">
                              <Phone className="absolute left-4 w-4 h-4 text-gray-400" />
                              <input
                                type="tel"
                                placeholder="Phone Number"
                                value={detailsPhone}
                                onChange={(e) => setDetailsPhone(e.target.value)}
                                className="w-full bg-[#ECFFED]/25 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-[#1A3F1C] placeholder-gray-300 focus:outline-none focus:border-[#2C5E2E] transition-colors"
                              />
                            </div>
                          </div>

                          {/* Email Address (disabled/read-only) */}
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Email Address</label>
                            <div className="relative flex items-center opacity-70">
                              <Mail className="absolute left-4 w-4 h-4 text-gray-400" />
                              <input
                                type="email"
                                disabled
                                value={detailsEmail}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-4 text-xs font-bold text-gray-400 cursor-not-allowed select-none focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="text-[9px] text-amber-600 font-bold block leading-normal -mt-2">
                          Email cannot be modified directly. Please contact our support team to update your account email.
                        </div>

                        {/* Delivery Address */}
                        <div className="space-y-1.5">
                          <label className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">Delivery Address</label>
                          <div className="relative flex items-center">
                            <MapPin className="absolute left-4 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="e.g. 12 Herbert Macaulay Way, Yaba, Lagos"
                              value={detailsAddress}
                              onChange={(e) => handleDetailsAddressChange(e.target.value)}
                              onFocus={() => { if (detailsSuggestions.length > 0) setShowDetailsDropdown(true); }}
                              onBlur={() => setTimeout(() => setShowDetailsDropdown(false), 200)}
                              className="w-full bg-[#ECFFED]/25 border border-gray-200 rounded-2xl py-3.5 pl-11 pr-12 text-xs font-bold text-[#1A3F1C] placeholder-gray-300 focus:outline-none focus:border-[#2C5E2E] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={handleLocateMeForDetails}
                              disabled={isLocatingDetails}
                              className="absolute right-3.5 w-7 h-7 flex items-center justify-center bg-[#ECFFED] hover:bg-[#d5ffd7] text-[#2C5E2E] rounded-lg transition-colors cursor-pointer"
                              title="Locate me using GPS"
                            >
                              {isLocatingDetails ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Locate className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {showDetailsDropdown && detailsSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-150 rounded-2xl shadow-xl mt-1.5 max-h-48 overflow-y-auto divide-y divide-gray-50">
                                {detailsSuggestions.map((suggestion) => (
                                  <button
                                    key={suggestion}
                                    type="button"
                                    onClick={() => {
                                      setDetailsAddress(suggestion);
                                      setShowDetailsDropdown(false);
                                      setDetailsSuggestions([]);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-[#ECFFED]/25 text-xs font-bold text-gray-700 transition-colors"
                                  >
                                    {suggestion}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions side-by-side on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          <button
                            type="submit"
                            disabled={isSavingDetails}
                            className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-2xl text-xs shadow-sm transition-colors cursor-pointer flex items-center justify-center gap-2 select-none"
                          >
                            {isSavingDetails ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Saving Changes...</span>
                              </>
                            ) : (
                              <span>Save Changes</span>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleTabChange("profile")}
                            className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 font-extrabold py-3 rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 select-none md:order-first"
                          >
                            <span>Cancel</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </main>
                );
            }
          })()
        )}

      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Avatar Source Picker Modal */}
      {isAvatarMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-gray-100 shadow-2xl space-y-4">
            <div className="text-center">
              <h3 className="text-base font-black text-gray-800">Update Profile Photo</h3>
              <p className="text-xs text-gray-400 font-bold mt-1">Choose how you'd like to select your photo</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3.5 pt-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-4 bg-[#ECFFED] hover:bg-[#d5ffd7] border border-[#2C5E2E]/10 rounded-2xl transition-all cursor-pointer text-[#2C5E2E] gap-2 select-none group"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5 text-[#2C5E2E]" />
                </div>
                <span className="text-xs font-extrabold">Upload Photo</span>
              </button>

              <button
                onClick={startCamera}
                className="flex flex-col items-center justify-center p-4 bg-[#ECFFED] hover:bg-[#d5ffd7] border border-[#2C5E2E]/10 rounded-2xl transition-all cursor-pointer text-[#2C5E2E] gap-2 select-none group"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Camera className="w-5 h-5 text-[#2C5E2E]" />
                </div>
                <span className="text-xs font-extrabold">Take Photo</span>
              </button>
            </div>

            <button
              onClick={() => setIsAvatarMenuOpen(false)}
              className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 py-3 rounded-2xl text-xs font-extrabold transition-colors cursor-pointer select-none"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Webcam Capture Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full border border-gray-100 shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-gray-800 flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#2C5E2E]" /> Take Profile Photo
              </h3>
              <button
                onClick={stopCamera}
                className="text-gray-400 hover:text-gray-600 font-black text-sm select-none"
              >
                ✕
              </button>
            </div>

            {/* Video Viewport / Error Fallback */}
            <div className="relative aspect-square bg-gray-950 flex items-center justify-center overflow-hidden">
              {cameraError ? (
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <h4 className="text-white text-xs font-black">Camera Connection Failed</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-semibold max-w-[280px] mx-auto">
                    {cameraError}
                  </p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Circular Face Guide Overlay */}
                  <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none flex items-center justify-center">
                    <div className="w-56 h-56 rounded-full border-2 border-dashed border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.3)] animate-pulse" />
                  </div>
                </>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={stopCamera}
                className="flex-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-500 py-3.5 rounded-2xl text-xs font-extrabold transition-colors cursor-pointer select-none text-center"
              >
                Cancel
              </button>
              
              {!cameraError && (
                <button
                  onClick={capturePhoto}
                  className="flex-1 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white py-3.5 rounded-2xl text-xs font-extrabold shadow-sm transition-colors cursor-pointer select-none text-center"
                >
                  Capture Photo
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}
