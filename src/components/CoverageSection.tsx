import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plane, Building2, ShoppingBag, BookOpen, X, ChefHat, Bike } from "lucide-react";
import SearchCTA from "./SearchCTA";

const zones = [
  {
    name: "Surulere",
    fullName: "Surulere, Lagos, Nigeria",
    Icon: BookOpen,
    x: "30%",
    y: "40%",
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0!2d3.3542!3d6.5059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c0e0e0e0e0e%3A0x0e0e0e0e0e0e0e0e!2sSurulere%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000",
  },
  {
    name: "Yaba",
    fullName: "Yaba, Lagos, Nigeria",
    Icon: ShoppingBag,
    x: "48%",
    y: "50%",
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0!2d3.3792!3d6.5095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2a7b2a7b2a%3A0x7b2a7b2a7b2a7b2a!2sYaba%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000",
  },
  {
    name: "Yabatech",
    fullName: "Yabatech Front Gate, Hussey Road, Lagos, Nigeria",
    Icon: Building2,
    x: "64%",
    y: "35%",
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1!2d3.3745!3d6.5182!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8cf0f0f0f0f0%3A0xf0f0f0f0f0f0f0f0!2sYaba%20College%20of%20Technology!5e0!3m2!1sen!2sng!4v1700000000000",
  },
  {
    name: "UniLag",
    fullName: "University of Lagos, Lagos, Nigeria",
    Icon: Plane,
    x: "78%",
    y: "55%",
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.385552943716!2d3.386159374751792!3d6.516568223635397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8cf5f42657e5%3A0x64426570954b8d76!2sUniversity%20of%20Lagos!5e0!3m2!1sen!2sng!4v1719751740000!5m2!1sen!2sng",
  },
];

/* ── Abstract Lagos road map SVG ── */
const MapSVG = () => (
  <svg
    viewBox="0 0 1400 500"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute inset-0 w-full h-full opacity-40"
    preserveAspectRatio="xMidYMid slice"
  >
    <path d="M900 320 Q1000 280 1100 310 Q1200 340 1350 300 L1400 500 L900 500Z" fill="#0f2e12" />
    <path d="M0 380 Q100 360 200 380 Q250 390 300 370 L300 500 L0 500Z" fill="#0f2e12" />
    <path d="M1050 200 Q1150 180 1300 220 L1400 280 L1400 500 L1050 500Z" fill="#0f2e12" opacity="0.6" />
    <path d="M0 310 Q200 290 400 305 Q600 320 800 308 Q1000 296 1200 310 Q1300 317 1400 308"
      stroke="#c9a227" strokeWidth="5" strokeLinecap="round" />
    <path d="M0 310 Q200 290 400 305 Q600 320 800 308 Q1000 296 1200 310 Q1300 317 1400 308"
      stroke="#fff" strokeWidth="1.5" strokeDasharray="20 18" strokeLinecap="round" opacity="0.3" />
    <path d="M0 240 Q150 225 350 238 Q500 248 700 235 Q900 222 1100 240 Q1250 252 1400 240"
      stroke="#c9a227" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    <path d="M280 60 Q290 160 300 238" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <path d="M420 0 Q430 120 440 238" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M560 40 Q565 140 570 305" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M700 20 Q705 130 710 235" stroke="#c9a227" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <path d="M850 50 Q852 170 855 308" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M1000 30 Q1005 150 1010 296" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    <path d="M1150 60 Q1155 170 1160 310" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    <path d="M380 160 Q480 155 580 160 Q680 165 780 158" stroke="#c9a227" strokeWidth="1.2" opacity="0.35" />
    <path d="M400 200 Q500 195 600 200 Q700 205 800 198" stroke="#c9a227" strokeWidth="1.2" opacity="0.35" />
    <path d="M420 240 Q540 235 660 238 Q760 240 860 236" stroke="#c9a227" strokeWidth="1" opacity="0.25" />
    <path d="M380 120 Q500 115 620 118 Q740 121 860 116" stroke="#c9a227" strokeWidth="1" opacity="0.25" />
    <path d="M310 238 Q380 275 440 308" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M650 235 Q700 270 740 308" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M920 222 Q960 265 990 308" stroke="#c9a227" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    <path d="M100 350 Q250 345 400 352 Q550 358 700 350" stroke="#c9a227" strokeWidth="1.5" opacity="0.3" />
    <path d="M500 355 Q600 360 720 355 Q840 350 960 358" stroke="#c9a227" strokeWidth="1.5" opacity="0.3" />
  </svg>
);

/* ── Animated map pin ── */
const Pin = ({
  name,
  Icon,
  x,
  y,
  delay,
  onClick,
}: {
  name: string;
  Icon: React.ElementType;
  x: string;
  y: string;
  delay: number;
  onClick: () => void;
}) => (
  <motion.button
    initial={{ opacity: 0, y: -20, scale: 0.6 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 260, damping: 18 }}
    onClick={onClick}
    className="absolute flex flex-col items-center z-10 group cursor-pointer"
    style={{ left: x, top: y, transform: "translate(-50%, -100%)" }}
  >
    <span className="text-white font-bold text-xs md:text-sm mb-1 drop-shadow-lg whitespace-nowrap group-hover:text-[#FFC727] transition-colors">
      {name}
    </span>
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
      className="relative"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFC727] group-hover:bg-white transition-colors rounded-full flex items-center justify-center shadow-lg shadow-[#FFC727]/40 border-2 border-white/20">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#1A3F1C]" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 w-0 h-0"
        style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "12px solid #FFC727" }}
      />
    </motion.div>
  </motion.button>
);

const CoverageSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [orderLocation, setOrderLocation] = useState<typeof zones[0] | null>(null);

  return (
    <>
      <section
        ref={ref}
        className="relative z-30"
        style={{ background: "linear-gradient(180deg, #1A3F1C 0%, #0f2e12 100%)" }}
      >
        <MapSVG />

        <div className="relative z-10 pt-12 pb-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-white/50 text-xs font-bold uppercase tracking-[0.25em] mb-2"
          >
            Where we deliver
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="text-center font-extrabold text-white/90 leading-none select-none"
            style={{ fontSize: "clamp(80px, 18vw, 180px)", letterSpacing: "-0.02em" }}
          >
            Lagos
          </motion.h2>

          {/* Pin area */}
          <div className="relative w-full" style={{ height: "clamp(180px, 30vw, 320px)" }}>
            {zones.map((z, i) => (
              <Pin
                key={z.name}
                {...z}
                delay={0.3 + i * 0.12}
                onClick={() => setOrderLocation(z)}
              />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.7 }}
          className="relative z-10 px-4 pb-12 flex flex-col items-center gap-6 max-w-xl mx-auto"
        >
          {/* Search CTA Box */}
          <div className="w-full text-center space-y-3 mt-2">
            <p className="text-white/65 text-xs md:text-sm font-semibold tracking-wide uppercase">
              Don't see your area? Check if we deliver near you:
            </p>
            <SearchCTA className="px-0" />
          </div>

          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-5 py-2 text-white/60 text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-[#FFC727] rounded-full animate-pulse shrink-0" />
            More areas coming soon
          </div>
        </motion.div>
      </section>

      <LocationOptionsModal
        isOpen={orderLocation !== null}
        onClose={() => setOrderLocation(null)}
        location={orderLocation?.name ?? ""}
        fullName={orderLocation?.fullName ?? ""}
      />
    </>
  );
};

const LocationOptionsModal = ({
  isOpen,
  onClose,
  location,
  fullName,
}: {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  fullName: string;
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 border border-gray-100 shadow-2xl relative space-y-6 animate-scale-up text-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-50 cursor-pointer animate-none"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-[#ECFFED] text-[#2C5E2E] rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-[#1A3F1C]">Join Ounje in {location}</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Choose how you would like to proceed. We will set <span className="font-semibold text-[#1A3F1C]">{location}</span> as your default location.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose();
              navigate(`/customer/browse?location=${encodeURIComponent(fullName)}`);
            }}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#ECFFED]/30 border border-gray-100 hover:border-[#2C5E2E]/20 rounded-2xl transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shrink-0 text-[#2C5E2E] group-hover:bg-[#2C5E2E] group-hover:text-white transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#1A3F1C] block">Order Delicious Meals</span>
              <span className="text-[11px] text-gray-400 font-medium">Browse Buka kitchens in {location}</span>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              navigate(`/vendor/auth?location=${encodeURIComponent(fullName)}`);
            }}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#ECFFED]/30 border border-gray-100 hover:border-[#2C5E2E]/20 rounded-2xl transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shrink-0 text-[#2C5E2E] group-hover:bg-[#2C5E2E] group-hover:text-white transition-all">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#1A3F1C] block">Register as Buka (Vendor)</span>
              <span className="text-[11px] text-gray-400 font-medium">Grow your kitchen and start receiving orders</span>
            </div>
          </button>

          <button
            onClick={() => {
              onClose();
              navigate(`/rider/auth?location=${encodeURIComponent(fullName)}`);
            }}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#ECFFED]/30 border border-gray-100 hover:border-[#2C5E2E]/20 rounded-2xl transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shrink-0 text-[#2C5E2E] group-hover:bg-[#2C5E2E] group-hover:text-white transition-all">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#1A3F1C] block">Become Delivery Rider</span>
              <span className="text-[11px] text-gray-400 font-medium">Earn money delivering food around {location}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverageSection;
