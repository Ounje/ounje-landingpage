import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Smartphone, Bike, TrendingUp, ArrowRight } from "lucide-react";

const perks = [
  { icon: Smartphone, title: "Orders to Your Phone", desc: "Customers find you and place orders directly, you just cook." },
  { icon: Bike, title: "We Handle Delivery", desc: "Our riders pick up and deliver. You focus 100% on the food." },
  { icon: TrendingUp, title: "Grow Your Income", desc: "Reach more customers without a big shop or expensive setup." },
];

const BASE = "/assets/vendor-scene/photo_";
const EXT  = "_2026-05-07_11-42-18.jpg";

// Narrative order: customer places order → vendor notified → vendor accepts →
// preparing → order ready → rider requested → rider to store → rider at store →
// order enroute → order arrived → delivered → rider paid → vendor paid
const scenes = [1, 4, 5, 2, 7, 12, 9, 10, 3, 6, 8, 13, 14, 11].map(
  (n) => `${BASE}${n}${EXT}`
);
// Duplicate for seamless infinite loop
const ticker = [...scenes, ...scenes];

// Alternating heights for visual rhythm
const HEIGHTS = [
  "380px","280px","380px","280px","380px","280px","380px",
  "280px","380px","280px","380px","280px","380px","280px",
];

const BrowserFrame = ({ src, alt, height }: { src: string; alt: string; height: string }) => (
  <div
    className="rounded-2xl overflow-hidden shadow-lg w-[260px] md:w-[320px] shrink-0 self-center"
    style={{ height }}
  >
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  </div>
);

const VendorSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="vendor" className="py-16 md:py-24 bg-[#ECFFED] overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight mb-4">
            We Bring The Orders<br />
            <span className="text-[#2C5E2E]">Right To You</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            You cook. We handle the rest.
          </p>
        </motion.div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-[#2C5E2E]/10 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <perk.icon className="w-5 h-5 text-[#2C5E2E]" />
              </div>
              <h3 className="font-extrabold text-[#1A3F1C] text-base mb-2 leading-tight">{perk.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Vendor CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col items-center gap-3 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/vendor/auth")}
            className="flex items-center gap-2 bg-[#2C5E2E] hover:bg-[#1A3F1C] text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg transition-colors text-sm md:text-base cursor-pointer"
          >
            Start Selling as a Vendor
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <p className="text-xs text-gray-400 font-semibold">Already registered? Log in to your kitchen dashboard.</p>
        </motion.div>
      </div>

      {/* ── Full-width scrolling carousel ── */}
      <div className="relative w-full overflow-hidden">

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-6 w-max will-change-transform"
        >
          {ticker.map((src, i) => (
            <BrowserFrame
              key={i}
              src={src}
              alt={`Vendor scene ${(i % scenes.length) + 1}`}
              height={HEIGHTS[i % HEIGHTS.length]}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default VendorSection;
