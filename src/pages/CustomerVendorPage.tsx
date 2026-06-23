import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Star, Clock, Utensils, Plus, Minus, ShoppingBag, Loader2, X, PlusCircle, Check, Sparkles, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { apiClient } from "../utils/apiClient";
import { useCartStore } from "../hooks/useCartStore";
import { useAuthStore } from "../hooks/useAuthStore";
import { loadGoogleMapsScript } from "../utils/googleMapsLoader";
import { checkVendorStatus } from "../utils/vendorStatus";

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

export default function CustomerVendorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getCartTotal());

  const { isAuthenticated, user } = useAuthStore();

  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [customerCoords, setCustomerCoords] = useState<[number, number] | null>(null);
  const [googleReady, setGoogleReady] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setGoogleReady(true))
      .catch(() => setGoogleReady(false));
  }, []);

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

  useEffect(() => {
    const resolveCoords = async () => {
      const loc = searchParams.get("location");
      let lat: number | undefined = undefined;
      let lng: number | undefined = undefined;

      const { address: profileAddress, coords: profileCoords } = getProfileLocationData();

      if (loc && loc === profileAddress && profileCoords) {
        lng = profileCoords[0];
        lat = profileCoords[1];
      } else if (loc && (googleReady || window.google?.maps?.Geocoder)) {
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
          console.error("Geocoding failed in CustomerVendorPage", e);
        }
      } else if (!loc && profileCoords) {
        lng = profileCoords[0];
        lat = profileCoords[1];
      }

      if (lat !== undefined && lng !== undefined) {
        setCustomerCoords([lng, lat]);
      } else {
        setCustomerCoords(null);
      }
    };

    resolveCoords();
  }, [searchParams, googleReady, isAuthenticated, user]);

  const { isOpen, reason: closedReason } = vendor
    ? checkVendorStatus(vendor)
    : { isOpen: true, reason: "" };

  // Normal Item Dialog
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  // Build a Plate Customizer Dialog (Swallows)
  const [customizerSwallow, setCustomizerSwallow] = useState<any>(null);
  const [selectedSoups, setSelectedSoups] = useState<any[]>([]);
  const [selectedProteins, setSelectedProteins] = useState<any[]>([]);

  // Combo Customizer Modal
  const [customizerCombo, setCustomizerCombo] = useState<any>(null);
  const [selectedComboSelections, setSelectedComboSelections] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (!id) return;
      setLoading(true);
      setError("");

      try {
        const response: any = await apiClient.get(`/api/vendors/vendor/${id}`);
        setVendor(response);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load vendor menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorDetails();
  }, [id]);

  useEffect(() => {
    if (vendor) {
      const name = vendor.storeName || vendor.name || "Buka Kitchen";
      document.title = `Ounjé | Order from ${name}`;
    }
  }, [vendor]);

  if (loading) {
    return (
      <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24">
          <Loader2 className="w-12 h-12 text-[#2C5E2E] animate-spin mb-4" />
          <p className="text-gray-500 font-semibold">Loading menu...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-md mx-auto flex flex-col items-center justify-center py-24 text-center px-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Vendor</h3>
          <p className="text-gray-500 text-sm mb-6">{error || "Vendor profile not found."}</p>
          <button
            onClick={() => navigate("/customer/browse")}
            className="bg-[#2C5E2E] text-white font-bold px-6 py-2.5 rounded-xl text-sm"
          >
            Back to Browse
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const storeName = vendor.storeName || vendor.name || "Buka Kitchen";
  const image = vendor.profileImage || vendor.bannerUrl || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80";
  const rating = vendor.averageRating || vendor.rating || 0;
  const reviews = vendor.ratingCount || 0;
  const address = vendor.location?.address || "Lagos, Nigeria";
  
  const calculatedFee = estimateFee(vendor.location?.coordinates, customerCoords);
  const deliveryFeeStr = calculatedFee !== undefined 
    ? `₦${calculatedFee.toLocaleString()}` 
    : (vendor.fulfillmentSettings?.deliveryPrice ? `₦${vendor.fulfillmentSettings.deliveryPrice}` : "₦500");
  const prepMin = vendor.fulfillmentSettings?.preparationTimeMin;
  const deliveryTimeStr = vendor.estimatedDeliveryTime
    ? (typeof vendor.estimatedDeliveryTime === "number" ? `${vendor.estimatedDeliveryTime} min` : vendor.estimatedDeliveryTime)
    : estimateDeliveryTime(vendor.location?.coordinates, customerCoords, prepMin);

  const estimatedDeliveryTime = customerCoords ? deliveryTimeStr : "Set location";
  const deliveryPrice = customerCoords ? deliveryFeeStr : "Set location";

  // Flatmap the nested subcategory items to a single flat list of dishes
  const flatDishes: any[] = [];
  vendor.foodItems?.forEach((foodItem: any) => {
    const parentCategory = foodItem.category || "others";
    foodItem.subCategory?.forEach((subCat: any) => {
      subCat.items?.forEach((item: any) => {
        flatDishes.push({
          ...item,
          parentCategory,
          foodItemId: foodItem._id,
          subCategoryName: subCat.name,
          isCompulsory: foodItem.isCompulsory,
        });
      });
    });
  });

  const getCategoryLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "swallow": return "Swallows";
      case "soups": return "Soups & Stews";
      case "protein": return "Meat & Proteins";
      case "rice": return "Rice Dishes";
      case "sides": return "Sides & Desserts";
      case "drinks": return "Drinks & Beverages";
      case "pastries": return "Pastries";
      case "trads": return "Traditional";
      default: return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  };

  // Group food items by category
  const categoriesMap: Record<string, any[]> = { All: [...flatDishes] };
  flatDishes.forEach((dish) => {
    const label = getCategoryLabel(dish.parentCategory);
    if (!categoriesMap[label]) {
      categoriesMap[label] = [];
    }
    categoriesMap[label].push(dish);
  });

  // Include Combos if available in vendor profile response
  if (vendor.combos && vendor.combos.length > 0) {
    categoriesMap["Combos"] = vendor.combos.map((combo: any) => ({
      ...combo,
      isCombo: true,
      _id: combo._id,
      name: combo.comboName,
      price: combo.basePrice,
      img: combo.img,
      description: combo.description || "Special package meal combo.",
    }));
    categoriesMap["All"] = [...categoriesMap["All"], ...categoriesMap["Combos"]];
  }

  const categoriesList = Object.keys(categoriesMap);

  // Separate soups/stews and proteins for "Build a Plate" customizer lookup (using flat list)
  const stewsList = flatDishes.filter((i: any) => i.parentCategory?.toLowerCase() === "soups");
  const proteinsList = flatDishes.filter((i: any) => i.parentCategory?.toLowerCase() === "protein");

  const handleItemClick = (item: any) => {
    if (!isOpen) {
      alert(`This restaurant is currently closed. ${closedReason}`);
      return;
    }
    if (item.isCombo) {
      if (item.selections && item.selections.length > 0) {
        // Open Combo Customizer Modal
        setCustomizerCombo(item);
        setSelectedComboSelections({});
      } else {
        // Simple combo without selections
        setSelectedItem(item);
        setQuantity(1);
      }
    } else if (item.parentCategory?.toLowerCase() === "swallow") {
      setCustomizerSwallow(item);
      setSelectedSoups([]);
      setSelectedProteins([]);
    } else {
      setSelectedItem(item);
      setQuantity(1);
    }
  };

  const handleAddNormalItem = () => {
    if (!selectedItem) return;
    addItem(vendor.id || vendor._id, storeName, {
      id: selectedItem._id,
      name: selectedItem.name,
      price: selectedItem.price,
      options: [],
      itemType: selectedItem.isCombo ? "Combo" : "FoodItem",
      comboSelections: selectedItem.isCombo ? [] : undefined
    });
    // Apply quantity multiplier manually since addItem adds 1 item per call
    for (let i = 1; i < quantity; i++) {
      addItem(vendor.id || vendor._id, storeName, {
        id: selectedItem._id,
        name: selectedItem.name,
        price: selectedItem.price,
        options: [],
        itemType: selectedItem.isCombo ? "Combo" : "FoodItem",
        comboSelections: selectedItem.isCombo ? [] : undefined
      });
    }
    setSelectedItem(null);
  };

  const handleAddCustomPlate = () => {
    if (!customizerSwallow) return;
    
    const swallowPrice = customizerSwallow.price;
    const soupsPrice = selectedSoups.reduce((acc, curr) => acc + curr.price, 0);
    const proteinsPrice = selectedProteins.reduce((acc, curr) => acc + curr.price, 0);
    const totalPrice = swallowPrice + soupsPrice + proteinsPrice;

    const selectedOptionsNames = [
      ...selectedSoups.map(s => s.name),
      ...selectedProteins.map(p => p.name)
    ];

    const compositeId = `${customizerSwallow._id}-${selectedSoups.map(s => s._id).join("-")}-${selectedProteins.map(p => p._id).join("-")}`;
    const itemIds = [
      customizerSwallow._id,
      ...selectedSoups.map(s => s._id),
      ...selectedProteins.map(p => p._id)
    ];

    addItem(vendor.id || vendor._id, storeName, {
      id: compositeId,
      name: `Plate: ${customizerSwallow.name} Combo`,
      price: totalPrice,
      options: selectedOptionsNames,
      itemIds: itemIds,
      itemType: "Plate",
    });

    setCustomizerSwallow(null);
  };

  const handleAddComboToCart = () => {
    if (!customizerCombo) return;

    // Calculate price additions
    let extraPrice = 0;
    const selectionNames: string[] = [];
    const flatSelections: any[] = [];

    customizerCombo.selections?.forEach((group: any) => {
      const selectedItems = selectedComboSelections[group.key] || [];
      selectedItems.forEach((subItem: any) => {
        extraPrice += subItem.price || 0;
        selectionNames.push(subItem.name);
        flatSelections.push({
          itemId: subItem.item || subItem._id,
          name: subItem.name,
          price: subItem.price || 0,
          quantity: 1,
        });
      });
    });

    const finalComboPrice = customizerCombo.price + extraPrice;
    const selectionIdsString = flatSelections.map(s => s.itemId).join("-");
    const cartItemId = selectionIdsString ? `${customizerCombo._id}-${selectionIdsString}` : customizerCombo._id;

    addItem(vendor.id || vendor._id, storeName, {
      id: cartItemId,
      name: customizerCombo.name,
      price: finalComboPrice,
      options: selectionNames,
      itemType: "Combo",
      comboSelections: flatSelections,
    });

    setCustomizerCombo(null);
  };

  const toggleSelectSoup = (soup: any) => {
    if (selectedSoups.some(s => s._id === soup._id)) {
      setSelectedSoups(selectedSoups.filter(s => s._id !== soup._id));
    } else if (selectedSoups.length < 2) {
      setSelectedSoups([...selectedSoups, soup]);
    }
  };

  const toggleSelectProtein = (protein: any) => {
    if (selectedProteins.some(p => p._id === protein._id)) {
      setSelectedProteins(selectedProteins.filter(p => p._id !== protein._id));
    } else if (selectedProteins.length < 3) {
      setSelectedProteins([...selectedProteins, protein]);
    }
  };

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
      <Header />

      {/* Cover Image & Store Details */}
      <div className="relative h-[340px] md:h-80 w-full overflow-hidden">
        <img src={image} alt={storeName} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        
        <div className="absolute inset-x-0 bottom-6 top-0 pt-20 md:pt-0 max-w-7xl mx-auto px-4 md:px-8 text-white flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <button
              onClick={() => navigate("/customer/browse")}
              className="inline-flex items-center gap-1.5 text-xs bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md rounded-full px-3.5 py-1.5 font-bold uppercase transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Browse
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold">{storeName}</h1>
            <p className="text-sm text-gray-200">{address}</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl text-center shadow-md">
              <div className="flex items-center gap-1 text-amber-400 justify-center">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-extrabold text-sm text-white">{rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-gray-300">({reviews} Reviews)</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl text-center shadow-md">
              <Clock className="w-4 h-4 text-[#FFC727] mx-auto mb-0.5" />
              <span className="font-extrabold text-xs text-white block">{estimatedDeliveryTime}</span>
              <span className="text-[10px] text-gray-300">Delivery Time</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl text-center shadow-md">
              <Utensils className="w-4 h-4 text-emerald-400 mx-auto mb-0.5" />
              <span className="font-extrabold text-xs text-white block">{deliveryPrice}</span>
              <span className="text-[10px] text-gray-300">Delivery Cost</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {!isOpen && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-3xl p-5 mb-8 flex items-start gap-4 shadow-sm">
            <Clock className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-base text-red-900">Ordering is Currently Closed</h4>
              <p className="text-sm text-red-700 mt-1 font-semibold">{closedReason}</p>
              <p className="text-xs text-red-500 mt-1 font-medium">You can browse the menu, but placing orders is disabled at this time.</p>
            </div>
          </div>
        )}

        {/* Curated Buka Combo Specials */}
        {vendor.combos && vendor.combos.length > 0 && (
          <div className="mb-10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                  <Flame className="w-5.5 h-5.5 text-amber-500 fill-amber-500 animate-pulse" />
                  Buka Combo Specials
                </h2>
                <p className="text-gray-400 text-xs font-semibold mt-0.5">Curated meal deals packed with sides, mains, and drinks</p>
              </div>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emerald-600/20 scrollbar-track-transparent">
              {vendor.combos.map((combo: any) => {
                const formattedCombo = {
                  ...combo,
                  isCombo: true,
                  _id: combo._id,
                  name: combo.comboName,
                  price: combo.basePrice,
                  img: combo.img,
                  description: combo.description || "Special package meal combo.",
                };

                return (
                  <div
                    key={combo._id}
                    onClick={() => handleItemClick(formattedCombo)}
                    className="min-w-[280px] md:min-w-[340px] max-w-[340px] bg-gradient-to-br from-[#ECFFED]/60 via-white to-white border border-[#2C5E2E]/15 rounded-3xl p-5 hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col justify-between shrink-0"
                  >
                    <div className="space-y-4">
                      {/* Image container */}
                      <div className="h-40 relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                        <img
                          src={combo.img || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"}
                          alt={combo.comboName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-[#2C5E2E] text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Value Combo
                        </div>
                        {combo.time && (
                          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                            <Clock className="w-3 h-3 text-[#FFC727]" />
                            {combo.time}
                          </div>
                        )}
                      </div>

                      {/* Header info */}
                      <div className="space-y-1.5">
                        <h3 className="font-extrabold text-base text-[#1A3F1C] group-hover:text-[#2C5E2E] transition-colors leading-snug line-clamp-1">
                          {combo.comboName}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2 min-h-[2.25rem] leading-relaxed">
                          {combo.description || "Fully customized curated special combo meal."}
                        </p>
                      </div>
                    </div>

                    {/* Pricing footer */}
                    <div className="border-t border-gray-100/80 pt-4 mt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 leading-none">Starting from</span>
                        <span className="font-extrabold text-[#2C5E2E] text-lg mt-0.5">₦{combo.basePrice?.toLocaleString()}</span>
                      </div>
                      
                      <button
                        disabled={!isOpen}
                        className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md ${
                          isOpen
                            ? "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white group-hover:scale-105"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {isOpen ? "Customize" : "Closed"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Filter List */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-8 border-b border-[#2C5E2E]/10 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-[#2C5E2E] text-white shadow-md shadow-[#2C5E2E]/20"
                  : "bg-white text-[#1A3F1C]/75 border border-gray-200/80 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="space-y-12">
          {categoriesList
            .filter((cat) => selectedCategory === "All" || cat === selectedCategory)
            .map((cat) => {
              const catItems = categoriesMap[cat];
              if (!catItems || catItems.length === 0) return null;

              return (
                <div key={cat} className="space-y-4">
                  <h3 className="text-xl font-extrabold text-[#1A3F1C] border-l-4 border-[#2C5E2E] pl-3">
                    {cat}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {catItems.map((item) => {
                      const isCombo = item.isCombo === true;

                      if (isCombo) {
                        return (
                          <div
                            key={item._id}
                            onClick={() => handleItemClick(item)}
                            className="bg-gradient-to-br from-amber-50/45 via-white to-emerald-50/20 rounded-3xl p-5 border border-amber-200/80 shadow-sm hover:shadow-md transition-all hover:border-[#2C5E2E]/30 cursor-pointer flex gap-4 relative overflow-hidden group col-span-1"
                          >
                            <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-white text-[8px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-bl-2xl shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Meal Deal
                            </div>

                            {item.img && (
                              <img
                                src={item.img}
                                alt={item.name}
                                className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-amber-100"
                              />
                            )}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <h4 className="font-extrabold text-[#1A3F1C] text-base mb-1 truncate pr-8 group-hover:text-[#2C5E2E] transition-colors">{item.name}</h4>
                                <p className="text-gray-400 text-xs line-clamp-2 pr-2 leading-relaxed">{item.description || "Curated local value combo package."}</p>
                                <span className="text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md mt-2 inline-block">
                                  Includes customizable options
                                </span>
                              </div>
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-dashed border-gray-100">
                                <div className="flex flex-col">
                                  <span className="text-[8px] font-black uppercase tracking-wider text-gray-400 leading-none">Starting from</span>
                                  <span className="font-extrabold text-[#2C5E2E] text-base mt-0.5">₦{item.price.toLocaleString()}</span>
                                </div>
                                <button
                                  disabled={!isOpen}
                                  className={`px-3.5 py-2 rounded-xl text-[10px] font-extrabold transition-colors shadow-sm ${
                                    isOpen
                                      ? "bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  }`}
                                >
                                  {isOpen ? "Customize" : "Closed"}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item._id}
                          onClick={() => handleItemClick(item)}
                          className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-4"
                        >
                          {item.img && (
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-24 h-24 rounded-2xl object-cover shrink-0"
                            />
                          )}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h4 className="font-extrabold text-[#1A3F1C] text-base mb-1">{item.name}</h4>
                              <p className="text-gray-400 text-xs line-clamp-2">{item.description || "Freshly cooked local specialty."}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="font-extrabold text-[#2C5E2E] text-base">₦{item.price.toLocaleString()}</span>
                              <button
                                disabled={!isOpen}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  isOpen
                                    ? "bg-[#ECFFED] text-[#2C5E2E] hover:bg-[#2C5E2E] hover:text-white"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* Floating Cart Button (At bottom when items are in cart) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-50">
          <button
            onClick={() => navigate("/customer/checkout")}
            className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white rounded-2xl py-4 px-6 shadow-xl flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <span className="font-extrabold text-sm block leading-none">{cartItems.length} items in cart</span>
                <span className="text-[10px] text-gray-200">From {useCartStore.getState().vendorName}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-extrabold">
              <span>View Cart</span>
              <span className="px-2.5 py-1 bg-white/20 rounded-lg text-xs">₦{cartTotal.toLocaleString()}</span>
            </div>
          </button>
        </div>
      )}

      {/* Normal Item Dialog */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-gray-100 z-10 text-center"
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>

              {selectedItem.img && (
                <img
                  src={selectedItem.img}
                  alt={selectedItem.name}
                  className="w-full h-40 object-cover rounded-2xl mb-4"
                />
              )}
              <h3 className="text-xl font-extrabold text-[#1A3F1C]">{selectedItem.name}</h3>
              <p className="text-xs text-gray-400 mt-1.5 px-4">{selectedItem.description}</p>
              <div className="text-2xl font-extrabold text-[#2C5E2E] mt-3">
                ₦{selectedItem.price.toLocaleString()}
              </div>

              {/* Quantity Adjuster */}
              <div className="flex items-center justify-center gap-4 my-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-extrabold text-base text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddNormalItem}
                className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors"
              >
                Add to Cart (₦{(selectedItem.price * quantity).toLocaleString()})
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Build a Plate Customizer Dialog */}
      <AnimatePresence>
        {customizerSwallow && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizerSwallow(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-100 z-10 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button
                onClick={() => setCustomizerSwallow(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C5E2E] bg-[#ECFFED] px-3 py-1 rounded-full">
                  Build a Plate customizer
                </span>
                <h3 className="text-xl font-extrabold text-[#1A3F1C] mt-2">
                  Assemble {customizerSwallow.name} Plate
                </h3>
                <p className="text-gray-400 text-xs mt-1">Select your soups/stews and proteins to build your custom swallow combo.</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-5 px-1 pr-2">
                {/* Section 1: Stews & Soups */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-[#1A3F1C]">Select Soups/Stews (Max 2)</h4>
                    <span className="text-[10px] bg-[#2C5E2E]/10 text-[#2C5E2E] px-2 py-0.5 rounded-md font-bold">
                      {selectedSoups.length}/2 Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {stewsList.map((soup: any) => {
                      const isSelected = selectedSoups.some(s => s._id === soup._id);
                      return (
                        <button
                          key={soup._id}
                          onClick={() => toggleSelectSoup(soup)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? "border-[#2C5E2E] bg-[#ECFFED]/30 shadow-sm"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-gray-800 block truncate">{soup.name}</span>
                            <span className="text-[10px] text-[#2C5E2E] font-bold">₦{soup.price}</span>
                          </div>
                          {isSelected ? (
                            <Check className="w-4 h-4 text-[#2C5E2E]" />
                          ) : (
                            <PlusCircle className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section 2: Proteins */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-sm text-[#1A3F1C]">Select Proteins (Max 3)</h4>
                    <span className="text-[10px] bg-[#2C5E2E]/10 text-[#2C5E2E] px-2 py-0.5 rounded-md font-bold">
                      {selectedProteins.length}/3 Selected
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {proteinsList.map((protein: any) => {
                      const isSelected = selectedProteins.some(p => p._id === protein._id);
                      return (
                        <button
                          key={protein._id}
                          onClick={() => toggleSelectProtein(protein)}
                          className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                            isSelected
                              ? "border-[#2C5E2E] bg-[#ECFFED]/30 shadow-sm"
                              : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div>
                            <span className="text-xs font-bold text-gray-800 block truncate">{protein.name}</span>
                            <span className="text-[10px] text-[#2C5E2E] font-bold">₦{protein.price}</span>
                          </div>
                          {isSelected ? (
                            <Check className="w-4 h-4 text-[#2C5E2E]" />
                          ) : (
                            <PlusCircle className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Total Calculation & Action */}
              <div className="border-t border-gray-100 pt-4 mt-4 bg-white">
                <div className="flex justify-between items-center mb-4 text-sm font-semibold">
                  <span className="text-gray-500">Selected Combo Price:</span>
                  <span className="text-[#2C5E2E] font-extrabold text-base">
                    ₦{(
                      customizerSwallow.price +
                      selectedSoups.reduce((a, b) => a + b.price, 0) +
                      selectedProteins.reduce((a, b) => a + b.price, 0)
                    ).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleAddCustomPlate}
                  className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors"
                >
                  Add Custom Plate to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Combo Customizer Modal */}
      <AnimatePresence>
        {customizerCombo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCustomizerCombo(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-gray-100 z-10 flex flex-col max-h-[85vh] overflow-hidden"
            >
              <button
                onClick={() => setCustomizerCombo(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 z-10"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2C5E2E] bg-[#ECFFED] px-3 py-1 rounded-full">
                  Combo customizer
                </span>
                <h3 className="text-xl font-extrabold text-[#1A3F1C] mt-2">
                  Customize {customizerCombo.comboName}
                </h3>
                <p className="text-gray-400 text-xs mt-1">{customizerCombo.description || "Pick your choices to customize this combo package."}</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 px-1 pr-2">
                {customizerCombo.selections?.map((group: any) => {
                  const selectedItems = selectedComboSelections[group.key] || [];
                  const maxSel = group.maxSelection || 1;
                  
                  const handleToggleSelectionItem = (subItem: any) => {
                    const exists = selectedItems.some((x: any) => x._id === subItem._id || x.item === subItem.item);
                    let newSelections = [];
                    if (exists) {
                      newSelections = selectedItems.filter((x: any) => x._id !== subItem._id && x.item !== subItem.item);
                    } else {
                      if (maxSel === 1) {
                        newSelections = [subItem];
                      } else if (selectedItems.length < maxSel) {
                        newSelections = [...selectedItems, subItem];
                      } else {
                        newSelections = [...selectedItems.slice(1), subItem];
                      }
                    }
                    setSelectedComboSelections({
                      ...selectedComboSelections,
                      [group.key]: newSelections
                    });
                  };

                  return (
                    <div key={group.key} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-sm text-[#1A3F1C]">
                          {group.label} {group.required && <span className="text-red-500">*</span>}
                        </h4>
                        <span className="text-[10px] bg-[#2C5E2E]/10 text-[#2C5E2E] px-2 py-0.5 rounded-md font-bold">
                          {selectedItems.length}/{maxSel} Selected
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {group.items?.map((subItem: any) => {
                          const isSelected = selectedItems.some((x: any) => x._id === subItem._id || x.item === subItem.item);
                          return (
                            <button
                              key={subItem._id || subItem.item}
                              onClick={() => handleToggleSelectionItem(subItem)}
                              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                                isSelected
                                  ? "border-[#2C5E2E] bg-[#ECFFED]/30 shadow-sm"
                                  : "border-gray-100 hover:border-gray-200"
                              }`}
                            >
                              <div className="flex-1 min-w-0 pr-2">
                                <span className="text-xs font-bold text-gray-800 block truncate">{subItem.name}</span>
                                {subItem.price > 0 ? (
                                  <span className="text-[10px] text-[#2C5E2E] font-bold">+₦{subItem.price}</span>
                                ) : (
                                  <span className="text-[10px] text-gray-400 font-medium">Free</span>
                                )}
                              </div>
                              {isSelected ? (
                                <Check className="w-4 h-4 text-[#2C5E2E] shrink-0" />
                              ) : (
                                <PlusCircle className="w-4 h-4 text-gray-300 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Total Calculation & Action */}
              <div className="border-t border-gray-100 pt-4 mt-4 bg-white">
                <div className="flex justify-between items-center mb-4 text-sm font-semibold">
                  <span className="text-gray-500">Total Price:</span>
                  <span className="text-[#2C5E2E] font-extrabold text-base">
                    ₦{(
                      customizerCombo.price +
                      Object.values(selectedComboSelections).flatMap(arr => arr).reduce((acc, curr) => acc + (curr.price || 0), 0)
                    ).toLocaleString()}
                  </span>
                </div>
                
                {(() => {
                  const missingRequired = customizerCombo.selections?.some((group: any) => {
                    return group.required && (!selectedComboSelections[group.key] || selectedComboSelections[group.key].length === 0);
                  });

                  return (
                    <button
                      onClick={handleAddComboToCart}
                      disabled={missingRequired}
                      className="w-full bg-[#2C5E2E] hover:bg-[#1A3F1C] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl shadow-md transition-colors"
                    >
                      {missingRequired ? "Complete required selections" : "Add Combo to Cart"}
                    </button>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
