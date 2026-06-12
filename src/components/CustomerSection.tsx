import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ComingSoonModal from "../modals/ComingSoonDialog";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";
import {
  ShoppingBag,
  Bell,
  MapPin,
  UtensilsCrossed,
  Navigation,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Download,
} from "lucide-react";

/* ─── Feature data ─────────────────────────────────────────────── */
const features = [
  {
    image: "/assets/vendors-near-you.png",
    title: "Vendors Near You",
    copy: "Order Authentic Naija food from vendors closeby. You no go pay plenty for delivery.",
    bg: "#2C5E2E",
    titleColor: "text-white",
    copyColor: "text-white/70",
    Icon: MapPin,
    iconColor: "text-[#FFC727]",
    bubble: "Your nearest buka is just around the corner",
    bottom: "vendors" as const,
  },
  {
    image: "/assets/build-a-plate.png",
    title: "Build a Plate",
    copy: "An interactive and fun way to make your meal. Sidon arrange am like say you dey the vendor place.",
    bg: "#FFC727",
    titleColor: "text-[#1A3F1C]",
    copyColor: "text-[#1A3F1C]/70",
    Icon: UtensilsCrossed,
    iconColor: "text-[#2C5E2E]",
    bubble: "Make am exactly how you want am",
    bottom: "plate" as const,
  },
  {
    image: "/assets/order-tracking.png",
    title: "Track Your Order",
    copy: "No worry yourself. We go tell you when your order don land.",
    bg: "#1A3F1C",
    titleColor: "text-white",
    copyColor: "text-white/70",
    Icon: Navigation,
    iconColor: "text-[#FFC727]",
    bubble: "Your rider is on the way",
    bottom: "tracking" as const,
  },
  {
    image: "/assets/fast-delivery.png",
    title: "Fast Delivery",
    copy: "From order to doorstep in minutes. Hot, fresh, and always on time.",
    bg: "#FFC727",
    titleColor: "text-[#1A3F1C]",
    copyColor: "text-[#1A3F1C]/70",
    Icon: CheckCircle2,
    iconColor: "text-[#2C5E2E]",
    bubble: "Your food is almost there!",
    bottom: "plate" as const,
  },
];

const SLIDE_COUNT = features.length;
const AUTO_PLAY_MS = 4000;

/* ─── Card bottom visuals ───────────────────────────────────────── */
const VendorsBottom = () => (
  <div className="flex flex-wrap gap-2.5 mt-auto pt-7">
    {[
      { name: "Mama Buka", dist: "0.4 km" },
      { name: "Chef Emeka's", dist: "0.8 km" },
      { name: "Spicy Corner", dist: "1.2 km" },
    ].map((v) => (
      <div
        key={v.name}
        className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2"
      >
        <MapPin className="w-3.5 h-3.5 text-[#FFC727] shrink-0" />
        <span className="text-white text-sm font-semibold">{v.name}</span>
        <span className="text-white/45 text-sm">{v.dist}</span>
      </div>
    ))}
  </div>
);

const PlateBottom = () => (
  <div className="mt-auto pt-7 space-y-3">
    <p className="text-[#1A3F1C]/50 text-xs font-bold uppercase tracking-widest">
      Your plate
    </p>
    <div className="flex flex-wrap items-center gap-2.5">
      {["Jollof Rice", "Grilled Chicken", "Fried Plantain", "Extra Sauce"].map(
        (item, i, arr) => (
          <div key={item} className="flex items-center gap-2.5">
            <span className="bg-[#2C5E2E] text-white text-sm font-bold px-4 py-2 rounded-full">
              {item}
            </span>
            {i < arr.length - 1 && (
              <span className="text-[#2C5E2E] font-extrabold text-base leading-none">+</span>
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
    <div className="mt-auto pt-7 space-y-3.5">
      {steps.map((step) => (
        <div key={step.label} className="flex items-center gap-3.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${step.done ? "bg-[#FFC727]" : "bg-white/10 border border-white/20"
              }`}
          >
            <step.Icon
              className={`w-4.5 h-4.5 ${step.done ? "text-[#1A3F1C]" : "text-white/35"}`}
            />
          </div>
          <span
            className={`text-sm font-semibold flex-1 ${step.done ? "text-white" : "text-white/35"
              }`}
          >
            {step.label}
          </span>
          {step.active && (
            <span className="text-xs font-bold text-[#FFC727] bg-[#FFC727]/15 border border-[#FFC727]/30 rounded-full px-3 py-1">
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
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
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
        {/* ── Prev / Next arrows ── */}
        <button
          onClick={goPrev}
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 text-[#2C5E2E]" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/80 shadow-md flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 text-[#2C5E2E]" />
        </button>

        {/* ── Content ── */}
        <div className="h-full overflow-hidden bg-white">

          {/* Slide counter, left edge */}
          <div className="absolute left-14 md:left-16 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-1.5">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-4xl font-extrabold text-[#2C5E2E] leading-none"
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
            <div className="w-px h-10 bg-[#2C5E2E]/20" />
            <span className="text-sm font-bold text-[#2C5E2E]/30">
              {String(SLIDE_COUNT).padStart(2, "0")}
            </span>
          </div>

          {/* ── Content grid ── */}
          <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 max-w-7xl mx-auto w-full px-4 md:px-16 pt-8 md:pt-14 pb-4 items-center">

              {/* Left — Phone image (hidden on mobile) */}
              <div className="relative hidden md:flex items-center justify-center h-full">
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
                    className="h-[54vh] md:h-[70vh] max-h-[640px] w-auto object-contain drop-shadow-2xl"
                    loading="eager"
                    decoding="async"
                  />
                </AnimatePresence>

                {/* Thought bubble */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`bubble-${activeIndex}`}
                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, y: -4 }}
                    transition={{ delay: 0.38, duration: 0.28, ease: "easeOut" }}
                    className="absolute top-[8%] right-2 md:right-0 bg-white rounded-2xl px-5 py-3.5 shadow-xl border border-gray-100/80 max-w-[210px] z-10"
                  >
                    <p className="text-sm font-semibold text-[#1A3F1C] leading-snug">
                      {f.bubble}
                    </p>
                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white border-l border-b border-gray-100 rotate-45" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right — Feature card */}
              <div className="relative h-full flex items-center col-span-1">
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
                    className="w-full rounded-3xl p-6 md:p-12 flex flex-col"
                    style={{
                      background: f.bg,
                      minHeight: "min(62vh, 500px)",
                    }}
                  >
                    {/* Icon + counter */}
                    <div className="flex items-center gap-3 mb-7">
                      <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center shrink-0">
                        <f.Icon className={`w-7 h-7 ${f.iconColor}`} />
                      </div>
                      <span className={`text-sm font-bold uppercase tracking-[0.16em] ${f.copyColor}`}>
                        {String(activeIndex + 1).padStart(2, "0")} / {String(SLIDE_COUNT).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-extrabold leading-tight mb-5 ${f.titleColor}`}
                      style={{ fontSize: "clamp(32px, 4.5vw, 56px)" }}
                    >
                      {f.title}
                    </h3>

                    {/* Copy */}
                    <p className={`text-lg md:text-xl leading-relaxed ${f.copyColor}`}>
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

            {/* ── Bottom bar: dot indicators + CTAs ── */}
            <div className="py-5 md:py-8 flex flex-col items-center gap-3 md:gap-4 px-4">

              {/* Dot indicators */}
              <div className="flex items-center gap-2.5">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToIndex(i, activeIndex)}
                    className={`rounded-full transition-all duration-400 ${i === activeIndex
                        ? "w-8 h-2.5 bg-[#2C5E2E]"
                        : "w-2.5 h-2.5 bg-[#2C5E2E]/25 hover:bg-[#2C5E2E]/50"
                      }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsWaitlistOpen(true)}
                  className="flex items-center gap-2.5 bg-[#2C5E2E] text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-[#1a3f1c] transition-colors text-base cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-[#FFC727]" />
                  Download Customer App
                </motion.button>

                <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="group flex items-center gap-2 text-[#1A3F1C] font-bold bg-[#FFC727]/10 hover:bg-[#FFC727]/25 border border-[#FFC727]/30 px-6 py-3.5 rounded-2xl transition-colors text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#2C5E2E]" />
                  Download Vendor & Rider App
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <ComingSoonModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <WhatsAppOrderModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
};

export default CustomerSection;
