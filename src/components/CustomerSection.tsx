import { useRef, useState, useEffect } from "react";
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
  ChevronDown,
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
];

const SLIDE_COUNT = features.length;

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
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              step.done ? "bg-[#FFC727]" : "bg-white/10 border border-white/20"
            }`}
          >
            <step.Icon
              className={`w-4.5 h-4.5 ${step.done ? "text-[#1A3F1C]" : "text-white/35"}`}
            />
          </div>
          <span
            className={`text-sm font-semibold flex-1 ${
              step.done ? "text-white" : "text-white/35"
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
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const sectionRef = useRef<HTMLDivElement>(null);
  // Mutable ctrl ref avoids stale closures inside event handlers
  const ctrl = useRef({ active: false, idx: 0, accum: 0, touchY: 0, cooldown: false });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const c = ctrl.current;

    // Advance exactly one slide, then block further advances for 650 ms
    const goTo = (next: number, dir: number) => {
      if (next === c.idx || c.cooldown) return;
      c.cooldown = true;
      c.accum = 0;
      c.idx = next;
      setDirection(dir);
      setActiveIndex(next);
      setTimeout(() => { c.cooldown = false; }, 650);
    };

    /* ── Wheel (desktop) ── */
    const onWheel = (e: WheelEvent) => {
      if (!c.active) return;

      if (e.deltaY < 0 && c.idx === 0) { c.active = false; return; } // exit top
      if (e.deltaY > 0 && c.idx === SLIDE_COUNT - 1) {               // exit bottom
        e.preventDefault();
        if (!c.cooldown) {
          c.accum += e.deltaY;
          if (c.accum >= 250) { c.active = false; c.accum = 0; }
        }
        return;
      }

      e.preventDefault();
      if (c.cooldown) return; // absorb scroll during transition

      c.accum += e.deltaY;
      if (Math.abs(c.accum) >= 80) {
        const dir = c.accum > 0 ? 1 : -1;
        goTo(Math.min(SLIDE_COUNT - 1, Math.max(0, c.idx + dir)), dir);
      }
    };

    /* ── Touch (mobile) ── */
    const onTouchStart = (e: TouchEvent) => { c.touchY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (!c.active) return;
      const dy = c.touchY - e.touches[0].clientY; // positive = swipe up = scroll down

      if (dy < 0 && c.idx === 0)                        { c.active = false; return; }
      if (dy > 0 && c.idx === SLIDE_COUNT - 1) {
        e.preventDefault();
        if (!c.cooldown) {
          c.accum += Math.abs(dy);
          if (c.accum >= 120) { c.active = false; c.accum = 0; }
        }
        c.touchY = e.touches[0].clientY;
        return;
      }

      e.preventDefault();
      if (c.cooldown) { c.touchY = e.touches[0].clientY; return; }

      c.accum += dy;
      if (Math.abs(c.accum) >= 60) {
        const dir = c.accum > 0 ? 1 : -1;
        goTo(Math.min(SLIDE_COUNT - 1, Math.max(0, c.idx + dir)), dir);
      }
      c.touchY = e.touches[0].clientY;
    };

    /* ── IntersectionObserver: snap section to top and activate lock ── */
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.95) {
          const top = Math.round(section.getBoundingClientRect().top);
          if (top !== 0) window.scrollTo({ top: window.scrollY + top });
          c.active = true;
          c.accum = 0;
        } else if (!entry.isIntersecting) {
          c.active = false;
        }
      },
      { threshold: [0, 0.95, 1] }
    );
    observer.observe(section);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const f = features[activeIndex];

  return (
    <>
      <div
        ref={sectionRef}
        id="customer"
        className="relative h-screen overflow-hidden bg-white"
        style={{ scrollSnapAlign: "start" }}
      >
        {/* ── Content (fills the 100vh section) ── */}
        <div className="h-full overflow-hidden bg-white">

          {/* Vertical scroll-progress bar — right edge */}
          <div className="absolute right-5 md:right-7 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3.5 z-20">
            {features.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-500 ${
                  i === activeIndex
                    ? "w-2 h-10 bg-[#2C5E2E]"
                    : i < activeIndex
                    ? "w-1.5 h-4 bg-[#2C5E2E]/50"
                    : "w-1.5 h-4 bg-[#2C5E2E]/20"
                }`}
              />
            ))}
          </div>

          {/* Slide counter — left edge */}
          <div className="absolute left-5 md:left-7 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-1.5">
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
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-7xl mx-auto w-full px-6 md:px-16 pt-14 pb-2 items-center">

              {/* Left — Phone */}
              <div className="relative flex items-center justify-center h-full">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={activeIndex}
                    src={f.image}
                    alt={f.title}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, y: d * 40 }),
                      center: { opacity: 1, y: 0 },
                      exit: (d: number) => ({ opacity: 0, y: d * -40 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="h-[54vh] md:h-[70vh] max-h-[640px] w-auto object-contain drop-shadow-2xl"
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
                    {/* Tail */}
                    <div className="absolute top-3 -left-1.5 w-3 h-3 bg-white border-l border-b border-gray-100 rotate-45" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right — Feature card */}
              <div className="relative h-full flex items-center">
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
                    className="w-full rounded-3xl p-8 md:p-12 flex flex-col"
                    style={{
                      background: f.bg,
                      minHeight: "min(68vh, 600px)",
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

            {/* ── Bottom bar: CTAs + scroll hint ── */}
            <div className="pb-6 md:pb-8 flex flex-col items-center gap-3 px-4">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsOrderOpen(true)}
                  className="flex items-center gap-2.5 bg-[#25D366] text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-[#1fb855] transition-colors text-base"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Order Now via WhatsApp
                </motion.button>

                <button
                  onClick={() => setIsWaitlistOpen(true)}
                  className="group flex items-center gap-1.5 text-[#1A3F1C]/55 text-sm font-semibold hover:text-[#2C5E2E] transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  Get notified when the app launches
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </div>

              {/* Scroll hint — only on the last slide show a "keep scrolling" cue */}
              <AnimatePresence>
                {activeIndex < SLIDE_COUNT - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1.5 text-[#2C5E2E]/35 text-xs font-semibold"
                  >
                    <motion.div
                      animate={{ y: [0, 3, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                    Scroll to see more
                  </motion.div>
                )}
              </AnimatePresence>
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
