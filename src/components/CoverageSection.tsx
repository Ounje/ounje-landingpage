import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Plane, Building2, ShoppingBag, BookOpen, X, ChefHat, Bike } from "lucide-react";
import HeritageMotif from "./HeritageMotif";

const zones = [
  {
    name: "Surulere",
    fullName: "Surulere, Lagos, Nigeria",
    Icon: BookOpen,
    x: "30%",
    y: "40%",
  },
  {
    name: "Yaba",
    fullName: "Yaba, Lagos, Nigeria",
    Icon: ShoppingBag,
    x: "48%",
    y: "50%",
  },
  {
    name: "Yabatech",
    fullName: "Yabatech Front Gate, Hussey Road, Lagos, Nigeria",
    Icon: Building2,
    x: "64%",
    y: "35%",
  },
  {
    name: "UniLag",
    fullName: "University of Lagos, Lagos, Nigeria",
    Icon: Plane,
    x: "78%",
    y: "55%",
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
    <path d="M900 320 Q1000 280 1100 310 Q1200 340 1350 300 L1400 500 L900 500Z" fill="#0c1d0e" />
    <path d="M0 380 Q100 360 200 380 Q250 390 300 370 L300 500 L0 500Z" fill="#0c1d0e" />
    <path d="M1050 200 Q1150 180 1300 220 L1400 280 L1400 500 L1050 500Z" fill="#0c1d0e" opacity="0.6" />
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
}: {
  name: string;
  Icon: React.ElementType;
  x: string;
  y: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20, scale: 0.6 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 260, damping: 18 }}
    className="absolute flex flex-col items-center z-10 select-none pointer-events-none"
    style={{ left: x, top: y, transform: "translate(-50%, -100%)" }}
  >
    <span className="text-white font-bold text-xs md:text-sm mb-1 drop-shadow-lg whitespace-nowrap">
      {name}
    </span>
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
      className="relative"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FCE900] rounded-full flex items-center justify-center shadow-lg shadow-[#FCE900]/40 border-2 border-white/20">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#152F18]" />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2.5 w-0 h-0"
        style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "12px solid #FCE900" }}
      />
    </motion.div>
  </motion.div>
);

const CoverageSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [orderLocation, setOrderLocation] = useState<typeof zones[0] | null>(null);

  return (
    <>
      <section
        ref={ref}
        className="relative z-30 overflow-hidden py-16 md:py-24 border-b border-[#152F18]/20"
        style={{ background: "linear-gradient(180deg, #152F18 0%, #0e2110 100%)" }}
      >
        {/* Heritage Line Motif Watermark */}
        <HeritageMotif className="text-white/[0.035]" />

        <MapSVG />

        <div className="relative z-10 pt-12 pb-0">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center text-[#FCE900]/60 text-xs font-bold uppercase tracking-[0.25em] mb-2"
          >
            Where we operate
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
          <div className="relative w-full mb-10" style={{ height: "clamp(180px, 30vw, 320px)" }}>
            {zones.map((z, i) => (
              <Pin
                key={z.name}
                {...z}
                delay={0.3 + i * 0.12}
              />
            ))}
          </div>
        </div>

        {/* How to Order Steps Container */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-8 px-4 text-center">
          <p className="text-[#FCE900] text-xs font-extrabold uppercase tracking-[0.25em] mb-3">
            Three Simple Steps
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-10 tracking-tight">
            How To Order On OunjeFood
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Download the App",
                desc: "Install the OunjeFood app on iOS to explore local kitchens and Bukas near you.",
              },
              {
                step: "02",
                title: "Choose Your Location",
                desc: "Enter your delivery address to see verified active vendors in Lagos.",
              },
              {
                step: "03",
                title: "Build Plate & Enjoy",
                desc: "Mix and match sides to build your perfect custom plate and track delivery.",
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white/[0.03] border border-white/10 rounded-3xl relative backdrop-blur-sm overflow-hidden">
                <div className="absolute top-4 right-4 text-white/[0.04] text-5xl font-black italic select-none">
                  {s.step}
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FCE900] text-[#152F18] flex items-center justify-center font-black text-lg mb-4 shadow-md">
                  {s.step}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 text-white/50 text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-[#FCE900] rounded-full animate-pulse shrink-0" />
            More delivery areas coming soon
          </div>
        </div>
      </section>

      <LocationOptionsModal
        isOpen={orderLocation !== null}
        onClose={() => setOrderLocation(null)}
        location={orderLocation?.name ?? ""}
      />
    </>
  );
};

const LocationOptionsModal = ({
  isOpen,
  onClose,
  location,
}: {
  isOpen: boolean;
  onClose: () => void;
  location: string;
}) => {
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
          <div className="w-12 h-12 bg-[#ECFFED] text-[#152F18] rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-[#152F18]">Join Ounje in {location}</h3>
          <p className="text-xs text-gray-400 max-w-xs mx-auto">
            Choose how you would like to proceed. All operations are managed securely via our mobile applications.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="https://apps.apple.com/ng/app/ounjefood/id6762204959"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#ECFFED]/30 border border-gray-100 hover:border-[#152F18]/20 rounded-2xl transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shrink-0 text-[#152F18] group-hover:bg-[#152F18] group-hover:text-white transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#152F18] block">Order Delicious Meals</span>
              <span className="text-[11px] text-gray-400 font-medium">Download the OunjeFood iOS App to get started</span>
            </div>
          </a>

          <a
            href="https://apps.apple.com/ng/app/ounjemarket/id6762347962"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#ECFFED]/30 border border-gray-100 hover:border-[#152F18]/20 rounded-2xl transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shrink-0 text-[#152F18] group-hover:bg-[#152F18] group-hover:text-white transition-all">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#152F18] block">Register as Buka (Vendor)</span>
              <span className="text-[11px] text-gray-400 font-medium">Download OunjeMarket App to list your kitchen</span>
            </div>
          </a>

          <a
            href="https://apps.apple.com/ng/app/ounjemarket/id6762347962"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-[#ECFFED]/30 border border-gray-100 hover:border-[#152F18]/20 rounded-2xl transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shrink-0 text-[#152F18] group-hover:bg-[#152F18] group-hover:text-white transition-all">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-[#152F18] block">Become Delivery Rider</span>
              <span className="text-[11px] text-gray-400 font-medium">Download OunjeMarket App to rider delivery orders</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default CoverageSection;
