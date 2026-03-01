import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ComingSoonModal from "../modals/ComingSoonDialog";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";
import { ShoppingBag, ArrowRight, Zap, Leaf, BadgeDollarSign } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stats = [
  { icon: Zap, label: "Fast", sub: "Delivery", color: "text-[#FFC727]" },
  { icon: Leaf, label: "Fresh", sub: "Meals", color: "text-[#2C5E2E]" },
  { icon: BadgeDollarSign, label: "Best", sub: "Prices", color: "text-[#25D366]" },
];

const CustomerSection = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="customer" className="bg-[#FFF3E8] py-16 md:py-24 px-4 md:px-8 lg:px-16 text-black overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">

        {/* Text Content */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          className="md:w-1/2 space-y-5"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 bg-[#FFC727]/20 border border-[#FFC727]/40 rounded-full px-4 py-1.5 text-xs font-semibold text-[#1A3F1C]"
          >
            🍔 For Customers
          </motion.div>

          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight">
            Order Fast With<br />
            <span className="text-[#2C5E2E]">OunjeFood!</span>
          </motion.h2>

          <motion.p variants={fadeUp} className="text-base md:text-lg text-gray-600 leading-relaxed">
            Stressed to cook? Too busy to step out? Don't want to break your bank?
            Place your order in seconds — fresh meals, fast delivery, right to your door.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 pt-2">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsOrderOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-7 py-3.5 rounded-2xl shadow-md hover:bg-[#1fb855] transition text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Now via WhatsApp
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsWaitlistOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#FFC727] text-[#1A3F1C] font-bold px-7 py-3.5 rounded-2xl shadow-md hover:bg-[#ffda55] transition text-sm"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="flex gap-5 pt-2">
            {stats.map(({ icon: Icon, label, sub, color }) => (
              <div key={label} className="flex items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
                <Icon className={`w-5 h-5 ${color}`} />
                <div>
                  <p className="text-sm font-bold text-[#1A3F1C] leading-none">{label}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-1/2 relative h-[400px] md:h-[500px] w-full"
        >
          {/* Background blob */}
          <div className="absolute w-full h-full bg-yellow-300 rounded-full z-0 blur-2xl opacity-20" />

          {/* Monitor */}
          <img
            src="/icons/monitor.png"
            alt="Monitor"
            className="absolute w-64 md:w-80 z-20 left-1/5 bottom-0 lg:h-[228px] lg:w-[400px]"
          />

          {/* Arm — behind monitor (z-10), slides right so box emerges from screen edge */}
          <motion.img
            src="/icons/arm.png"
            alt="Arm with box"
            initial={{ x: 0, opacity: 0 }}
            animate={isInView ? {
              x: [0, 80, 80, 0],
              opacity: [0, 1, 1, 0],
            } : { x: 0, opacity: 0 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
              repeatDelay: 1,
            }}
            className="absolute w-20 md:w-40 z-10 left-[7.5%] md:left-[10%] top-[65%] md:top-[50%] origin-bottom-left"
          />

          {/* Woman */}
          <motion.img
            src="/icons/woman.png"
            alt="Woman"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute w-48 md:w-64 z-10 right-10 md:right-30 bottom-0"
          />

          {/* Bubble */}
          <motion.img
            src="/icons/bubble.png"
            alt="bubble"
            animate={{ scale: [1, 1.05, 1], y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute w-[60px] md:w-[100px] z-10 right-[148px] md:right-[170px] bottom-[158px] md:bottom-[205px]"
          />

          {/* Floating WhatsApp badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-2 md:top-8 md:right-0 bg-[#25D366] text-white text-xs font-bold px-3 py-2 rounded-2xl shadow-lg z-30 flex items-center gap-1.5"
          >
            <span>📲</span> Order via WhatsApp
          </motion.div>
        </motion.div>
      </div>

      <ComingSoonModal isOpen={isWaitlistOpen} onClose={() => setIsWaitlistOpen(false)} />
      <WhatsAppOrderModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </section>
  );
};

export default CustomerSection;
