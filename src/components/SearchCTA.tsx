import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Locate } from "lucide-react";
import { useAuthStore } from "../hooks/useAuthStore";
import { loadGoogleMapsScript } from "../utils/googleMapsLoader";

const ALL_LOCATIONS = [
  "Yaba, Lagos, Nigeria",
  "Ikeja, Lagos, Nigeria",
  "Berger, Lagos, Nigeria",
  "Surulere, Lagos, Nigeria",
  "Lekki, Lagos, Nigeria",
  "Victoria Island, Lagos, Nigeria",
  "Gbagada, Lagos, Nigeria",
  "Maryland, Lagos, Nigeria",
  "Alausa, Lagos, Nigeria",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
};

interface SearchCTAProps {
  className?: string;
}

export default function SearchCTA({ className = "" }: SearchCTAProps) {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getDashboardLink = () => {
    if (role === "vendor") return "/vendor/dashboard";
    if (role === "rider") return "/rider/dashboard";
    return "/customer/browse";
  };

  const [locationQuery, setLocationQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [googleReady, setGoogleReady] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
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

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocationQuery(value);

    if (value.trim().length > 0) {
      if (autocompleteService) {
        autocompleteService.getPlacePredictions(
          {
            input: value,
            componentRestrictions: { country: "ng" }, // Restrict to Nigeria
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
        const filtered = ALL_LOCATIONS.filter((loc) =>
          loc.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(filtered);
        setShowDropdown(true);
      }
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
                setLocationQuery(results[0].formatted_address);
              } else {
                setLocationQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
              }
            }
          );
        } else {
          setIsLocating(false);
          setLocationQuery(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
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

  const selectSuggestion = (val: string) => {
    setLocationQuery(val);
    setShowDropdown(false);
  };

  const handleOrderNow = () => {
    const targetLocation = locationQuery.trim() || "Lagos, Nigeria";
    navigate(`/customer/browse?location=${encodeURIComponent(targetLocation)}`);
  };

  const renderSearchBar = () => (
    <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/75 backdrop-blur-md border border-[#2C5E2E]/15 rounded-3xl p-2.5 shadow-xl w-full">
      {/* Input Wrapper */}
      <div className="relative flex-1 flex items-center min-h-[50px]">
        <MapPin className="absolute left-4 w-5 h-5 text-[#2C5E2E]" />
        <input
          type="text"
          placeholder="Enter delivery area (e.g. Yaba, Ikeja...)"
          value={locationQuery}
          onChange={handleInputChange}
          onFocus={() => {
            if (locationQuery.trim().length > 0) setShowDropdown(true);
          }}
          className="w-full pl-11 pr-24 bg-transparent border-0 text-[#1A3F1C] font-semibold text-base placeholder-gray-400 focus:outline-none"
        />
        <div className="absolute right-3 flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocating}
            title="Locate me using GPS"
            className="p-1.5 rounded-lg text-[#2C5E2E] hover:bg-[#ECFFED] hover:text-[#1A3F1C] transition-colors disabled:opacity-55 cursor-pointer"
          >
            <Locate className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
          </button>
          {locationQuery && (
            <button
              type="button"
              onClick={() => {
                setLocationQuery("");
                setSuggestions([]);
                setShowDropdown(false);
              }}
              className="p-1 rounded-md text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Order Online Button */}
      <button
        onClick={handleOrderNow}
        className="flex items-center justify-center gap-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold px-8 py-3.5 sm:py-0 rounded-2xl transition-colors text-base shadow-md shrink-0 cursor-pointer animate-pulse-subtle"
      >
        <Search className="w-5 h-5" />
        Order Online
      </button>

      {/* Place suggestions Autocomplete Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-100 text-left">
          <div className="px-4 py-2 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
            Suggested Locations
          </div>
          {suggestions.map((loc) => (
            <button
              key={loc}
              onClick={() => selectSuggestion(loc)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#ECFFED] text-gray-700 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0 cursor-pointer text-left"
            >
              <MapPin className="w-4 h-4 text-[#FFC727] shrink-0" />
              <span>{loc}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      variants={fadeUp}
      ref={dropdownRef}
      className={`w-full max-w-xl mx-auto flex flex-col gap-4 relative z-20 px-4 ${className}`}
    >
      {isAuthenticated ? (
        <>
          {/* Mobile Dashboard Button: visible only on mobile screens */}
          <button
            onClick={() => navigate(getDashboardLink())}
            className="md:hidden w-full flex items-center justify-center gap-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold py-4 px-6 rounded-3xl transition-all text-base shadow-lg dashboard-pulsing-btn cursor-pointer"
          >
            <span>Go to Dashboard</span>
          </button>

          {/* Desktop Search Bar: hidden on mobile, visible on desktop */}
          <div className="hidden md:block w-full">
            {renderSearchBar()}
          </div>
        </>
      ) : (
        /* Guest (Not Logged In): Show search bar on both mobile and desktop */
        renderSearchBar()
      )}
    </motion.div>
  );
}
