import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Utensils, Store, Bike, Banknote } from "lucide-react";

const features = [
  {
    Icon: Utensils,
    title: "Local Flavours",
    desc: "From Jollof rice to Amala, we celebrate Nigeria's rich food culture.",
    bg: "#2C5E2E",
    iconBg: "rgba(255,255,255,0.15)",
    iconColor: "#FFC727",
    textColor: "text-white",
    descColor: "text-white/70",
  },
  {
    Icon: Store,
    title: "Trusted Vendors",
    desc: "We partner with home chefs and local food spots you already love.",
    bg: "#FFC727",
    iconBg: "rgba(26,63,28,0.12)",
    iconColor: "#1A3F1C",
    textColor: "text-[#1A3F1C]",
    descColor: "text-[#1A3F1C]/65",
  },
  {
    Icon: Bike,
    title: "Fast Delivery",
    desc: "Our riders bring your meal right to your doorstep, hot and fresh.",
    bg: "#1A3F1C",
    iconBg: "rgba(255,255,255,0.12)",
    iconColor: "#FFC727",
    textColor: "text-white",
    descColor: "text-white/70",
  },
  {
    Icon: Banknote,
    title: "Affordable Prices",
    desc: "Good food shouldn't break the bank. Eat well, spend less.",
    bg: "#ECFFED",
    iconBg: "rgba(44,94,46,0.1)",
    iconColor: "#2C5E2E",
    textColor: "text-[#1A3F1C]",
    descColor: "text-[#1A3F1C]/60",
  },
];

export default function AboutOunje() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="px-4 py-20 overflow-hidden bg-white md:py-32 md:px-8 lg:px-16"
    >
      <div className="max-w-6xl mx-auto">
        {/* ── Top text block ── */}
        <div className="grid items-start grid-cols-1 gap-12 mb-20 lg:grid-cols-2 md:gap-20">
          {/* Left — brand statement */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2C5E2E]/60 mb-4">
              Who we are
            </p>
            <h2
              className="font-extrabold text-[#1A3F1C] leading-[1.0] mb-6"
              style={{ fontSize: "clamp(44px, 7vw, 88px)" }}
            >
              Built for
              <br />
              everyday
              <br />
              <span className="text-[#2C5E2E]">Nigerians.</span>
            </h2>
            {/* Accent bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="h-1.5 w-20 bg-[#FFC727] rounded-full origin-left"
            />
          </motion.div>

          {/* Right — body copy */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex flex-col gap-6 pt-2 lg:pt-12"
          >
            <p className="text-[#1A3F1C]/75 text-base md:text-lg leading-relaxed">
              OUNJEFOOD connects you to your favourite local food vendors
              quickly, affordably, and the way you like it. Born from the need
              for generous, affordable meals, OUNJEFOOD lets you build your own
              plate — just like at your favourite buka.
            </p>
            <p className="text-[#1A3F1C]/75 text-base md:text-lg leading-relaxed">
              We work with trusted home chefs and food spots, giving them a way
              to serve you better while keeping things simple and local. From
              Pidgin support to seamless delivery, OUNJEFOOD is built for you.
            </p>
            <p className="text-xl md:text-2xl font-extrabold text-[#2C5E2E] leading-snug">
              "Na food wey go belleful you."
            </p>
          </motion.div>
        </div>

        {/* ── Feature cards ── */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 + i * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.22 } }}
              className="flex flex-col gap-4 cursor-default rounded-3xl p-7"
              style={{ background: f.bg }}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center w-12 h-12 rounded-2xl shrink-0"
                style={{ background: f.iconBg }}
              >
                <f.Icon className="w-6 h-6" style={{ color: f.iconColor }} />
              </div>

              {/* Text */}
              <div>
                <h3
                  className={`font-extrabold text-lg mb-2 leading-tight ${f.textColor}`}
                >
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed ${f.descColor}`}>
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
