import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Search, Star, Clock, Utensils, ArrowLeft, Locate, Loader2, ChefHat, Flame, Sparkles, SlidersHorizontal } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { loadGoogleMapsScript } from "../utils/googleMapsLoader";
import { apiClient } from "../utils/apiClient";
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

export default function CustomerBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialLocation = searchParams.get("location") || "";
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [customerCoords, setCustomerCoords] = useState<[number, number] | null>(null);

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

  useEffect(() => {
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

        if (loc && window.google?.maps?.Geocoder) {
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
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
        {/* Back Link & Title */}
        <div className="flex items-center gap-3 mb-6 mt-12">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-white rounded-full hover:bg-gray-50 border border-gray-100 transition-colors shadow-sm"
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

            {/* Suggestions Dropdown */}
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

              {/* Search Suggestions Dropdown */}
              {showSuggestionsDropdown && searchSuggestions.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowSuggestionsDropdown(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((item, idx) => {
                      const text = typeof item === "string" ? item : item.name || item.text || item.title || "";
                      const typeLabel = typeof item === "object" && item.type ? item.type : "";

                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSearchQuery(text);
                            setActiveSearchQuery(text);
                            setShowSuggestionsDropdown(false);
                          }}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[#ECFFED] text-gray-700 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-[#2C5E2E] shrink-0" />
                            <span>{text}</span>
                          </div>
                          {typeLabel && (
                            <span className="text-[10px] bg-[#ECFFED] text-[#2C5E2E] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold scale-90 shrink-0">
                              {typeLabel}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </form>

            <div className="relative flex items-stretch">
              <button
                type="button"
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl border transition-all cursor-pointer font-bold text-sm select-none shrink-0 ${searchFilter !== "all"
                  ? "bg-[#2C5E2E] border-[#2C5E2E] text-white shadow-md shadow-[#2C5E2E]/20"
                  : "bg-white border-gray-200 text-[#1A3F1C]/75 hover:bg-gray-50"
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

              {/* Dropdown Menu */}
              {showFilterDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setShowFilterDropdown(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 overflow-hidden">
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
                        <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-none">
                          {f.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills (only in default browse mode) */}
        {searchFilter === "all" && (
          <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {["All", "Rice", "Swallow", "Pasta", "Protein", "Breakfast", "Smallchops"].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (cat === "All") {
                    setSearchQuery("");
                    setActiveSearchQuery("");
                  } else {
                    setSearchQuery(cat);
                    setActiveSearchQuery(cat);
                  }
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${(cat === "All" && (selectedCategory === "All" || activeSearchQuery === "")) ||
                  (cat !== "All" && activeSearchQuery.toLowerCase() === cat.toLowerCase())
                  ? "bg-[#2C5E2E] text-white shadow-md shadow-[#2C5E2E]/20"
                  : "bg-white text-[#1A3F1C]/75 border border-gray-200/80 hover:bg-gray-50"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Results Container */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#2C5E2E]/10">
            <Loader2 className="w-10 h-10 text-[#2C5E2E] animate-spin mb-4" />
            <p className="text-gray-500 font-semibold text-sm">Searching for local bukás nearby...</p>
          </div>
        ) : (activeSearchQuery.trim() === "" && searchFilter === "all") ? (
          /* Default Browse Mode: Vendors List */
          filteredVendors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => {
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
                    onClick={() => navigate(`/customer/vendor/${vendorId}`)}
                    className={`bg-white rounded-3xl overflow-hidden border border-[#2C5E2E]/10 hover:shadow-lg transition-all duration-300 group cursor-pointer ${!isOpen ? "opacity-75" : ""}`}
                  >
                    {/* Image & Overlay */}
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={storeName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1 shadow-md border border-gray-100">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-gray-800">{rating.toFixed(1)}</span>
                        <span className="text-[10px] text-gray-400">({reviews})</span>
                      </div>
                      {!isOpen && (
                        <div className="absolute top-4 left-4 bg-red-600/95 backdrop-blur-sm text-white rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                          Closed
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <span className="text-xs font-bold text-[#2C5E2E] uppercase tracking-wider bg-[#ECFFED] px-3 py-1 rounded-full">
                        {services}
                      </span>
                      <h3 className="text-lg font-bold text-[#1A3F1C] mt-3 mb-1 group-hover:text-[#2C5E2E] transition-colors">
                        {storeName}
                      </h3>
                      {!isOpen && (
                        <p className="text-[11px] text-red-600 font-bold mb-2.5 flex items-center gap-1 leading-snug">
                          <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{closedReason}</span>
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="truncate">{address}</span>
                      </div>

                      {/* Delivery & Time Stats */}
                      <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Clock className="w-4 h-4 text-[#FFC727]" />
                          <span className="font-medium">{deliveryTimeStr}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Utensils className="w-4 h-4 text-[#2C5E2E]" />
                          <span className="font-bold text-[#1A3F1C]">{deliveryFeeStr} delivery</span>
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
          /* Search Results Mode */
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
                {/* Vendors results section */}
                {hasVendors && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-[#2C5E2E]" /> Matching Bukás & Restaurants
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.vendors.map((vendor) => {
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
                            onClick={() => navigate(`/customer/vendor/${vendorId}`)}
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
                                <span className="text-xs font-bold text-gray-800">{rating.toFixed(1)}</span>
                                <span className="text-[10px] text-gray-400">({reviews})</span>
                              </div>
                              {!isOpen && (
                                <div className="absolute top-4 left-4 bg-red-600/95 backdrop-blur-sm text-white rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-md">
                                  Closed
                                </div>
                              )}
                            </div>
                            <div className="p-6">
                              <span className="text-xs font-bold text-[#2C5E2E] uppercase tracking-wider bg-[#ECFFED] px-3 py-1 rounded-full">
                                {services}
                              </span>
                              <h3 className="text-lg font-bold text-[#1A3F1C] mt-3 mb-1 group-hover:text-[#2C5E2E] transition-colors">
                                {storeName}
                              </h3>
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate">{address}</span>
                              </div>
                              <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                  <Clock className="w-4 h-4 text-[#FFC727]" />
                                  <span className="font-medium">{deliveryTimeStr}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                  <Utensils className="w-4 h-4 text-[#2C5E2E]" />
                                  <span className="font-bold text-[#1A3F1C]">{deliveryFeeStr} delivery</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Food items results section */}
                {hasFood && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-[#2C5E2E]" /> Dishes & Delicacies
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {searchResults.fooditems.map((food: any) => {
                        const vendorId = food.vendor?.id || food.vendor;
                        return (
                          <div
                            key={food.id}
                            onClick={() => navigate(`/customer/vendor/${vendorId}`)}
                            className="bg-white rounded-3xl p-5 border border-[#2C5E2E]/10 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 group"
                          >
                            {food.image && (
                              <img
                                src={food.image}
                                alt={food.name}
                                className="w-24 h-24 rounded-2xl object-cover shrink-0"
                              />
                            )}
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <h4 className="font-extrabold text-[#1A3F1C] text-base mb-1 group-hover:text-[#2C5E2E] transition-colors truncate">{food.name}</h4>
                                <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed mb-2">{food.description || "Delectable authentic local dish."}</p>
                                {food.vendor && (
                                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold bg-[#ECFFED]/50 border border-[#2C5E2E]/10 rounded-lg px-2.5 py-1 w-max">
                                    <span className="w-1.5 h-1.5 bg-[#2C5E2E] rounded-full" />
                                    <span>From {food.vendor.name || "Buka Kitchen"}</span>
                                  </div>
                                )}
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

                {/* Combos results section */}
                {hasCombos && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                      <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" /> Special Value Combos
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {searchResults.combos.map((combo: any) => {
                        const vendorId = combo.vendor?.id || combo.vendor;
                        return (
                          <div
                            key={combo.id}
                            onClick={() => navigate(`/customer/vendor/${vendorId}`)}
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

                {/* Plates results section */}
                {hasPlates && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-extrabold text-[#1A3F1C] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500" /> Custom Plates
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {searchResults.plates.map((plate: any) => {
                        const vendorId = plate.vendor?.id || plate.vendor;
                        return (
                          <div
                            key={plate.id}
                            onClick={() => navigate(`/customer/vendor/${vendorId}`)}
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
      </main>

      <Footer />
    </div>
  );
}
