import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Search, Star, Clock, Utensils, ArrowLeft, Locate } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { loadGoogleMapsScript } from "../utils/googleMapsLoader";

const MOCK_VENDORS = [
  {
    id: "mama-buka",
    name: "Mama Buka",
    speciality: "Swallows & Soups",
    rating: 4.8,
    reviews: 124,
    time: "15-25 min",
    deliveryFee: "₦500",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
    location: "Yaba, Lagos",
    dishes: ["Amala & Ewedu", "Pounded Yam & Egusi", "Moi Moi"]
  },
  {
    id: "chef-emeka",
    name: "Chef Emeka's Kitchen",
    speciality: "Gourmet Rice & Grills",
    rating: 4.9,
    reviews: 98,
    time: "20-30 min",
    deliveryFee: "₦700",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    location: "Ikeja, Lagos",
    dishes: ["Jollof Rice", "Grilled Chicken", "Fried Plantain"]
  },
  {
    id: "spicy-corner",
    name: "Spicy Corner",
    speciality: "Local Pepper Stews",
    rating: 4.6,
    reviews: 84,
    time: "10-20 min",
    deliveryFee: "₦400",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
    location: "Berger, Lagos",
    dishes: ["Ofada Stew", "Suya", "Pepper Soup"]
  },
  {
    id: "iya-basira",
    name: "Iya Basira Cookhouse",
    speciality: "Traditional Buka Stews",
    rating: 4.7,
    reviews: 142,
    time: "25-35 min",
    deliveryFee: "₦600",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    location: "Surulere, Lagos",
    dishes: ["Eba & Okro", "Amala", "Grilled Fish"]
  }
];

export default function CustomerBrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialLocation = searchParams.get("location") || "";
  const [locationInput, setLocationInput] = useState(initialLocation);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [filteredVendors, setFilteredVendors] = useState(MOCK_VENDORS);
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

  useEffect(() => {
    let result = MOCK_VENDORS;

    // Filter by location query parameter
    const loc = searchParams.get("location");
    if (loc) {
      const cityPart = loc.split(",")[0].trim().toLowerCase();
      result = result.filter(v => v.location.toLowerCase().includes(cityPart));
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.dishes.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter(v => v.speciality.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    setFilteredVendors(result);
  }, [searchParams, searchQuery, selectedCategory]);

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
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-[#2C5E2E]" />
            <input
              type="text"
              placeholder="Search dishes, bukás or grills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#ECFFED]/30 border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-[#1A3F1C] focus:outline-none focus:border-[#2C5E2E] transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {["All", "Swallows", "Rice", "Grills", "Stews"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0 ${(cat === "All" && selectedCategory === "All") ||
                  (cat !== "All" && selectedCategory.toLowerCase().includes(cat.toLowerCase()))
                  ? "bg-[#2C5E2E] text-white shadow-md shadow-[#2C5E2E]/20"
                  : "bg-white text-[#1A3F1C]/75 border border-gray-200/80 hover:bg-gray-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Vendor Grid */}
        {filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => navigate(`/customer/vendor/${vendor.id}`)}
                className="bg-white rounded-3xl overflow-hidden border border-[#2C5E2E]/10 hover:shadow-lg transition-all duration-300 group cursor-pointer"
              >
                {/* Image & Overlay */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <img
                    src={vendor.image}
                    alt={vendor.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl px-2.5 py-1.5 flex items-center gap-1 shadow-md border border-gray-100">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-gray-800">{vendor.rating}</span>
                    <span className="text-[10px] text-gray-400">({vendor.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-xs font-bold text-[#2C5E2E] uppercase tracking-wider bg-[#ECFFED] px-3 py-1 rounded-full">
                    {vendor.speciality}
                  </span>
                  <h3 className="text-lg font-bold text-[#1A3F1C] mt-3 mb-1 group-hover:text-[#2C5E2E] transition-colors">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{vendor.location}</span>
                  </div>

                  {/* Delivery & Time Stats */}
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Clock className="w-4 h-4 text-[#FFC727]" />
                      <span className="font-medium">{vendor.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Utensils className="w-4 h-4 text-[#2C5E2E]" />
                      <span className="font-bold text-[#1A3F1C]">{vendor.deliveryFee} delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        )}
      </main>

      <Footer />
    </div>
  );
}
