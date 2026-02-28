import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  { icon: "🍛", title: "Local Flavours", desc: "From Jollof rice to Amala, we celebrate Nigeria's rich food culture." },
  { icon: "🏪", title: "Trusted Vendors", desc: "We partner with home chefs and local food spots you already love." },
  { icon: "🛵", title: "Fast Delivery", desc: "Our riders bring your meal right to your doorstep, hot and fresh." },
  { icon: "💰", title: "Affordable Prices", desc: "Good food shouldn't break the bank. Eat well, spend less." },
];

export default function AboutOunje() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 md:py-24 px-4 md:px-8 lg:px-16 bg-white">
      <div className="max-w-5xl mx-auto">

        {/* Top heading block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2C5E2E] mb-6 leading-tight">
            OunjeFood
          </h2>

          {/* Two-column text on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-[#1A3F1C]/80 text-sm md:text-base leading-relaxed"
            >
              OUNJE connects you to your favourite local food vendors quickly, affordably,
              and the way you like it. Born from the need for generous, affordable meals,
              OUNJE lets you build your own plate — just like at your favourite buka.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[#1A3F1C]/80 text-sm md:text-base leading-relaxed"
            >
              We work with trusted home chefs and food spots, giving them a way to serve
              you better while keeping things simple and local. From Pidgin support to
              seamless delivery, OUNJE is built for everyday Nigerians who want good
              food without the stress. <span className="font-semibold text-[#2C5E2E]">Na food wey go belleful you.</span>
            </motion.p>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-[#ECFFED] border border-[#2C5E2E]/10 rounded-2xl p-5 text-center hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-[#1A3F1C] text-sm mb-1.5">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
