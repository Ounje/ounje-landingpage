import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  UtensilsCrossed,
  Navigation,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import HeritageMotif from "./HeritageMotif";

/* ─── Feature data ─────────────────────────────────────────────── */
const features = [
  {
    image: "/assets/vendors-near-you.png",
    title: "Vendors Near You",
    copy: "Order Authentic Naija food from vendors closeby. You no go pay plenty for delivery.",
    bg: "#152F18",
    titleColor: "text-white",
    copyColor: "text-white/70",
    Icon: MapPin,
    iconColor: "text-[#FCE900]",
    bubble: "Your nearest buka is just around the corner",
    bottom: "vendors" as const,
  },
  {
    image: "/assets/build-a-plate.png",
    title: "Build a Plate",
    copy: "An interactive and fun way to make your meal. Sidon arrange am like say you dey the vendor place.",
    bg: "#FCE900",
    titleColor: "text-[#152F18]",
    copyColor: "text-[#152F18]/70",
    Icon: UtensilsCrossed,
    iconColor: "text-[#152F18]",
    bubble: "Make am exactly how you want am",
    bottom: "plate" as const,
  },
  {
    image: "/assets/order-tracking.png",
    title: "Track Your Order",
    copy: "No worry yourself. We go tell you when your order don land.",
    bg: "#152F18",
    titleColor: "text-white",
    copyColor: "text-white/70",
    Icon: Navigation,
    iconColor: "text-[#FCE900]",
    bubble: "Your rider is on the way",
    bottom: "tracking" as const,
  },
  {
    image: "/assets/fast-delivery.png",
    title: "Fast Delivery",
    copy: "From order to doorstep in minutes. Hot, fresh, and always on time.",
    bg: "#FCE900",
    titleColor: "text-[#152F18]",
    copyColor: "text-[#152F18]/70",
    Icon: CheckCircle2,
    iconColor: "text-[#152F18]",
    bubble: "Your food is almost there!",
    bottom: "plate" as const,
  },
];

const SLIDE_COUNT = features.length;
const AUTO_PLAY_MS = 4000;

/* ─── Card bottom visuals ───────────────────────────────────────── */
const VendorsBottom = () => (
  <div className="flex flex-wrap gap-2 mt-auto pt-3 md:pt-7">
    {[
      { name: "Mama Buka", dist: "0.4 km" },
      { name: "Chef Emeka's", dist: "0.8 km" },
      { name: "Spicy Corner", dist: "1.2 km" },
    ].map((v) => (
      <div
        key={v.name}
        className="flex items-center gap-1.5 md:gap-2 bg-white/15 border border-white/20 rounded-full px-2.5 py-1 md:px-4 md:py-2 text-xs md:text-sm text-white font-semibold"
      >
        <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#FCE900] shrink-0" />
        <span>{v.name}</span>
        <span className="text-white/45">{v.dist}</span>
      </div>
    ))}
  </div>
);

const PlateBottom = () => (
  <div className="mt-auto pt-3 md:pt-7 space-y-2 md:space-y-3">
    <p className="text-[#152F18]/50 text-[10px] md:text-xs font-bold uppercase tracking-widest">
      Your plate
    </p>
    <div className="flex flex-wrap items-center gap-1.5 md:gap-2.5">
      {["Jollof Rice", "Grilled Chicken", "Fried Plantain", "Extra Sauce"].map(
        (item, i, arr) => (
          <div key={item} className="flex items-center gap-1.5 md:gap-2.5">
            <span className="bg-[#152F18] text-white text-xs md:text-sm font-bold px-3 py-1.5 md:px-4 md:py-2 rounded-full">
              {item}
            </span>
            {i < arr.length - 1 && (
              <span className="text-[#152F18] font-extrabold text-sm md:text-base leading-none">+</span>
            )}
          </div>
        )
      )}
    </div>
  </div>
);

const TrackingBottom = () => {
  const steps = [
    { label: "Order placed", Icon: CheckCircle2, done: true, active: false },
    { label: "Being prepared", Icon: Clock, done: true, active: true },
    { label: "On the way", Icon: Navigation, done: false, active: false },
  ];
  return (
    <div className="mt-auto pt-3 md:pt-7 space-y-2 md:space-y-3.5">
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-2.5 md:gap-3.5">
          <div
            className={`w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${step.done ? "bg-[#FCE900]" : "bg-white/10 border border-white/20"
              }`}
          >
            <step.Icon
              className={`w-3.5 h-3.5 md:w-4.5 md:h-4.5 ${step.done ? "text-[#152F18]" : "text-white/35"}`}
            />
          </div>
          <span
            className={`text-xs md:text-sm font-semibold flex-1 ${step.done ? "text-white" : "text-white/35"
              }`}
          >
            {step.label}
          </span>
          {step.active && (
            <span className="text-[10px] md:text-xs font-bold text-[#FCE900] bg-[#FCE900]/15 border border-[#FCE900]/30 rounded-full px-2 py-0.5 md:px-3 md:py-1">
              Now
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

/* ─── Main component ────────────────────────────────────────────── */
const CustomerSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward (right→left), -1 = backward
  const [isPaused, setIsPaused] = useState(false);

  const touchStartX = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % SLIDE_COUNT);
  }, []);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  const goToIndex = useCallback((i: number, current: number) => {
    setDirection(i > current ? 1 : -1);
    setActiveIndex(i);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(goNext, AUTO_PLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goNext]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 50) {
      if (dx > 0) goNext();
      else goPrev();
    }
  };

  const f = features[activeIndex];

  return (
    <>
      <div
        id="customer"
        className="relative h-screen overflow-hidden bg-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Heritage Line Motif Watermark */}
        <HeritageMotif className="text-[#152F18]/[0.02]" />

        {/* ── Prev / Next arrows ── */}
        <button
          onClick={goPrev}
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-[#152F18]" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-[#152F18]" />
        </button>

        {/* ── Content ── */}
        <div className="h-full overflow-hidden bg-white relative z-10">

          {/* Slide counter, left edge */}
          <div className="absolute left-14 md:left-16 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-1.5">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-extrabold text-[#152F18] leading-none"
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <div className="w-px h-10 bg-[#152F18]/20" />
            <span className="text-sm font-bold text-[#152F18]/30">
              {String(SLIDE_COUNT).padStart(2, "0")}
            </span>
          </div>

          {/* ── Content container ── */}
          <div className="h-full flex flex-col pt-16 md:pt-20 pb-4">

            {/* Tag phrase header */}
            <div className="text-center px-4 mb-2 md:mb-5 shrink-0">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#152F18] bg-[#FFF9C4] px-3.5 py-1.5 rounded-full shadow-sm border border-[#152F18]/5">
                INCREDIBLY SIMPLE
              </span>
              <h2 className="text-xl md:text-3xl font-extrabold text-[#152F18] mt-2.5 leading-tight">
                Ordering Naija Food Has Never Been This Easy
              </h2>
            </div>

            {/* ── Grid/Flex Body ── */}
            <div className="flex-1 min-h-0 flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-10 max-w-7xl mx-auto w-full px-4 md:px-16 pb-4 items-center justify-center">

              {/* Left — Phone image (visible on mobile and desktop) */}
              <div className="relative flex items-center justify-center h-[26vh] md:h-full shrink-0">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={activeIndex}
                    src={f.image}
                    alt={f.title}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                      center: { opacity: 1, x: 0 },
                      exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="h-full max-h-[190px] md:max-h-[640px] md:h-[70vh] w-auto object-contain drop-shadow-2xl"
                    loading="eager"
                    decoding="async"
                  />
                </AnimatePresence>

                {/* Thought bubble (hidden on mobile, visible on desktop) */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`bubble-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -4 }}
                    transition={{ delay: 0.38, duration: 0.28, ease: "easeOut" }}
                    className="absolute top-[8%] right-2 md:right-0 bg-white rounded-2xl px-5 py-3.5 shadow-xl border border-gray-100/80 max-w-[210px] z-10 hidden md:block"
                  >
                    <p className="text-sm font-semibold text-[#1A3F1C] leading-snug">
                      {f.bubble}
                    </p>
                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white border-l border-b border-gray-100 rotate-45" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right — Feature card */}
              <div className="relative w-full flex items-center flex-1 md:h-full max-h-[38vh] md:max-h-none">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeIndex}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                      center: { opacity: 1, x: 0 },
                      exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.42, ease: "easeOut" }}
                    className="w-full rounded-3xl p-5 md:p-12 flex flex-col justify-between h-full shadow-lg"
                    style={{
                      background: f.bg,
                    }}
                  >
                    {/* Icon + counter */}
                    <div className="flex items-center gap-3 mb-2 md:mb-7">
                      <div className="w-10 h-10 md:w-14 md:h-14 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
                        <f.Icon className="w-5.5 h-5.5 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className={`text-xs md:text-sm font-bold uppercase tracking-[0.16em] ${f.copyColor}`}>
                        {String(activeIndex + 1).padStart(2, "0")} / {String(SLIDE_COUNT).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-extrabold leading-tight mb-2 md:mb-5 ${f.titleColor}`}
                      style={{ fontSize: "clamp(20px, 3.5vw, 48px)" }}
                    >
                      {f.title}
                    </h3>

                    {/* Copy */}
                    <p className={`text-xs md:text-lg leading-relaxed ${f.copyColor} line-clamp-2 md:line-clamp-none`}>
                      {f.copy}
                    </p>

                    {/* Bottom visual */}
                    {f.bottom === "vendors" && <VendorsBottom />}
                    {f.bottom === "plate" && <PlateBottom />}
                    {f.bottom === "tracking" && <TrackingBottom />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ── Bottom bar: dot indicators ── */}
            <div className="py-4 md:py-8 flex flex-col items-center gap-3 md:gap-4 px-4 shrink-0">

              {/* Dot indicators */}
              <div className="flex items-center gap-2.5">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToIndex(i, activeIndex)}
                    className={`rounded-full transition-all duration-400 ${i === activeIndex
                      ? "w-8 h-2.5 bg-[#152F18]"
                      : "w-2.5 h-2.5 bg-[#152F18]/25 hover:bg-[#152F18]/50"
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default CustomerSection;
