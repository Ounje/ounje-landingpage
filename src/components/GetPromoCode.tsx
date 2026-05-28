import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Gift,
  ArrowRight,
  Sparkles,
  MessageCircle,
  BadgePercent,
  PartyPopper,
} from "lucide-react";

const WHATSAPP_NUMBER = "2348123358739";

function buildWhatsAppLink(): string {
  const msg = encodeURIComponent(
    `Hi OunjeFood! 👋\nI'd like to create my own personalised promo code.\nPlease help me set it up so I can start saving on my orders and sharing with friends! 🎉`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

// ── Floating food emojis ──────────────────────────────────────────────────────
const FLOATERS = ["🍛", "🌶️", "🍖", "🥘", "🍜", "🌽", "🍗", "🥗"];

const FloatingEmoji = ({
  emoji,
  delay,
  x,
  y,
}: {
  emoji: string;
  delay: number;
  x: string;
  y: string;
}) => (
  <motion.span
    className="absolute text-2xl md:text-3xl pointer-events-none select-none"
    style={{ left: x, top: y }}
    animate={{ y: [0, -14, 0], rotate: [-5, 5, -5], opacity: [0.2, 0.45, 0.2] }}
    transition={{ duration: 4.5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {emoji}
  </motion.span>
);

// ── Perk badge ────────────────────────────────────────────────────────────────
const Perk = ({
  icon,
  text,
  delay,
  isInView,
}: {
  icon: React.ReactNode;
  text: string;
  delay: number;
  isInView: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay }}
    className="flex items-center gap-3 bg-white/8 border border-white/12 rounded-2xl px-4 py-3"
  >
    <div className="w-8 h-8 rounded-xl bg-[#FFC727]/20 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <span className="text-white/80 text-sm font-medium">{text}</span>
  </motion.div>
);

// ── Main component ────────────────────────────────────────────────────────────
const GetPromo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const handleGetPromo = () => {
    window.open(buildWhatsAppLink(), "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="getPromo"
      ref={ref}
      className="relative py-16 md:py-24 px-4 md:px-8 overflow-hidden"
      style={{ background: "linear-gradient(180deg, #1A3F1C 0%, #0f2e12 100%)" }}
    >
      {/* Floating food emojis */}
      {FLOATERS.map((emoji, i) => (
        <FloatingEmoji
          key={i}
          emoji={emoji}
          delay={i * 0.55}
          x={`${(i % 4) * 26 + 2}%`}
          y={`${(i % 3) * 28 + 8}%`}
        />
      ))}

      {/* Floating gold dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#FFC727]"
            style={{ left: `${(i * 17 + 5) % 100}%`, top: `${(i * 23 + 10) % 80}%` }}
            animate={{ opacity: [0, 0.5, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-[#FFC727]/20 border border-[#FFC727]/40 rounded-full px-4 py-1.5 text-xs font-bold text-[#FFC727] uppercase tracking-widest mb-5">
            <Gift className="w-3.5 h-3.5" /> Exclusive Promo
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4">
            Get Your Own Code,
            <br />
            <span className="text-[#FFC727]">Eat for Less.</span>
          </h2>

          <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Request your own personalised promo code, every time anyone orders with it, they get a
            <span className="text-[#FFC727] font-bold"> discount on their meal & you get rewarded</span>. Share it,
            save it, and keep the rewards coming.
          </p>
        </motion.div>

        {/* ── Two column layout ── */}
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-center">

          {/* Left, card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="w-full lg:max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

              {/* Card top bar */}
              <div className="bg-[#2C5E2E] px-6 py-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-[#FFC727] rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-[#1A3F1C]" />
                </div>
                <div>
                  <p className="text-white font-extrabold text-sm">Get Your Promo Code</p>
                  <p className="text-white/55 text-xs">Free · Personalised · Instant</p>
                </div>
              </div>

              <div className="px-6 py-7 space-y-5">

                {/* Explainer */}
                <div className="bg-[#ECFFED] rounded-2xl px-5 py-4 space-y-2">
                  {[
                    "Your code, your identity",
                    "Discounts on every order",
                    "Share it, earn from it",
                    "Rewards that keep giving"
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#2C5E2E] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[#1A3F1C] text-sm font-medium">{step}</span>
                    </div>
                  ))}
                </div>

                {/* Main CTA button */}
                <motion.button
                  onClick={handleGetPromo}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#1fb855] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Get Your Promo Code 
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

              </div>
            </div>

            <p className="text-center text-xs text-white/30 mt-4 leading-relaxed px-2">
              Promo codes are free, personalised to you, and verified by our team.
              Share yours with friends, the more they order, the more you earn.
            </p>
          </motion.div>

          {/* Right, perks */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full lg:max-w-sm space-y-4 lg:pt-2"
          >
            <p className="text-white/45 text-xs font-bold uppercase tracking-widest mb-4">
              Why get a promo code?
            </p>

            <Perk
              icon={<BadgePercent className="w-4 h-4 text-[#FFC727]" />}
              text="Every order with your code earns you a reward"
              delay={0.3}
              isInView={isInView}
            />
            <Perk
              icon={<PartyPopper className="w-4 h-4 text-[#FFC727]" />}
              text="Your code is yours, unique to your name"
              delay={0.4}
              isInView={isInView}
            />
            <Perk
              icon={<MessageCircle className="w-4 h-4 text-[#FFC727]" />}
              text="Our team creates and verifies it for you on WhatsApp"
              delay={0.5}
              isInView={isInView}
            />
            <Perk
              icon={<Gift className="w-4 h-4 text-[#FFC727]" />}
              text="Share with friends, they get a discount, you get rewarded"
              delay={0.6}
              isInView={isInView}
            />

            
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default GetPromo;