import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const perks = [
  { icon: "📱", title: "Orders to Your Phone", desc: "Customers find you and place orders directly — you just cook." },
  { icon: "🛵", title: "We Handle Delivery", desc: "Our riders pick up and deliver. You focus 100% on the food." },
  { icon: "💰", title: "Grow Your Income", desc: "Reach more customers without a big shop or expensive setup." },
];

const VendorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="vendor" className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-[#ECFFED] overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <span className="inline-flex items-center gap-2 bg-[#2C5E2E]/10 border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2C5E2E]">
            🏪 For Vendors
          </span>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight mb-4">
            We Bring The Orders<br />
            <span className="text-[#2C5E2E]">Right To You</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            No need for a big shop or fancy tech. With OUNJE FOOD, customers find you,
            place their orders, and we handle the rest — from pickup to delivery.
          </p>
        </motion.div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-[#2C5E2E]/10 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[#ECFFED] rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm">
                {perk.icon}
              </div>
              <h3 className="font-extrabold text-[#1A3F1C] text-base mb-2 leading-tight">{perk.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Frame image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="relative w-full md:max-w-2xl">
            <div className="absolute -inset-4 bg-[#FFC727]/10 rounded-3xl blur-xl" />
            <img
              src="/frames/Frame 204.png"
              alt="Vendor using OunjeFood"
              className="relative z-10 rounded-3xl shadow-xl max-w-full w-full"
            />
            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 md:top-6 md:-right-8 bg-[#2C5E2E] text-white rounded-2xl px-4 py-3 shadow-xl z-20 text-sm font-bold"
            >
              🍳 Just Cook. We Deliver!
            </motion.div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-4 md:bottom-6 md:-left-8 bg-[#FFC727] text-[#1A3F1C] rounded-2xl px-4 py-3 shadow-xl z-20 text-sm font-bold"
            >
              📦 More Customers Daily
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VendorSection;
