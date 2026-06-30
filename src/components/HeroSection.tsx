import { useRef, useEffect, useState } from "react";
import {
  motion,
  useAnimation,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

import { Search, MapPin, Locate } from "lucide-react";
import { loadGoogleMapsScript } from "../utils/googleMapsLoader";

const phrases = [
  { text: "Come chop.", lang: "Pidgin" },
  { text: "Zo ka chi abinci.", lang: "Hausa" },
  { text: "Bia rie nri.", lang: "Igbo" },
  { text: "Wa jeun.", lang: "Yoruba" },
];

const dishes = [
  "Jollof Rice",
  "Pounded Yam & Egusi",
  "Suya",
  "Fried Rice",
  "Amala & Ewedu",
  "Moi Moi",
  "Pepper Soup",
  "Eba & Okro",
  "Grilled Chicken",
  "Small Chops",
  "Fried Plantain",
  "Ofada Stew",
];

// Duplicate for seamless loop
const tickerItems = [...dishes, ...dishes];

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

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();

  const getDashboardLink = () => {
    if (role === "vendor") return "/vendor/dashboard";
    if (role === "rider") return "/rider/dashboard";
    return "/customer/browse";
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  const [phraseIndex, setPhraseIndex] = useState(0);
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

  useEffect(() => {
    if (isInView) controls.start("show");
  }, [isInView, controls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.16, delayChildren: 0.1 },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" as const } },
  };

  return (
    <section
      ref={ref}
      id="home"
      className="relative z-20 min-h-[580px] md:min-h-[900px] lg:min-h-[1000px]"
      style={{
        background:
          "linear-gradient(180deg, #B8DEFF 0%, #D4ECFF 30%, #EAF6FF 62%, #F0FFF4 100%)",
      }}
    >
      {/* Sun */}
      <div
        className="absolute top-14 right-[12%] md:right-[18%] w-16 h-16 md:w-24 md:h-24 bg-[#FFC727] rounded-full pointer-events-none z-0"
        style={{
          boxShadow:
            "0 0 50px 25px rgba(255,199,39,0.30), 0 0 100px 60px rgba(255,220,100,0.12)",
        }}
      />

      {/* Cloud 1 */}
      <motion.div
        animate={{ x: [0, 28, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[6%] pointer-events-none z-0"
      >
        <div className="relative h-10 w-28 md:w-44 md:h-14">
          <div className="absolute inset-0 rounded-full bg-white/75" />
          <div className="absolute w-16 h-12 rounded-full -top-4 left-5 md:w-22 md:h-14 bg-white/75" />
          <div className="absolute w-12 rounded-full -top-2 right-3 h-9 md:w-18 md:h-11 bg-white/75" />
        </div>
      </motion.div>

      {/* Cloud 2 */}
      <motion.div
        animate={{ x: [0, -22, 0] }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute top-28 right-[28%] pointer-events-none z-0 hidden md:block"
      >
        <div className="relative w-20 h-8">
          <div className="absolute inset-0 rounded-full bg-white/55" />
          <div className="absolute rounded-full -top-3 left-4 w-14 h-9 bg-white/55" />
        </div>
      </motion.div>

      {/* Cloud 3 */}
      <motion.div
        animate={{ x: [0, 15, 0] }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute top-10 right-[4%] pointer-events-none z-0 hidden lg:block"
      >
        <div className="relative w-16 h-6">
          <div className="absolute inset-0 rounded-full bg-white/45" />
          <div className="absolute w-10 rounded-full -top-2 left-3 h-7 bg-white/45" />
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={controls}
        className="relative z-20 flex flex-col items-center px-4 pt-24 text-center md:pt-32"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="mb-6 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs md:text-sm font-semibold text-[#2C5E2E] shadow-sm"
        >
          <svg className="w-4.5 h-3 rounded-[2px] shadow-sm shrink-0 border border-gray-100" viewBox="0 0 3 2">
            <rect width="1" height="2" fill="#008751" />
            <rect x="1" width="1" height="2" fill="#FFFFFF" />
            <rect x="2" width="1" height="2" fill="#008751" />
          </svg>
          Authentic Nigerian Food
        </motion.div>

        {/* Static headline */}
        <motion.h1
          variants={fadeUp}
          className="font-extrabold text-[#1A3F1C] leading-[1.05] tracking-tight mb-4"
          style={{ fontSize: "clamp(42px, 9vw, 120px)" }}
        >
          Naija food,
          <br />
          at your door{" "}
          <span className="text-[#2C5E2E] relative inline-block">
            fast.
            {/* underline accent */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
              className="absolute -bottom-1 left-0 right-0 h-[4px] md:h-[6px] bg-[#FFC727] rounded-full origin-left"
            />
          </span>
        </motion.h1>

        {/* Rotating multilingual subtext */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center h-8 gap-3 mb-7 md:mb-9 md:h-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.38, ease: "easeOut" }}
              className="flex items-center gap-2.5"
            >
              {/* Language label */}
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-[#2C5E2E]/40 leading-none">
                {phrases[phraseIndex].lang}
              </span>
              <span className="w-px h-4 bg-[#2C5E2E]/20" />
              {/* Phrase */}
              <span className="text-base md:text-xl font-semibold text-[#1A3F1C]/75 italic">
                {phrases[phraseIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Food ticker */}
        <motion.div
          variants={fadeUp}
          className="relative w-full max-w-lg mb-8 overflow-hidden md:max-w-2xl md:mb-10"
        >
          {/* fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#EAF6FF] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#EAF6FF] to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap will-change-transform"
          >
            {tickerItems.map((dish, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2.5 px-3 text-xs md:text-sm font-semibold text-[#1A3F1C]/60"
              >
                {dish}
                <span className="text-[#FFC727] text-sm leading-none">·</span>
              </span>
            ))}
          </motion.div>
        </motion.div>
        {/* Search & CTAs */}
        {/* Search & CTAs */}
        <motion.div
          variants={fadeUp}
          className="w-full max-w-xl mx-auto flex flex-col gap-4 relative z-20 px-4"
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
              <div className="hidden md:flex flex-col sm:flex-row items-stretch gap-2.5 bg-white/75 backdrop-blur-md border border-[#2C5E2E]/15 rounded-3xl p-2.5 shadow-xl w-full">
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

                {/* Order Now Button */}
                <button
                  onClick={handleOrderNow}
                  className="flex items-center justify-center gap-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold px-8 py-3.5 sm:py-0 rounded-2xl transition-colors text-base shadow-md shrink-0"
                >
                  <Search className="w-5 h-5" />
                  Order Now
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
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#ECFFED] text-gray-700 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-[#FFC727] shrink-0" />
                        <span>{loc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest (Not Logged In): Show search bar on both mobile and desktop */
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

              {/* Order Now Button */}
              <button
                onClick={handleOrderNow}
                className="flex items-center justify-center gap-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold px-8 py-3.5 sm:py-0 rounded-2xl transition-colors text-base shadow-md shrink-0"
              >
                <Search className="w-5 h-5" />
                Order Now
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
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#ECFFED] text-gray-700 text-sm font-semibold transition-colors border-b border-gray-50 last:border-0"
                    >
                      <MapPin className="w-4 h-4 text-[#FFC727] shrink-0" />
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Live coverage + pulse */}
        <motion.div
          variants={fadeUp}
          className="mt-5 flex items-center gap-2 text-xs text-[#4a4a4a]/60 font-medium sm:hidden md:hidden"
        >
          <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full animate-pulse" />
          Now delivering in Lagos · Yaba · UniLag · Yabatech · Surulere
        </motion.div>
      </motion.div>

      {/* Ground strip */}
      <div className="absolute bottom-0 left-0 right-0 h-14 md:h-20 bg-[#2C5E2E]/30 pointer-events-none z-0" />

      {/* Road */}
      <div className="absolute bottom-2 md:bottom-4 left-0 right-0 h-6 md:h-10 bg-[#3d3d3d]/45 pointer-events-none z-0">
        <div
          className="absolute left-0 right-0 -translate-y-1/2 pointer-events-none top-1/2"
          style={{
            height: "2px",
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 24px, transparent 24px, transparent 48px)",
          }}
        />
      </div>

      {/* Left illustration */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.85, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-0 left-0 z-10 pointer-events-none"
      >
        <img
          src="/icons/Street Food-cuate.png"
          alt="Person ordering food"
          className="w-[130px] h-auto md:w-[260px] lg:w-[390px] object-contain drop-shadow-2xl"
          loading="eager"
          decoding="async"
        />
      </motion.div>

      {/* Right illustration */}
      <motion.div
        initial={{ x: 120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.7, ease: "easeOut" }}
        className="absolute bottom-0 right-0 z-10 pointer-events-none"
      >
        <img
          src="/icons/Take Away-cuate.png"
          alt="Food delivery arriving"
          className="w-[130px] h-auto md:w-[260px] lg:w-[390px] object-contain drop-shadow-2xl"
          loading="eager"
          decoding="async"
        />
      </motion.div>



    </section>
  );
};

export default HeroSection;
