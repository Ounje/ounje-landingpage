import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { 
  Store, ShoppingBag, Landmark, ArrowUpRight, TrendingUp, Check, X, AlertCircle, 
  Play, CheckCircle2, ChevronRight, Loader2, LogOut, Coffee, MapPin, Utensils,
  Home, Headphones, User, Plus, Trash2, Camera, Save, ChevronDown, ChevronUp, Bell, RotateCw, MessageCircle, Package
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiClient } from "../utils/apiClient";
import { useAuthStore } from "../hooks/useAuthStore";

// Dynamic Category to Siddee (SubCategory) map derived from backend utils/foodEnums
const CATEGORY_MAP: Record<string, string[]> = {
  pastries: ["pastries", "cake", "bread", "pie", "donut", "muffin"],
  drinks: ["drinks", "juice", "soda", "water", "wine", "beer", "smoothie"],
  swallow: ["swallow", "sauce"],
  trads: ["trads"],
  rice: ["rice", "jollof", "fried", "white", "coconut", "pasta", "sauce"],
  protein: ["protein", "meat", "fish", "chicken", "turkey", "goat", "eggs", "seafood", "sausage", "shrimp", "lobster", "crab", "calamari"],
  soups: ["soups", "stew", "sauce"],
  sides: ["sides", "plantain", "beans", "salad", "vegetables", "fruit", "sauce"],
  others: ["others"]
};

// UI friendly display categories
const DISPLAY_CATEGORIES = [
  { id: "pastries", label: "Pastries" },
  { id: "drinks", label: "Drinks" },
  { id: "swallow", label: "Swallow" },
  { id: "trads", label: "Trads" },
  { id: "rice", label: "Rice Dishes" },
  { id: "protein", label: "Meat & Proteins" },
  { id: "soups", label: "Soups & Stews" },
  { id: "sides", label: "Sides & Desserts" },
  { id: "others", label: "Others" }
];

export default function VendorDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  // Unified Page Tab navigation synchronized with url
  const searchParams = new URLSearchParams(location.search);
  const queryTab = searchParams.get("tab");
  const currentTab = location.pathname === "/vendor/menu" 
    ? "menu" 
    : (queryTab as "home" | "orders" | "support" | "profile") || "home";

  // Global states
  const [orders, setOrders] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [vendorProfile, setVendorProfile] = useState<any>(null);

  // Orders Tab sub-tabs state
  const [ordersActiveSubTab, setOrdersActiveSubTab] = useState<"incoming" | "cooking" | "ready" | "completed">("incoming");

  // Payout request modal states
  const [isPayoutOpen, setIsPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("058"); // GTBank default
  const [accountName, setAccountName] = useState("");
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState("");
  const [payoutError, setPayoutError] = useState("");

  // Menu tab states
  const [menuActiveView, setMenuActiveView] = useState<"list" | "add">("list");
  const [menuActiveTab, setMenuActiveTab] = useState<"items" | "combos">("items");
  const [selectedCategoryPill, setSelectedCategoryPill] = useState("pastries");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);

  // Menu Add Item states
  const [category, setCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [isCompulsory, setIsCompulsory] = useState(false);
  const [minQuantity, setMinQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(10);
  const [quantityLimitsExpanded, setQuantityLimitsExpanded] = useState(false);
  const [itemImageFile, setItemImageFile] = useState<File | null>(null);
  const [itemImagePreview, setItemImagePreview] = useState<string | null>(null);
  const [menuFormLoading, setMenuFormLoading] = useState(false);
  const [menuFormSuccess, setMenuFormSuccess] = useState("");
  const [menuFormError, setMenuFormError] = useState("");

  // Profile tab configuration form states
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileAddress, setProfileAddress] = useState("");
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [takeawayFee, setTakeawayFee] = useState(150);
  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [workingDays, setWorkingDays] = useState<string[]>([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]);

  // Synchronize dynamic profile state on load
  useEffect(() => {
    if (user?.name) setProfileName(user.name);
    if (user?.email) setProfileEmail(user.email);
    if (user?.address) setProfileAddress(user.address);
  }, [user]);

  // Fetch core dashboard data
  const fetchDashboardData = async () => {
    try {
      // 1. Fetch vendor active orders
      const orderRes: any = await apiClient.get("/api/orders/vendor/orders");
      if (orderRes && orderRes.orders) {
        setOrders(orderRes.orders);
      } else if (Array.isArray(orderRes)) {
        setOrders(orderRes);
      }

      // 2. Fetch payout balance
      const balanceRes: any = await apiClient.get("/api/payouts/balance");
      if (balanceRes && balanceRes.balance !== undefined) {
        setBalance(balanceRes.balance);
      } else if (balanceRes && balanceRes.availableBalance !== undefined) {
        setBalance(balanceRes.availableBalance);
      }
      setErrorMsg("");
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setErrorMsg(err.message || "Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch vendor detailed store profile settings
  const fetchVendorProfile = async () => {
    const targetId = user?.profileId || user?.id;
    if (!targetId) return;
    try {
      const res: any = await apiClient.get(`/api/vendors/vendor/${targetId}`);
      if (res) {
        setVendorProfile(res);
        if (res.storeName || res.name) setProfileName(res.storeName || res.name);
        if (res.location?.address) setProfileAddress(res.location.address);
        if (res.fulfillmentSettings?.packagingPrice !== undefined) {
          setTakeawayFee(res.fulfillmentSettings.packagingPrice);
        }
        if (res.timePeriod && res.timePeriod.length > 0) {
          setOpeningTime(res.timePeriod[0].openingHour || "08:00");
          setClosingTime(res.timePeriod[0].closingHour || "22:00");
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  };

  // Fetch menu catalog items & combos
  const fetchCatalogData = async () => {
    try {
      setMenuLoading(true);
      const foodItemsRes: any = await apiClient.get("/api/food-items/vendor/my-items");
      if (foodItemsRes && foodItemsRes.data) {
        setMenuItems(foodItemsRes.data);
      } else {
        setMenuItems([]);
      }

      const combosRes: any = await apiClient.get("/api/combos/vendor/my-combos");
      if (combosRes && combosRes.orders) {
        setCombos(combosRes.orders);
      } else if (combosRes && Array.isArray(combosRes)) {
        setCombos(combosRes);
      } else if (combosRes && combosRes.combos) {
        setCombos(combosRes.combos);
      } else {
        setCombos([]);
      }
    } catch (err) {
      console.error("Catalog fetch error:", err);
    } finally {
      setMenuLoading(false);
    }
  };

  // Initial loads and background intervals
  useEffect(() => {
    fetchDashboardData();
    fetchVendorProfile();
    const interval = setInterval(fetchDashboardData, 12000);
    return () => clearInterval(interval);
  }, []);

  // Fetch catalog only when menu tab becomes active or on startup
  useEffect(() => {
    if (currentTab === "menu" || currentTab === "home") {
      fetchCatalogData();
    }
  }, [currentTab]);

  // Handle URL navigation switch
  const handleTabChange = (tab: string) => {
    setMenuActiveView("list");
    if (tab === "menu") {
      navigate("/vendor/menu");
    } else if (tab === "home") {
      navigate("/vendor/dashboard");
    } else {
      navigate(`/vendor/dashboard?tab=${tab}`);
    }
  };

  // Order status progression handlers
  const handleStatusTransition = async (orderId: string, action: "accept" | "decline" | "preparing" | "ready") => {
    try {
      setLoading(true);
      if (action === "accept") {
        await apiClient.put(`/api/orders/vendor/${orderId}/accept`, {});
      } else if (action === "decline") {
        await apiClient.put(`/api/orders/vendor/${orderId}/decline`, { reason: "Kitchen too busy" });
      } else if (action === "preparing") {
        await apiClient.put(`/api/orders/vendor/${orderId}/preparing`, {});
      } else if (action === "ready") {
        await apiClient.put(`/api/orders/vendor/${orderId}/ready`, {});
      }
      fetchDashboardData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || `Failed to transition order state to ${action}.`);
    } finally {
      setLoading(false);
    }
  };

  // Payout submission handler
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutLoading(true);
    setPayoutSuccess("");
    setPayoutError("");

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

      setPayoutSuccess("Payout request submitted successfully! Funds will arrive within a few hours.");
      setPayoutAmount("");
      setAccountName("");
      setAccountNumber("");
      setTimeout(fetchDashboardData, 2000);
    } catch (err: any) {
      console.error(err);
      setPayoutError(err.message || "Failed to process payout request.");
    } finally {
      setPayoutLoading(false);
    }
  };

  // Logout routine
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Menu photo selector
  const handleMenuImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setItemImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setItemImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset menu forms
  const resetMenuFormFields = (keepCategorySettings = false) => {
    setItemName("");
    setItemPrice("");
    setPreparationTime("");
    setItemDescription("");
    setIsCompulsory(false);
    setMinQuantity(1);
    setMaxQuantity(10);
    setItemImageFile(null);
    setItemImagePreview(null);
    setQuantityLimitsExpanded(false);
    if (!keepCategorySettings) {
      setCategory("");
      setSubCategoryName("");
    }
  };

  // Save menu item
  const handleSaveMenuItem = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    setMenuFormLoading(true);
    setMenuFormSuccess("");
    setMenuFormError("");

    try {
      if (!category) throw new Error("Category is required.");
      if (!subCategoryName) throw new Error("Siddee subcategory is required.");
      if (!itemName.trim()) throw new Error("Item name is required.");
      
      const priceNum = parseFloat(itemPrice);
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new Error("Please enter a valid price greater than ₦0.");
      }

      const existingDoc = menuItems.find(
        (fi) => fi.category?.toLowerCase() === category.toLowerCase()
      );

      const formData = new FormData();
      if (itemImageFile) {
        formData.append("img", itemImageFile);
      } else {
        throw new Error("Item image photo is required.");
      }

      if (existingDoc) {
        formData.append("subCategoryName", subCategoryName.toLowerCase());
        formData.append("itemName", itemName.trim());
        formData.append("price", String(priceNum));
        formData.append("description", itemDescription.trim());
        formData.append("preparationTime", preparationTime.trim());
        formData.append("minQuantity", String(minQuantity));
        formData.append("maxQuantity", String(maxQuantity));
        formData.append("isCompulsory", String(isCompulsory));

        await apiClient.request(`/api/food-items/${existingDoc._id || existingDoc.id}/subcategories`, {
          method: "PATCH",
          bodyData: formData,
          isMultipart: true
        });
      } else {
        formData.append("category", category.toLowerCase());
        formData.append("isCompulsory", String(isCompulsory));
        
        const subCatPayload = [
          {
            name: subCategoryName.toLowerCase(),
            items: [
              {
                name: itemName.trim(),
                price: priceNum,
                description: itemDescription.trim() || undefined,
                preparationTime: preparationTime.trim() || undefined,
                minQuantity: minQuantity,
                maxQuantity: maxQuantity
              }
            ]
          }
        ];
        formData.append("subCategories", JSON.stringify(subCatPayload));
        await apiClient.post("/api/food-items", formData, { isMultipart: true });
      }

      setMenuFormSuccess(`"${itemName}" successfully saved to your menu!`);
      await fetchCatalogData();

      if (addAnother) {
        resetMenuFormFields(true);
      } else {
        resetMenuFormFields(false);
        setMenuActiveView("list");
      }
    } catch (err: any) {
      console.error(err);
      setMenuFormError(err.message || "Failed to save item. Validate fields and try again.");
    } finally {
      setMenuFormLoading(false);
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (foodItemId: string, subCategoryName: string, itemId: string) => {
    if (!confirm("Are you sure you want to remove this item from your menu?")) return;
    try {
      setLoading(true);
      const foodItem = menuItems.find(fi => (fi.id || fi._id) === foodItemId);
      const totalItems = foodItem?.subCategory?.reduce((acc: number, sub: any) => acc + (sub.items?.length || 0), 0) || 0;
      
      if (totalItems <= 1) {
        await apiClient.delete(`/api/food-items/${foodItemId}`);
      } else {
        await apiClient.request(`/api/food-items/${foodItemId}/subcategories`, {
          method: "DELETE",
          bodyData: { subCategoryName, itemId }
        });
      }
      fetchCatalogData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to remove item.");
      setLoading(false);
    }
  };

  // Delete combo
  const handleDeleteCombo = async (comboId: string) => {
    if (!confirm("Are you sure you want to delete this combo?")) return;
    try {
      setLoading(true);
      await apiClient.delete(`/api/combos/${comboId}`);
      fetchCatalogData();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete combo.");
      setLoading(false);
    }
  };

  // Profile configuration upload photo
  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Save immediately to profile
      try {
        const formData = new FormData();
        formData.append("profileImage", file);
        await apiClient.request("/api/vendors/complete-registration", {
          method: "POST",
          bodyData: formData,
          isMultipart: true
        });
        alert("Store logo successfully updated!");
      } catch (err: any) {
        alert(err.message || "Failed to update profile logo.");
      }
    }
  };

  // Profile details update
  const handleUpdateProfileDetails = async () => {
    try {
      const formData = new FormData();
      formData.append("storeName", profileName);
      await apiClient.request("/api/vendors/complete-registration", {
        method: "POST",
        bodyData: formData,
        isMultipart: true
      });
      alert("Business profile details updated!");
      fetchVendorProfile();
    } catch (err: any) {
      alert(err.message || "Failed to update details.");
    }
  };

  // Update opening/closing business hours
  const handleUpdateBusinessHours = async () => {
    try {
      const timePeriod = workingDays.map(day => ({
        day: day.toLowerCase(),
        openingHour: openingTime,
        closingHour: closingTime
      }));
      const formData = new FormData();
      formData.append("timePeriod", JSON.stringify(timePeriod));
      await apiClient.request("/api/vendors/complete-registration", {
        method: "POST",
        bodyData: formData,
        isMultipart: true
      });
      alert("Store operating hours updated successfully!");
      fetchVendorProfile();
    } catch (err: any) {
      alert(err.message || "Failed to update store hours.");
    }
  };

  // Update address location
  const handleUpdateAddress = async () => {
    try {
      await apiClient.put("/api/vendors/profile/location", {
        address: profileAddress,
        coordinates: [3.3792, 6.5244]
      });
      alert("Store physical address updated!");
      fetchVendorProfile();
    } catch (err: any) {
      alert(err.message || "Failed to update address.");
    }
  };

  // Update takeaway fee
  const handleUpdateTakeawayFee = async () => {
    try {
      // Complete settings update
      const formData = new FormData();
      formData.append("fulfillmentSettings", JSON.stringify({ deliveryPrice: 500, packagingPrice: takeawayFee }));
      await apiClient.request("/api/vendors/complete-registration", {
        method: "POST",
        bodyData: formData,
        isMultipart: true
      });
      alert("Takeaway packaging pricing saved!");
      fetchVendorProfile();
    } catch (err: any) {
      alert(err.message || "Failed to save packaging fee.");
    }
  };

  // Play test alert sound
  const playAlert = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-200.wav");
    audio.play().catch(err => console.error("Sound play blocked:", err));
  };

  // Helper selectors
  const getFilteredOrders = () => {
    return orders.filter((o) => {
      const status = o.status?.toLowerCase();
      if (ordersActiveSubTab === "incoming") return status === "confirming";
      if (ordersActiveSubTab === "cooking") return status === "confirmed" || status === "preparing";
      if (ordersActiveSubTab === "ready") return status === "ready" || status === "out_for_delivery";
      if (ordersActiveSubTab === "completed") return status === "delivered" || status === "cancelled";
      return false;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Menu lists flat mapping
  const flatItems: any[] = [];
  menuItems.forEach((foodItem: any) => {
    const parentCategory = foodItem.category || "others";
    foodItem.subCategory?.forEach((subCat: any) => {
      subCat.items?.forEach((item: any) => {
        flatItems.push({
          ...item,
          parentCategory,
          foodItemId: foodItem.id || foodItem._id,
          subCategoryName: subCat.name,
          isCompulsory: foodItem.isCompulsory,
        });
      });
    });
  });

  const filteredDishes = flatItems.filter(
    (item) => item.parentCategory?.toLowerCase() === selectedCategoryPill.toLowerCase()
  );

  return (
    <div className="bg-[#ECFFED] min-h-screen flex font-sans text-gray-800">
      
      {/* 1. DESKTOP SIDEBAR */}
      <div className="hidden md:flex flex-col w-64 bg-[#1A3F1C] text-white border-r border-[#2C5E2E]/20 min-h-screen sticky top-0">
        <div className="p-6 border-b border-[#2C5E2E]/20 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ECFFED] rounded-xl flex items-center justify-center shadow-inner">
            <img
              src="/images/ounje-logo.png"
              alt="Ounje logo"
              className="w-6 h-6 object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">OunjéFood</h2>
            <p className="text-[10px] text-[#ECFFED]/60 font-bold uppercase tracking-wider">Vendor Portal</p>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1.5">
          {[
            { id: "home", label: "Home", icon: Home },
            { id: "menu", label: "Menu", icon: Utensils },
            { id: "orders", label: "Orders", icon: ShoppingBag, badge: orders.filter(o => o.status === "confirming").length },
            { id: "support", label: "Support", icon: Headphones },
            { id: "profile", label: "Profile", icon: User }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                  isActive 
                    ? "bg-[#ECFFED] text-[#1A3F1C] shadow-md shadow-black/10 scale-102" 
                    : "text-[#ECFFED]/80 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    isActive ? "bg-[#1A3F1C] text-white" : "bg-[#ECFFED] text-[#1A3F1C]"
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#2C5E2E]/20 bg-[#122E14]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-[#2C5E2E] rounded-full flex items-center justify-center font-black text-xs text-white">
              {profileName.charAt(0) || user?.name?.charAt(0) || "K"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold truncate">{profileName || user?.name || "Kitchen Owner"}</p>
              <p className="text-[9px] text-[#ECFFED]/60 font-semibold truncate">{user?.phone || "No phone"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#2C5E2E]/20 hover:bg-[#2C5E2E]/40 border border-[#2C5E2E]/40 text-[#ECFFED] py-2.5 rounded-xl text-[10px] font-extrabold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* 2. MOBILE BOTTOM TAB NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-[90] bg-[#1A3F1C] border-t border-[#2C5E2E]/20 py-3.5 px-4 flex justify-around items-center rounded-t-3xl shadow-lg md:hidden">
        {[
          { id: "home", label: "Home", icon: Home },
          { id: "menu", label: "Menu", icon: Utensils },
          { id: "orders", label: "Orders", icon: ShoppingBag, badge: orders.filter(o => o.status === "confirming").length },
          { id: "support", label: "Support", icon: Headphones },
          { id: "profile", label: "Profile", icon: User }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-1.5 transition-all select-none ${
                isActive 
                  ? "bg-[#ECFFED] text-[#1A3F1C] px-4 py-2 rounded-full font-bold text-xs scale-105 shadow" 
                  : "flex flex-col items-center justify-center text-[#ECFFED]/60 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {!isActive && item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#ECFFED] text-[#1A3F1C] text-[8px] font-black px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              {isActive ? (
                <span className="text-xs font-black">{item.label}</span>
              ) : (
                <span className="text-[9px] font-bold mt-0.5">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden pb-24 md:pb-8">
        
        {/* Global status header */}
        <header className="bg-white border-b border-[#2C5E2E]/10 py-4 px-6 flex justify-between items-center shadow-sm sticky top-0 z-[80]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#ECFFED] text-[#2C5E2E] rounded-lg flex items-center justify-center font-bold md:hidden">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-black text-[#1A3F1C] capitalize">
                {currentTab === "home" ? "Overview" : currentTab}
              </h1>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider hidden md:block mt-0.5">
                OunjéFood Kitchen Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 bg-[#ECFFED] text-[#2C5E2E] border border-[#2C5E2E]/15 rounded-full px-3 py-1.5 text-[10px] font-black">
              <MapPin className="w-3.5 h-3.5" />
              <span className="max-w-[150px] truncate">{profileAddress || user?.location || "Lagos, Nigeria"}</span>
            </div>

            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-black transition-all border ${
                isOnline
                  ? "bg-emerald-50 text-emerald-700 border-emerald-250"
                  : "bg-gray-50 text-gray-400 border-gray-250"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
              <span>{isOnline ? "Kitchen Open" : "Kitchen Closed"}</span>
            </button>

            <button className="p-2 hover:bg-gray-50 rounded-full transition-colors relative text-gray-400">
              <Bell className="w-4 h-4" />
              {orders.filter(o => o.status === "confirming").length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
              )}
            </button>
          </div>
        </header>

        {/* Tab pages containers */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
          
          {/* TAB 1: HOME PANEL */}
          {currentTab === "home" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="bg-gradient-to-r from-[#2C5E2E] to-[#1A3F1C] text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative z-10">
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#ECFFED]/80">Good Evening</span>
                  <h2 className="text-xl md:text-2xl font-black mt-1">
                    {profileName || "Buka Kitchen"}
                  </h2>
                  <p className="text-xs text-[#ECFFED]/70 font-semibold mt-1">
                    Buka Owner Dashboard · {profileAddress || "Yaba Zone"}
                  </p>
                </div>
                
                <div className="flex gap-2 relative z-10 w-full sm:w-auto">
                  <button
                    onClick={() => handleTabChange("profile")}
                    className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-2 rounded-xl text-xs font-black text-white text-center transition-all"
                  >
                    Set Store Location
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-[#ECFFED] text-[#2C5E2E] rounded-2xl flex items-center justify-center text-2xl shadow-inner select-none">
                  🎉
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#1A3F1C]">Welcome to OunjéFood!</h3>
                  <p className="text-xs text-gray-400 font-bold mt-0.5">Start listing your signature dishes and accept orders today.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">Quick Actions</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { id: "orders", label: "Orders", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-700" },
                    { id: "wallet", label: "O-Credit", icon: Landmark, color: "bg-amber-50 text-amber-700", action: () => setIsPayoutOpen(true) },
                    { id: "menu", label: "Menu", icon: Utensils, color: "bg-blue-50 text-blue-700" },
                    { id: "support", label: "Support", icon: Headphones, color: "bg-purple-50 text-purple-700" }
                  ].map((act) => {
                    const Icon = act.icon;
                    return (
                      <button
                        key={act.label}
                        onClick={act.action || (() => handleTabChange(act.id))}
                        className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm hover:shadow-md hover:border-[#2C5E2E]/20 transition-all flex flex-col items-center justify-center text-center space-y-3 cursor-pointer group"
                      >
                        <div className={`w-12 h-12 ${act.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-extrabold text-xs text-[#1A3F1C]">{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#2C5E2E]/10 shadow-sm p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">New Orders Feed</h3>
                  <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-black animate-pulse">
                    {orders.filter(o => o.status === "confirming").length} Pending
                  </span>
                </div>
                
                {orders.filter(o => o.status === "confirming").length === 0 ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
                    <ShoppingBag className="w-8 h-8 text-gray-300" />
                    <p className="text-xs font-bold">No new orders yet</p>
                    <p className="text-[10px] text-gray-400">Incoming requests will appear here in real time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.filter(o => o.status === "confirming").map(order => (
                      <div key={order._id} className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white hover:shadow-sm transition-shadow">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs text-[#2C5E2E] bg-[#ECFFED] px-2.5 py-0.5 rounded">
                              Order #{order.orderNumber || order._id.substring(0, 8).toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-gray-700 truncate">
                            {order.items?.map((it: any) => `${it.name} x${it.quantity}`).join(", ")}
                          </p>
                          <p className="text-[10px] text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 shrink-0 text-gray-400" /> {order.deliveryAddress}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-between sm:justify-start">
                          <span className="font-black text-sm text-[#2C5E2E]">₦{(order.totalPrice || 0).toLocaleString()}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusTransition(order._id, "decline")}
                              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-150 transition-colors border border-red-100"
                              title="Decline"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStatusTransition(order._id, "accept")}
                              className="px-4 py-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white text-xs font-black rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" /> Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MENU PANEL */}
          {currentTab === "menu" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Catalog views (left col, hides when add form is active on mobile) */}
                <div className={`${menuActiveView === "list" ? "block" : "hidden"} lg:block lg:col-span-2 space-y-6`}>
                  <div className="flex justify-between items-center bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm">
                    <div>
                      <h3 className="text-base font-extrabold text-[#1A3F1C]">Kitchen Menu</h3>
                      <p className="text-[9px] text-gray-400 font-bold mt-0.5">Manage your catalog items & combos</p>
                    </div>
                    <button
                      onClick={fetchCatalogData}
                      disabled={menuLoading}
                      className="p-2 bg-gray-50 hover:bg-gray-150 rounded-full transition-all text-[#2C5E2E]"
                    >
                      <RotateCw className={`w-4 h-4 ${menuLoading ? "animate-spin" : ""}`} />
                    </button>
                  </div>

                  {/* Items vs Combos tab selector */}
                  <div className="bg-white/80 rounded-2xl p-1.5 border border-[#2C5E2E]/10 shadow-sm flex gap-1">
                    <button
                      onClick={() => setMenuActiveTab("items")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        menuActiveTab === "items"
                          ? "bg-[#2C5E2E] text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Items ({flatItems.length})
                    </button>
                    <button
                      onClick={() => setMenuActiveTab("combos")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        menuActiveTab === "combos"
                          ? "bg-[#2C5E2E] text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Combos ({combos.length})
                    </button>
                  </div>

                  {/* Category Pills (Items tab only) */}
                  {menuActiveTab === "items" && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                      {DISPLAY_CATEGORIES.map((cat) => {
                        const count = flatItems.filter((i) => i.parentCategory?.toLowerCase() === cat.id).length;
                        const isSelected = selectedCategoryPill === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryPill(cat.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 select-none ${
                              isSelected
                                ? "bg-[#2C5E2E] text-white shadow-md shadow-[#2C5E2E]/15"
                                : "bg-white text-gray-500 border border-gray-150 hover:bg-gray-50"
                            }`}
                          >
                            {cat.label} {count > 0 && <span className="opacity-60 text-[10px]">({count})</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Active content grid */}
                  {menuLoading ? (
                    <div className="bg-white rounded-3xl py-16 flex flex-col items-center justify-center border border-[#2C5E2E]/10 shadow-sm">
                      <Loader2 className="w-10 h-10 text-[#2C5E2E] animate-spin mb-3" />
                      <p className="text-gray-400 text-xs font-bold">Loading kitchen catalog...</p>
                    </div>
                  ) : menuActiveTab === "items" ? (
                    filteredDishes.length === 0 ? (
                      <div className="bg-white rounded-3xl p-10 border border-[#2C5E2E]/10 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
                        <Utensils className="w-10 h-10 text-[#2C5E2E]/50" />
                        <h3 className="text-xs font-extrabold text-[#1A3F1C]">
                          No {DISPLAY_CATEGORIES.find((c) => c.id === selectedCategoryPill)?.label} items yet
                        </h3>
                        <p className="text-[10px] text-gray-400">Tap "Add Item" to add a dish in this category.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredDishes.map((item) => (
                          <div 
                            key={item._id} 
                            className="bg-white rounded-3xl p-4 border border-[#2C5E2E]/10 shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#2C5E2E]/20"
                          >
                            <div>
                              <div className="w-full h-36 bg-gray-100 rounded-2xl overflow-hidden shrink-0 relative mb-4">
                                {item.img ? (
                                  <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-103" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Utensils className="w-8 h-8" />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteMenuItem(item.foodItemId, item.subCategoryName, item._id)}
                                  className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm hover:bg-red-50 text-red-500 hover:text-red-650 rounded-xl transition-all shadow-sm z-10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <span className="text-[9px] font-black uppercase text-[#2C5E2E] bg-[#ECFFED] px-2 py-0.5 rounded">
                                    {item.subCategoryName}
                                  </span>
                                  {item.preparationTime && (
                                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                      {item.preparationTime}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-extrabold text-sm text-[#1A3F1C] mt-1.5 truncate">{item.name}</h4>
                                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{item.description || "Fresh local kitchen item."}</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                              <span className="font-black text-sm text-[#2C5E2E]">₦{item.price?.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    combos.length === 0 ? (
                      <div className="bg-white rounded-3xl p-10 border border-[#2C5E2E]/10 shadow-sm text-center flex flex-col items-center justify-center space-y-3">
                        <ShoppingBag className="w-10 h-10 text-[#2C5E2E]/50" />
                        <h3 className="text-xs font-extrabold text-[#1A3F1C]">No combos yet</h3>
                        <p className="text-[10px] text-gray-400">Create special meal bundles to boost kitchen sales.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {combos.map((combo) => (
                          <div 
                            key={combo._id} 
                            className="bg-white rounded-3xl p-4 border border-[#2C5E2E]/10 shadow-sm flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[#2C5E2E]/20"
                          >
                            <div>
                              <div className="w-full h-36 bg-gray-100 rounded-2xl overflow-hidden shrink-0 relative mb-4">
                                {combo.img ? (
                                  <img src={combo.img} alt={combo.comboName} className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-103" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Utensils className="w-8 h-8" />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCombo(combo._id)}
                                  className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm hover:bg-red-50 text-red-500 hover:text-red-650 rounded-xl transition-all shadow-sm z-10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="space-y-1">
                                <h4 className="font-extrabold text-sm text-[#1A3F1C] truncate">{combo.comboName || combo.name}</h4>
                                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed">{combo.description || "Custom combo bundle."}</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-50">
                              <span className="font-black text-sm text-[#2C5E2E]">₦{(combo.basePrice || combo.price || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  )}

                  {/* Add mobile CTA */}
                  <div className="pt-4 lg:hidden">
                    <button
                      onClick={() => {
                        resetMenuFormFields();
                        setMenuActiveView("add");
                      }}
                      className="w-full bg-[#2C5E2E] text-white py-3 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add New Item
                    </button>
                  </div>
                </div>

                {/* Add Item form column */}
                <div className={`${menuActiveView === "add" ? "block" : "hidden"} lg:block lg:col-span-1 space-y-6`}>
                  <div className="flex items-center gap-4 bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm">
                    <button
                      type="button"
                      onClick={() => {
                        resetMenuFormFields();
                        setMenuActiveView("list");
                      }}
                      className="p-2 bg-gray-50 rounded-full hover:bg-gray-150 transition-colors lg:hidden"
                    >
                      <X className="w-4 h-4 text-[#2C5E2E]" />
                    </button>
                    <div>
                      <h3 className="text-base font-extrabold text-[#1A3F1C]">Add Menu Item</h3>
                      <p className="text-[9px] text-gray-400 font-bold">List a dish in your kitchen menu</p>
                    </div>
                  </div>

                  {menuFormSuccess && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {menuFormSuccess}
                    </div>
                  )}

                  {menuFormError && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-800 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" /> {menuFormError}
                    </div>
                  )}

                  <form className="space-y-6">
                    {/* Category Selector */}
                    <div className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm space-y-3">
                      <label className="text-[10px] font-black text-[#1A3F1C] uppercase tracking-wider block">1. Broad Category *</label>
                      <select
                        value={category}
                        onChange={(e) => {
                          setCategory(e.target.value);
                          setSubCategoryName("");
                        }}
                        className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-semibold text-gray-700 shadow-sm focus:outline-none focus:border-[#2C5E2E]"
                      >
                        <option value="">Select category</option>
                        {DISPLAY_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Siddee Selector */}
                    <div className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm space-y-3">
                      <label className="text-[10px] font-black text-[#1A3F1C] uppercase tracking-wider block">2. Siddee Subcategory *</label>
                      <select
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        disabled={!category}
                        className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-semibold text-gray-700 shadow-sm disabled:opacity-50 focus:outline-none focus:border-[#2C5E2E]"
                      >
                        {!category ? (
                          <option value="">Select category first</option>
                        ) : (
                          <>
                            <option value="">Select siddee</option>
                            {CATEGORY_MAP[category]?.map((sc) => (
                              <option key={sc} value={sc}>
                                {sc.charAt(0).toUpperCase() + sc.slice(1)}
                              </option>
                            ))}
                          </>
                        )}
                      </select>
                    </div>

                    {/* Item Details */}
                    <div className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm space-y-4">
                      <label className="text-[10px] font-black text-[#1A3F1C] uppercase tracking-wider block">3. Item Details *</label>

                      {/* Photo Upload Zone */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-[#1A3F1C]">Item Image *</label>
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#2C5E2E]/25 rounded-2xl py-6 px-4 bg-[#ECFFED]/10 cursor-pointer hover:bg-[#ECFFED]/20 transition-all text-center relative overflow-hidden h-36">
                          {itemImagePreview ? (
                            <img src={itemImagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
                              <Camera className="w-5 h-5 text-gray-450" />
                              <span className="text-xs font-bold text-[#1A3F1C]">Upload dish photo</span>
                            </div>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={handleMenuImageChange} />
                        </label>
                      </div>

                      {/* Item Name Input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#1A3F1C]">Item Name *</label>
                        <input
                          type="text"
                          placeholder="Dish name"
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2C5E2E]"
                        />
                      </div>

                      {/* Price Input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#1A3F1C]">Price (₦) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 2000"
                          value={itemPrice}
                          onChange={(e) => setItemPrice(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-bold text-[#2C5E2E] focus:outline-none focus:border-[#2C5E2E]"
                        />
                      </div>

                      {/* Preparation Time Input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#1A3F1C]">Preparation Time (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. 25 mins"
                          value={preparationTime}
                          onChange={(e) => setPreparationTime(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2C5E2E]"
                        />
                      </div>

                      {/* Description Input */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-[#1A3F1C]">Description (optional)</label>
                        <textarea
                          placeholder="Brief description of the item"
                          value={itemDescription}
                          onChange={(e) => setItemDescription(e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 text-xs font-medium focus:outline-none focus:border-[#2C5E2E] resize-none"
                        />
                      </div>

                      {/* Compulsory Toggle Switch */}
                      <div className="flex items-center justify-between py-2 border-t border-gray-50 mt-2">
                        <div>
                          <label className="block text-xs font-bold text-[#1A3F1C]">Compulsory</label>
                          <p className="text-[9px] text-gray-400 font-semibold">Customer must pick from this subcategory</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsCompulsory(!isCompulsory)}
                          className={`w-11 h-6 rounded-full transition-colors relative outline-none shrink-0 ${
                            isCompulsory ? "bg-[#2C5E2E]" : "bg-gray-200"
                          }`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                            isCompulsory ? "translate-x-5" : ""
                          }`} />
                        </button>
                      </div>

                      {/* Quantity Limits Accordion */}
                      <div className="border-t border-gray-150 pt-2">
                        <button
                          type="button"
                          onClick={() => setQuantityLimitsExpanded(!quantityLimitsExpanded)}
                          className="w-full flex justify-between items-center text-xs font-bold text-[#1A3F1C] py-1"
                        >
                          <span>Quantity Limits (optional)</span>
                          {quantityLimitsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {quantityLimitsExpanded && (
                          <div className="grid grid-cols-2 gap-4 mt-2 py-2 border-t border-dashed border-gray-100">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Min qty</label>
                              <input
                                type="number"
                                min={1}
                                value={minQuantity}
                                onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-1 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] text-center font-bold text-gray-700"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold text-gray-400 uppercase">Max qty</label>
                              <input
                                type="number"
                                min={1}
                                value={maxQuantity}
                                onChange={(e) => setMaxQuantity(parseInt(e.target.value) || 10)}
                                className="w-full bg-white border border-gray-200 rounded-xl py-1 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] text-center font-bold text-gray-700"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="bg-white rounded-3xl p-4 border border-[#2C5E2E]/10 shadow-md flex gap-3">
                      <button
                        type="button"
                        onClick={(e) => handleSaveMenuItem(e, true)}
                        disabled={menuFormLoading}
                        className="flex-1 bg-white border border-[#2C5E2E] text-[#2C5E2E] hover:bg-gray-50 py-3 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center gap-1 uppercase"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Another
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleSaveMenuItem(e, false)}
                        disabled={menuFormLoading}
                        className="flex-1 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white py-3 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center gap-1.5 uppercase"
                      >
                        {menuFormLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        Save
                      </button>
                    </div>
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: ORDERS PANEL */}
          {currentTab === "orders" && (
            <div className="space-y-8 animate-in fade-in-50 duration-200">
              
              {/* Stats & payout headers block */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-[#2C5E2E] to-[#1A3F1C] text-white rounded-3xl p-6 shadow-md border border-[#2C5E2E]/10 flex flex-col justify-between h-44">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Available Balance</span>
                    <Landmark className="w-5 h-5 text-[#FFC727]" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">₦{balance.toLocaleString()}</h2>
                    <p className="text-[10px] text-white/60 font-semibold mt-1">Earnings updated in real time</p>
                  </div>
                  <button
                    onClick={() => setIsPayoutOpen(true)}
                    className="w-full bg-[#FFC727] hover:bg-[#ffda55] text-[#1A3F1C] font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors mt-2"
                  >
                    Request Withdrawal <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm flex flex-col justify-between h-44">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cooking Queue</span>
                    <Coffee className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-[#1A3F1C]">
                      {orders.filter((o) => o.status === "confirmed" || o.status === "preparing").length}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Meals currently on fire</p>
                  </div>
                  <button
                    onClick={() => setOrdersActiveSubTab("cooking")}
                    className="text-xs font-extrabold text-[#2C5E2E] hover:text-white bg-[#ECFFED] hover:bg-[#2C5E2E] border border-[#2C5E2E]/10 hover:border-transparent px-3.5 py-2 rounded-xl flex items-center justify-center gap-1 mt-2 self-start transition-all shadow-sm"
                  >
                    Manage Cook Queue <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#2C5E2E]/10 shadow-sm flex flex-col justify-between h-44">
                  <div className="flex justify-between items-start">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Completed Today</span>
                    <TrendingUp className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-extrabold text-[#1A3F1C]">
                      {orders.filter((o) => o.status === "delivered").length}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">Delivered successfully today</p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md font-bold self-start mt-2 border border-emerald-100">
                    100% Fulfillment Rate
                  </span>
                </div>
              </div>

              {/* Order Status workspace */}
              <div className="bg-white rounded-3xl border border-[#2C5E2E]/10 shadow-sm overflow-hidden">
                <div className="flex border-b border-gray-100 bg-gray-50/50 p-2 gap-1 overflow-x-auto scrollbar-none">
                  {[
                    { id: "incoming", label: "New Requests", count: orders.filter((o) => o.status === "confirming").length },
                    { id: "cooking", label: "Active Cooking", count: orders.filter((o) => o.status === "confirmed" || o.status === "preparing").length },
                    { id: "ready", label: "Ready / Enroute", count: orders.filter((o) => o.status === "ready" || o.status === "out_for_delivery").length },
                    { id: "completed", label: "History Log", count: orders.filter((o) => o.status === "delivered" || o.status === "cancelled").length },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setOrdersActiveSubTab(tab.id as any)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                        ordersActiveSubTab === tab.id
                          ? "bg-[#2C5E2E] text-white shadow-md shadow-[#2C5E2E]/15 scale-102"
                          : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/60"
                      }`}
                    >
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${ordersActiveSubTab === tab.id ? "bg-white text-[#2C5E2E]" : "bg-gray-200 text-gray-600"}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-6 md:p-8 min-h-64">
                  {filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                      <ShoppingBag className="w-10 h-10 mb-3 text-gray-300" />
                      <p className="text-sm font-semibold">No orders found in this status.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {filteredOrders.map((order) => (
                        <div key={order._id} className="border border-gray-100 rounded-3xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center border-b border-gray-50 pb-3 mb-3">
                              <span className="font-extrabold text-xs text-[#2C5E2E] bg-[#ECFFED] px-2.5 py-1 rounded-md">
                                Order #{order.orderNumber || order._id.substring(0, 8).toUpperCase()}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold">
                                {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            <div className="space-y-1.5 mb-4">
                              {order.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between text-xs">
                                  <span className="text-gray-600">
                                    {item.name} <span className="font-bold text-gray-400">×{item.quantity}</span>
                                  </span>
                                  <span className="font-bold text-gray-700">₦{(item.price * item.quantity).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>

                            <p className="text-xs text-gray-400 flex items-start gap-1.5 mb-4 leading-relaxed">
                              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" />
                              {order.deliveryAddress}
                            </p>
                          </div>

                          <div className="border-t border-gray-50 pt-4 mt-2">
                            <div className="flex justify-between items-center gap-3">
                              <span className="font-black text-sm text-[#2C5E2E]">₦{(order.totalPrice || 0).toLocaleString()}</span>
                              
                              {ordersActiveSubTab === "incoming" && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleStatusTransition(order._id, "decline")}
                                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-650 flex items-center justify-center transition-colors border border-red-105"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusTransition(order._id, "accept")}
                                    className="px-4 py-1.5 rounded-lg bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white text-xs font-bold transition-all flex items-center gap-1"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Accept
                                  </button>
                                </div>
                              )}

                              {ordersActiveSubTab === "cooking" && (
                                <div className="flex gap-2">
                                  {order.status === "confirmed" ? (
                                    <button
                                      onClick={() => handleStatusTransition(order._id, "preparing")}
                                      className="px-4 py-1.5 rounded-lg bg-[#FFC727] hover:bg-[#ffda55] text-[#1A3F1C] text-xs font-bold transition-all flex items-center gap-1"
                                    >
                                      <Play className="w-3.5 h-3.5" /> Start Cooking
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleStatusTransition(order._id, "ready")}
                                      className="px-4 py-1.5 rounded-lg bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white text-xs font-bold transition-all flex items-center gap-1"
                                    >
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready
                                    </button>
                                  )}
                                </div>
                              )}

                              {ordersActiveSubTab === "ready" && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-md font-bold uppercase tracking-wider animate-pulse">
                                  {order.status === "ready" ? "Awaiting Rider Pick" : "En Route with Rider"}
                                </span>
                              )}

                              {ordersActiveSubTab === "completed" && (
                                <span className={`text-[10px] px-3 py-1 rounded-md font-bold uppercase tracking-wider border ${
                                  order.status === "delivered"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                  {order.status}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SUPPORT PANEL */}
          {currentTab === "support" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="bg-gradient-to-r from-[#2C5E2E] to-[#1A3F1C] text-[#ECFFED] rounded-3xl p-6 shadow-md flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-black">We're here to help</h2>
                  <p className="text-xs text-[#ECFFED]/80 mt-1 leading-relaxed">
                    Merchant support is available 24/7. Find solutions to common problems or chat directly with our account agents.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-[#2C5E2E]/10 shadow-sm overflow-hidden divide-y divide-gray-100">
                {[
                  {
                    title: "Can't Update My Menu",
                    desc: "Trouble adding dishes, uploading photos, or customizing quantities.",
                    content: "Ensure all mandatory input fields (*Broad Category, Subcategory Siddee, Name, Price, Image*) are supplied and your uploads are under 5MB. If you are adding a swallow Main dish, put it in the 'swallow' category so it links to customer custom plate builders."
                  },
                  {
                    title: "Rider Hasn't Delivered",
                    desc: "Meal ready for pickup but no courier matches are found.",
                    content: "Once you mark an order as 'Ready for Pickup', courier alerts are broadcasted. If a matching rider delays, our operations desk automatically attempts re-dispatching. You can check order tracking or initiate support chat."
                  },
                  {
                    title: "Reactivate My Account",
                    desc: "Buka store deactivated due to cancellation guidelines.",
                    content: "Ounjé merchant guidelines require kitchens to maintain a high fulfillment rate. Suspended vendors can request checkup reviews. Ensure all bank details, menus, and operating hours are properly configured first."
                  }
                ].map((item) => (
                  <SupportAccordionItem key={item.title} title={item.title} desc={item.desc} content={item.content} />
                ))}

                <div className="p-5 flex items-center justify-between bg-emerald-50/20 hover:bg-[#ECFFED]/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#ECFFED] text-[#2C5E2E] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#1A3F1C]">Talk to an Agent</h4>
                      <p className="text-[11px] text-gray-400 font-semibold mt-0.5">Contact live customer care support immediately</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const url = `https://wa.me/2348123358739?text=Hello%20Ounje%2520Support%2C%20I%20am%20a%20registered%20merchant%20and%20need%20assistance.`;
                      window.open(url, "_blank");
                    }}
                    className="px-4 py-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white text-xs font-black rounded-xl transition-all shadow-sm"
                  >
                    Open Chat
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE PANEL */}
          {currentTab === "profile" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              
              {/* Summary Profile Header */}
              <div className="bg-white rounded-3xl border border-[#2C5E2E]/10 shadow-sm p-6 flex flex-col items-center text-center space-y-4">
                <div className="relative group cursor-pointer w-24 h-24 rounded-full border-2 border-dashed border-[#2C5E2E]/30 flex items-center justify-center bg-gray-50 overflow-hidden shadow-inner">
                  {profilePreview || vendorProfile?.profileImage ? (
                    <img
                      src={profilePreview || vendorProfile?.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <Camera className="w-6 h-6 text-gray-400" />
                      <span className="text-[9px] font-bold mt-1 text-[#1A3F1C] uppercase tracking-wide">ADD PHOTO</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/45 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Plus className="w-5 h-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfileImageChange}
                    />
                  </label>
                </div>

                <div>
                  <h3 className="text-lg font-black text-[#1A3F1C]">
                    {profileName || "Buka Kitchen"}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mt-0.5">
                    # OUN-VND-{vendorProfile?.id?.substring(19, 24).toUpperCase() || user?.id?.substring(19, 24).toUpperCase() || "0014"}
                  </p>
                </div>

                {/* Micro stats table */}
                <div className="grid grid-cols-3 gap-6 w-full max-w-sm border-t border-b border-gray-50 py-4 mt-2">
                  <div className="text-center">
                    <span className="block text-lg font-black text-[#1A3F1C]">
                      {orders.filter(o => o.status === "delivered").length}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Orders</span>
                  </div>
                  <div className="text-center">
                    <span className={`block text-xs font-black uppercase px-2 py-0.5 rounded-full mt-1 ${
                      isOnline ? "bg-emerald-50 text-emerald-700" : "bg-gray-155 text-gray-500"
                    }`}>
                      {isOnline ? "Active" : "Closed"}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide block mt-1">Status</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-lg font-black text-[#1A3F1C]">
                      {vendorProfile?.averageRating && vendorProfile?.averageRating > 0 ? vendorProfile.averageRating.toFixed(1) : "—"}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Rating</span>
                  </div>
                </div>
              </div>

              {/* Collapsible settings list */}
              <div className="bg-white rounded-3xl border border-[#2C5E2E]/10 shadow-sm divide-y divide-gray-100 overflow-hidden">
                
                {/* Profile contact settings */}
                <ProfileConfigItem title="Profile Details" icon={User}>
                  <div className="space-y-4 pt-2 pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Kitchen / Store Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-medium"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Contact Email</label>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-medium"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleUpdateProfileDetails}
                      className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
                    >
                      Save Details
                    </button>
                  </div>
                </ProfileConfigItem>

                {/* Business operating schedule settings */}
                <ProfileConfigItem title="Business Hours" icon={Coffee}>
                  <div className="space-y-4 pt-2 pb-2">
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                      Configure your operating opening & closing time thresholds.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Opening Hour</label>
                        <input
                          type="time"
                          value={openingTime}
                          onChange={(e) => setOpeningTime(e.target.value)}
                          className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-bold text-gray-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Closing Hour</label>
                        <input
                          type="time"
                          value={closingTime}
                          onChange={(e) => setClosingTime(e.target.value)}
                          className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-bold text-gray-700"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleUpdateBusinessHours}
                      className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
                    >
                      Update Operating Hours
                    </button>
                  </div>
                </ProfileConfigItem>

                {/* Geolocation/Address location */}
                <ProfileConfigItem title="Store Address" icon={MapPin}>
                  <div className="space-y-4 pt-2 pb-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Physical Address</label>
                      <input
                        type="text"
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-medium"
                      />
                    </div>
                    <button
                      onClick={handleUpdateAddress}
                      className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
                    >
                      Save Location Address
                    </button>
                  </div>
                </ProfileConfigItem>

                {/* Takeaway Packaging Markup markup */}
                <ProfileConfigItem title="Takeaway Packaging" icon={Package}>
                  <div className="space-y-4 pt-2 pb-2">
                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                      Set the default markup packaging fee added to order plates.
                    </p>
                    <div className="space-y-1 w-full max-w-[200px]">
                      <label className="text-[9px] font-black text-gray-400 uppercase">Packaging Cost (₦)</label>
                      <input
                        type="number"
                        value={takeawayFee}
                        onChange={(e) => setTakeawayFee(parseInt(e.target.value) || 0)}
                        className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-[#2C5E2E] font-extrabold text-[#2C5E2E]"
                      />
                    </div>
                    <button
                      onClick={handleUpdateTakeawayFee}
                      className="bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm"
                    >
                      Save Takeaway Pricing
                    </button>
                  </div>
                </ProfileConfigItem>

                {/* Sound notification tests */}
                <div className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <span className="text-xs font-bold text-[#1A3F1C]">Test Alert Tone</span>
                  </div>
                  <button
                    onClick={playAlert}
                    className="px-4 py-2 bg-emerald-50 text-[#2C5E2E] hover:bg-[#2C5E2E] hover:text-white text-xs font-black rounded-xl border border-[#2C5E2E]/20 transition-all"
                  >
                    Play Tone
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* 4. WITHDRAWAL REQUEST PAYOUT MODAL */}
      {isPayoutOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm shadow-md" onClick={() => setIsPayoutOpen(false)} />
          
          <div className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 z-10 space-y-6">
            <button
              onClick={() => {
                setIsPayoutOpen(false);
                setPayoutSuccess("");
                setPayoutError("");
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="text-center">
              <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Landmark className="w-6 h-6 text-[#2C5E2E]" />
              </div>
              <h3 className="text-xl font-extrabold text-[#1A3F1C]">Request Withdrawal</h3>
              <p className="text-gray-400 text-xs mt-1">Withdraw earnings straight to your bank account.</p>
            </div>

            {payoutSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-emerald-800 text-xs font-semibold leading-relaxed">
                {payoutSuccess}
              </div>
            )}

            {payoutError && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-red-850 text-xs font-semibold leading-relaxed">
                {payoutError}
              </div>
            )}

            {!payoutSuccess && (
              <form onSubmit={handleRequestPayout} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Withdrawal Amount</label>
                  <input
                    id="payout-amount-input"
                    type="number"
                    required
                    placeholder="e.g. 5000"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-[#ECFFED]/10 border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] text-[#1A3F1C] font-extrabold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A3F1C] uppercase tracking-wider mb-2">Select Bank</label>
                  <select
                    id="payout-bank-select"
                    value={bankCode}
                    onChange={(e) => setBankCode(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl py-3.5 px-4 text-sm focus:outline-none focus:border-[#2C5E2E] font-semibold text-gray-700 shadow-sm"
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
                    placeholder="Name as it appears on bank account"
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

// Sidebar config collapsible items
function ProfileConfigItem({ title, icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const Icon = icon;
  return (
    <div className="p-5 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-400" />
          <span className="text-xs font-bold text-[#1A3F1C]">{title}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-4 pl-8 border-l border-[#2C5E2E]/10 animate-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  );
}

// Support Accordion collapsible items
function SupportAccordionItem({ title, desc, content }: { title: string; desc: string; content: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-5 transition-colors hover:bg-gray-50/20">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between text-left focus:outline-none"
      >
        <div className="space-y-0.5">
          <h4 className="text-sm font-extrabold text-[#1A3F1C]">{title}</h4>
          <p className="text-xs text-gray-400 font-semibold">{desc}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 text-xs text-gray-655 bg-gray-50 rounded-2xl p-4 leading-relaxed border border-gray-100 animate-in slide-in-from-top-1 duration-150">
          {content}
        </div>
      )}
    </div>
  );
}
