import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Plane, Building2, ShoppingBag, BookOpen, Sparkles, X } from "lucide-react";

const zones = [
  {
    name: "Ikeja",
    Icon: Plane,
    x: "30%",
    y: "22%",
    // Google Maps embed src (no API key needed for basic embed)
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.0!2d3.3515!3d6.6018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b923a4a3e9a7b%3A0x6b45b5a6b5a6b5a6!2sIkeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000",
  },
  {
    name: "Berger",
    Icon: Building2,
    x: "46%",
    y: "42%",
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.0!2d3.3792!3d6.6310!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b93b7c0e1e1e1%3A0x1e1e1e1e1e1e1e1e!2sBerger%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000",
  },
  {
    name: "Yaba",
    Icon: ShoppingBag,
    x: "58%",
    y: "56%",
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0!2d3.3792!3d6.5095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2a7b2a7b2a%3A0x7b2a7b2a7b2a7b2a!2sYaba%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000",
  },
  {
    name: "Surulere",
    Icon: BookOpen,
    x: "74%",
    y: "34%",
    embedSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0!2d3.3542!3d6.5059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8c0e0e0e0e0e%3A0x0e0e0e0e0e0e0e0e!2sSurulere%2C%20Lagos!5e0!3m2!1sen!2sng!4v1700000000000",
  },
];

type Zone = typeof zones[number];

/* ── Map modal (browser-window style) ── */
const MapModal = ({ zone, onClose }: { zone: Zone; onClose: () => void }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Window */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 24 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl z-10"
        style={{ border: "3px solid #A8D5B0" }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#A8D5B0" }}>
          {/* Traffic dots */}
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition shrink-0"
          />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] shrink-0" />
          <span className="w-3 h-3 rounded-full bg-[#28C840] shrink-0" />

          {/* URL bar */}
          <div
            className="flex-1 mx-3 rounded-md h-6 flex items-center px-3 gap-1.5"
            style={{ background: "rgba(44,94,46,0.15)" }}
          >
            <MapPin className="w-3 h-3 shrink-0" style={{ color: "rgba(26,63,28,0.5)" }} />
            <span className="text-xs font-mono truncate" style={{ color: "rgba(26,63,28,0.6)" }}>
              {zone.name}, Lagos · OunjeFood Delivery Zone
            </span>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            className="ml-1 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/10 transition shrink-0"
          >
            <X className="w-4 h-4 text-[#1A3F1C]/60" />
          </button>
        </div>

        {/* Map iframe */}
        <iframe
          src={zone.embedSrc}
          title={`Map of ${zone.name}, Lagos`}
          className="w-full"
          style={{ height: "420px", border: "none", display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        {/* Footer strip */}
        <div className="px-5 py-3 flex items-center gap-2 bg-[#1A3F1C]">
          <zone.Icon className="w-4 h-4 text-[#FFC727] shrink-0" />
          <span className="text-white font-bold text-sm">{zone.name}</span>
          <span className="text-white/40 text-xs">· Active delivery zone</span>
          <span className="ml-auto w-2 h-2 bg-[#28C840] rounded-full animate-pulse" />
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

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
  const [activeZone, setActiveZone] = useState<Zone | null>(null);

  return (
    <>
      <section
        ref={ref}
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(180deg, #1A3F1C 0%, #0f2e12 100%)" }}
      >
        <MapSVG />
        <Sparkles className="absolute bottom-6 right-8 w-8 h-8 text-white/20 z-10" />

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
                onClick={() => setActiveZone(z)}
              />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.7 }}
          className="relative z-10 px-4 pb-8 flex flex-col items-center gap-4"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {zones.map((z) => (
              <button
                key={z.name}
                onClick={() => setActiveZone(z)}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/18 border border-white/15 rounded-full px-5 py-2.5 transition-colors group"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FFC727] shrink-0" />
                <span className="text-white text-xs md:text-sm font-medium">{z.name}</span>
                <span className="text-[#FFC727] text-xs font-bold uppercase tracking-wider group-hover:underline">
                  View on map
                </span>
              </button>
            ))}
          </div>

          <div className="inline-flex items-center gap-2 bg-white/8 border border-white/15 rounded-full px-5 py-2 text-white/60 text-xs font-semibold">
            <span className="w-1.5 h-1.5 bg-[#FFC727] rounded-full animate-pulse shrink-0" />
            More areas coming Q2 2026
          </div>
        </motion.div>
      </section>

      {/* Map modal */}
      {activeZone && (
        <MapModal zone={activeZone} onClose={() => setActiveZone(null)} />
      )}
    </>
  );
};

export default CoverageSection;
