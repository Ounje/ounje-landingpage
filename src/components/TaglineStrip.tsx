import { motion } from "framer-motion";
import { Zap, Leaf, Wallet, UtensilsCrossed, Navigation, Headphones, Clock, Star } from "lucide-react";

const items = [
  { text: "Order Fast", Icon: Zap, iconColor: "#FFC727" },
  { text: "Eat Fresh", Icon: Leaf, iconColor: "#4ade80" },
  { text: "Spend Less", Icon: Wallet, iconColor: "#a78bfa" },
  { text: "Local Flavours", Icon: UtensilsCrossed, iconColor: "#fb923c" },
  { text: "Live Order Tracking", Icon: Navigation, iconColor: "#34d399" },
  { text: "Highly Rated Riders", Icon: Star, iconColor: "#f472b6" },
  { text: "24/7 Support", Icon: Headphones, iconColor: "#60a5fa" },
  { text: "Delivered in Minutes", Icon: Clock, iconColor: "#fbbf24" },
];

// Duplicate for seamless loop
const ticker = [...items, ...items];

const TaglineStrip = () => {
  return (
    <div className="bg-[#1A3F1C] py-4 overflow-hidden select-none">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex items-center gap-3 whitespace-nowrap will-change-transform px-3"
      >
        {ticker.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl shrink-0"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
          >
            <item.Icon
              style={{ color: item.iconColor }}
              className="w-4 h-4 shrink-0"
              strokeWidth={2}
            />
            <span className="text-white/90 text-sm font-semibold">
              {item.text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TaglineStrip;
