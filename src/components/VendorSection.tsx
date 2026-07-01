import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Smartphone, Bike, TrendingUp, ArrowRight, Store, BellRing, UtensilsCrossed, CheckCircle2, Download } from "lucide-react";
import HeritageMotif from "./HeritageMotif";

const perks = [
  {
    icon: Smartphone,
    title: "Orders to Your Phone",
    desc: "Customers find you and place orders directly, you just cook.",
    bg: "#2C5E2E",
    iconBg: "rgba(255,255,255,0.15)",
    iconColor: "#FCE900",
    textColor: "text-white",
    descColor: "text-white/70",
    border: "border border-white/10",
  },
  {
    icon: Bike,
    title: "We Handle Delivery",
    desc: "Our riders pick up and deliver. You focus 100% on the food.",
    bg: "#FCE900",
    iconBg: "rgba(21,47,24,0.12)",
    iconColor: "#152F18",
    textColor: "text-[#152F18]",
    descColor: "text-[#152F18]/65",
    border: "border border-transparent",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Income",
    desc: "Reach more customers without a big shop or expensive setup.",
    bg: "#FAF8F0",
    iconBg: "rgba(21,47,24,0.08)",
    iconColor: "#152F18",
    textColor: "text-[#152F18]",
    descColor: "text-gray-600",
    border: "border border-transparent",
  },
];

const vendorSteps = [
  {
    Icon: Store,
    title: "Setup Your Buka",
    desc: "Download the OunjeMarket app, register your kitchen, upload your kitchen menu items, and set prices.",
  },
  {
    Icon: BellRing,
    title: "Receive Orders",
    desc: "Get instant sound notification alerts on your phone as soon as local customers place their orders.",
  },
  {
    Icon: UtensilsCrossed,
    title: "Cook & Package",
    desc: "Prepare the delicious meals fresh and pack them securely with the customer order slip.",
  },
  {
    Icon: CheckCircle2,
    title: "Handover to Rider",
    desc: "A verified OunjeMarket dispatch rider will arrive to collect and deliver. Track the journey live.",
  },
];

const TornClipPaths = () => (
  <svg className="absolute w-0 h-0" width="0" height="0">
    <defs>
      <clipPath id="torn-right" clipPathUnits="objectBoundingBox">
        <path d="M 0,0 
                 L 0.96,0 
                 Q 0.97,0.06 0.94,0.12 
                 Q 0.98,0.18 0.95,0.24 
                 Q 0.93,0.30 0.97,0.36 
                 Q 0.94,0.42 0.96,0.48 
                 Q 0.98,0.54 0.94,0.60 
                 Q 0.97,0.66 0.95,0.72 
                 Q 0.93,0.78 0.96,0.84 
                 Q 0.95,0.90 0.97,0.95
                 Q 0.94,0.98 0.95,1 
                 L 0,1 Z" />
      </clipPath>
      <clipPath id="torn-left" clipPathUnits="objectBoundingBox">
        <path d="M 1,0 
                 L 0.04,0 
                 Q 0.03,0.06 0.06,0.12 
                 Q 0.02,0.18 0.05,0.24 
                 Q 0.07,0.30 0.03,0.36 
                 Q 0.06,0.42 0.04,0.48 
                 Q 0.02,0.54 0.06,0.60 
                 Q 0.03,0.66 0.05,0.72 
                 Q 0.07,0.78 0.04,0.84 
                 Q 0.05,0.90 0.03,0.95
                 Q 0.06,0.98 0.05,1 
                 L 1,1 Z" />
      </clipPath>
    </defs>
  </svg>
);

const VendorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="vendor"
      className="relative py-16 md:py-24 overflow-hidden border-b border-[#152F18]/20"
      style={{ background: "linear-gradient(180deg, #152F18 0%, #0e2110 100%)" }}
    >
      {/* Heritage Line Motif Watermark */}
      <HeritageMotif className="text-white/[0.035]" />

      {/* SVG clip-paths for torn edges */}
      <TornClipPaths />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 lg:px-16">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[#FCE900]/60 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            For Food Vendors
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            List Your Buka on <br className="hidden sm:inline" />
            <span className="text-[#FCE900]">OunjeMarket</span>
          </h2>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Reach thousands of customers on campus and in local communities. You cook, we deliver.
          </p>
        </motion.div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-28">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
              className={`flex flex-col gap-4 cursor-default rounded-3xl p-7 shadow-lg ${perk.border}`}
              style={{ background: perk.bg }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
                style={{ background: perk.iconBg }}
              >
                <perk.icon className="w-6 h-6" style={{ color: perk.iconColor }} />
              </div>

              {/* Text */}
              <div>
                <h3 className={`font-extrabold text-lg mb-2 leading-tight ${perk.textColor}`}>
                  {perk.title}
                </h3>
                <p className={`text-sm leading-relaxed ${perk.descColor}`}>
                  {perk.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* How It Works Flow (Torn Paper Zigzag Redesign) */}
        <div className="mb-24 relative max-w-5xl mx-auto flex flex-col gap-8 md:gap-14">
          
          {/* Curved Hand-Drawn Arrows (Desktop Only, Adjusted for edge-to-midpoint layout) */}
          <div className="hidden lg:block absolute left-[48%] top-[14%] w-[120px] h-[80px] text-[#FCE900]/40 pointer-events-none z-20">
            <svg viewBox="0 0 120 80" fill="none" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 10,10 C 60,10 90,40 100,60" />
              <path d="M 88,58 L 100,60 L 100,48" fill="none" />
              <path d="M 112,50 L 116,46 M 114,56 L 120,56" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="hidden lg:block absolute right-[48%] top-[40%] w-[120px] h-[80px] text-[#FCE900]/40 pointer-events-none z-20">
            <svg viewBox="0 0 120 80" fill="none" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 110,10 C 60,10 30,40 20,60" />
              <path d="M 32,58 L 20,60 L 20,48" fill="none" />
              <path d="M 8,50 L 4,46 M 6,56 L 0,56" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="hidden lg:block absolute left-[48%] top-[66%] w-[120px] h-[80px] text-[#FCE900]/40 pointer-events-none z-20">
            <svg viewBox="0 0 120 80" fill="none" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 10,10 C 60,10 90,40 100,60" />
              <path d="M 88,58 L 100,60 L 100,48" fill="none" />
              <path d="M 112,50 L 116,46 M 114,56 L 120,56" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Header block with brush accent */}
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center gap-1 text-[#FCE900] text-xs font-extrabold uppercase tracking-[0.2em] opacity-80">
              <span>⇀</span>
              <span>HOW IT WORKS</span>
              <span>↽</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight relative inline-block">
              How The Vendor App Works
              
              {/* Green hand-drawn brush accent line below header */}
              <svg viewBox="0 0 200 10" className="w-48 h-2 mx-auto mt-2 text-[#FCE900]/40 fill-current">
                <path d="M 0,5 C 50,2 150,8 200,5 Q 150,7 50,3 Z" />
              </svg>
            </h3>
          </div>

          {vendorSteps.map((step, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={i}
                className={`filter drop-shadow-lg w-full lg:w-[58%] transition-all ${
                  isEven ? "mr-auto self-start" : "ml-auto self-end"
                }`}
              >
                <div
                  className={`bg-[#FAF8F0] p-8 md:p-10 flex items-start gap-6 md:gap-8 rounded-[32px] ${
                    isEven ? "pr-10 md:pr-12" : "pl-10 md:pl-12"
                  }`}
                  style={{
                    clipPath: isEven ? "url(#torn-right)" : "url(#torn-left)",
                  }}
                >
                  {/* Larger Icon inside soft green background container */}
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#152F18]/10 flex items-center justify-center shrink-0 text-[#152F18]">
                    <step.Icon className="w-8 h-8 md:w-10 md:h-10 stroke-[1.8]" />
                  </div>

                  {/* Content block */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#152F18] text-white flex items-center justify-center text-sm font-black shrink-0 animate-pulse-subtle">
                        {i + 1}
                      </div>
                      <h4 className="font-extrabold text-lg md:text-xl text-[#152F18] tracking-tight">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-gray-700 text-sm md:text-base leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vendor CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex flex-col items-center gap-3"
        >
          <motion.a
            href="https://apps.apple.com/ng/app/ounjemarket/id6762347962"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2.5 bg-[#2C5E2E] hover:bg-white hover:text-[#152F18] text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl transition-all text-sm md:text-base cursor-pointer"
          >
            <Download className="w-4.5 h-4.5" />
            Download OunjeMarket for Vendors
            <ArrowRight className="w-4.5 h-4.5 text-[#FCE900] ml-1" />
          </motion.a>
          <div className="flex items-center gap-1.5 text-xs text-white/50 font-semibold mt-1">
            <Store className="w-4 h-4 text-[#FCE900]" />
            <span>Join thousands of food vendors growing their sales daily.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VendorSection;
