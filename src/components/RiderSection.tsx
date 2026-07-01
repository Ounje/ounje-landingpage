import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  Banknote,
  Bike,
  MapPin,
  HeartHandshake,
  Compass,
  DollarSign,
  PackageCheck,
  Download,
} from "lucide-react";
import HeritageMotif from "./HeritageMotif";

const benefits = [
  { icon: Banknote, text: "Earn daily payouts directly to your wallet" },
  { icon: Bike, text: "Flexible hours, you choose when to ride" },
  { icon: MapPin, text: "Deliver in your local university or community" },
  { icon: HeartHandshake, text: "Full safety and real-time navigation support" },
];

const riderSteps = [
  {
    Icon: Compass,
    title: "Go Online",
    desc: "Download the OunjeMarket app and turn on your availability status to start receiving nearby jobs.",
  },
  {
    Icon: PackageCheck,
    title: "Pick Up Meals",
    desc: "Ride to the nearby Buka kitchen, verify the order item, and pick up the hot fresh meal pack.",
  },
  {
    Icon: MapPin,
    title: "Fast Delivery",
    desc: "Follow the in-app GPS mapping coordinates to ride straight to the customer's doorstep.",
  },
  {
    Icon: DollarSign,
    title: "Get Paid Daily",
    desc: "Confirm delivery on your phone and watch your wallet update instantly. Cash out whenever you want.",
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

const RiderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="rider"
      className="relative py-16 md:py-24 overflow-hidden border-b border-[#152F18]/10"
      style={{ background: "linear-gradient(180deg, #ECFFED 0%, #d8edd9 100%)" }}
    >
      {/* Heritage Line Motif Watermark */}
      <HeritageMotif className="text-[#152F18]/[0.035]" />

      {/* SVG clip-paths for torn edges */}
      <TornClipPaths />

      <div
        ref={ref}
        className="relative z-10 flex flex-col items-center max-w-6xl gap-12 mx-auto md:flex-row mb-16 px-4 md:px-8 lg:px-16"
      >
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative h-[380px] md:h-[580px] w-full order-2 md:order-1 flex items-end justify-center"
        >
          {/* Phone screen */}
          <motion.img
            src="/images/rider-screen.png"
            alt="Rider app screen"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              opacity: { duration: 0.6, delay: 0.1 },
              scale: { duration: 0.6, delay: 0.1 },
            }}
            className="relative z-10 h-[380px] md:h-[540px] lg:h-[620px] w-auto object-contain drop-shadow-2xl"
          />

          {/* Delivery guy, slides across */}
          <motion.img
            src="/images/delivery-guy.png"
            alt="Delivery rider"
            initial={{ x: -40, opacity: 0 }}
            animate={isInView ? { x: [-40, 40, -40], opacity: 1 } : {}}
            transition={{
              x: {
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 0.5,
              },
              opacity: { duration: 0.4, delay: 0.5 },
            }}
            className="absolute left-[10%] z-20 w-[220px] md:w-[230px] lg:w-[280px] h-auto object-contain drop-shadow-xl"
          />

          {/* Earn Daily badge */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-0 md:top-8 md:-right-2 bg-[#152F18] text-white rounded-2xl px-4 py-3 shadow-xl z-30 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#FCE900]" />
            <span className="text-xs font-bold md:text-sm">Earn Daily</span>
          </motion.div>

          {/* Fast delivery badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute bottom-[55%] right-0 md:-right-2 bg-[#ECFFED] rounded-2xl px-4 py-3 shadow-lg z-30 flex items-center gap-2 border border-[#152F18]/10"
          >
            <Zap className="w-4 h-4 text-[#152F18]" />
            <span className="text-xs md:text-sm font-bold text-[#152F18]">
              Fast Delivery
            </span>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-1 space-y-6 md:w-1/2 md:order-2 text-left"
        >
          <p className="text-[#152F18]/60 text-xs font-bold uppercase tracking-[0.25em] mb-2">
            For Dispatch Riders
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-[#152F18] md:text-4xl lg:text-5xl"
          >
            Join the OunjeMarket
            <br />
            <span className="text-[#2C5E2E]">Be a Rider.</span>
            <br />
            Earn on Your Schedule.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base leading-relaxed text-gray-600 md:text-lg"
          >
            Turn your hustle into steady daily payouts. Deliver food in your local campus and community areas.
          </motion.p>

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 bg-[#ECFFED]/25 rounded-2xl px-4 py-3.5 shadow-sm border border-[#152F18]/5"
              >
                <b.icon className="w-4 h-4 text-[#2C5E2E] flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {b.text}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#2C5E2E] flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-2"
          >
            <motion.a
              href="https://apps.apple.com/ng/app/ounjemarket/id6762347962"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-[#2C5E2E] text-white font-bold px-7 py-3.5 rounded-2xl shadow-md hover:bg-[#152F18] transition text-sm cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z" />
              </svg>
              Download OunjeMarket on Play Store

            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* How It Works Rider Steps (Zigzag Torn Paper Redesign - Dark Green Cards Twist) */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 lg:px-16 mt-24 flex flex-col gap-8 md:gap-14">

        {/* Curved Hand-Drawn Arrows (Desktop Only) */}
        <div className="hidden lg:block absolute left-[48%] top-[14%] w-[120px] h-[80px] text-[#152F18]/25 pointer-events-none z-20">
          <svg viewBox="0 0 120 80" fill="none" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
            <path d="M 10,10 C 60,10 90,40 100,60" />
            <path d="M 88,58 L 100,60 L 100,48" fill="none" />
            <path d="M 112,50 L 116,46 M 114,56 L 120,56" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="hidden lg:block absolute right-[48%] top-[40%] w-[120px] h-[80px] text-[#152F18]/25 pointer-events-none z-20">
          <svg viewBox="0 0 120 80" fill="none" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
            <path d="M 110,10 C 60,10 30,40 20,60" />
            <path d="M 32,58 L 20,60 L 20,48" fill="none" />
            <path d="M 8,50 L 4,46 M 6,56 L 0,56" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="hidden lg:block absolute left-[48%] top-[66%] w-[120px] h-[80px] text-[#152F18]/25 pointer-events-none z-20">
          <svg viewBox="0 0 120 80" fill="none" className="w-full h-full stroke-current" strokeWidth="2.5" strokeLinecap="round">
            <path d="M 10,10 C 60,10 90,40 100,60" />
            <path d="M 88,58 L 100,60 L 100,48" fill="none" />
            <path d="M 112,50 L 116,46 M 114,56 L 120,56" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Header block with brush accent */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex items-center justify-center gap-1 text-[#152F18] text-xs font-extrabold uppercase tracking-[0.2em] opacity-80">
            <span>⇀</span>
            <span>HOW IT WORKS</span>
            <span>↽</span>
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold text-[#152F18] tracking-tight relative inline-block">
            How The Rider App Works

            {/* Green hand-drawn brush accent line below header */}
            <svg viewBox="0 0 200 10" className="w-48 h-2 mx-auto mt-2 text-[#152F18]/30 fill-current">
              <path d="M 0,5 C 50,2 150,8 200,5 Q 150,7 50,3 Z" />
            </svg>
          </h3>
        </div>

        {riderSteps.map((step, i) => {
          const isEven = i % 2 === 0;
          return (
            <div
              key={i}
              className={`filter drop-shadow-lg w-full lg:w-[58%] transition-all ${isEven ? "mr-auto self-start" : "ml-auto self-end"
                }`}
            >
              <div
                className={`bg-[#152F18] p-8 md:p-10 flex items-start gap-6 md:gap-8 rounded-[32px] ${isEven ? "pr-10 md:pr-12" : "pl-10 md:pl-12"
                  }`}
                style={{
                  clipPath: isEven ? "url(#torn-right)" : "url(#torn-left)",
                }}
              >
                {/* Larger Icon inside soft yellow/green background container */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 text-[#FCE900]">
                  <step.Icon className="w-8 h-8 md:w-10 md:h-10 stroke-[1.8]" />
                </div>

                {/* Content block */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FCE900] text-[#152F18] flex items-center justify-center text-sm font-black shrink-0 animate-pulse-subtle">
                      {i + 1}
                    </div>
                    <h4 className="font-extrabold text-lg md:text-xl text-white tracking-tight">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm md:text-base leading-relaxed font-medium">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RiderSection;
