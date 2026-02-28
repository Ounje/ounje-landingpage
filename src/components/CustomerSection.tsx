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
          className="md:w-1/2 relative h-[320px] md:h-[480px] w-full"
        >
          {/* Background blob */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[#FFC727]/20 rounded-full blur-3xl scale-75"
          />

          {/* Monitor — behind the arm */}
          <img
            src="/public/icons/monitor.png"
            alt="Monitor"
            className="absolute bottom-0 left-[5%] z-10 w-48 md:w-72 lg:w-80 object-contain"
          />

          {/* Arm — slides out from monitor screen horizontally, holds, slides back in */}
          <motion.img
            src="/public/icons/arm.png"
            alt="Arm with box"
            initial={{ x: -100, opacity: 0 }}
            animate={isInView ? {
              x: [-100, 0, 0, -100],
              opacity: [0, 1, 1, 0],
            } : { x: -100, opacity: 0 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0],
              repeatDelay: 1,
            }}
            className="absolute z-20 w-16 md:w-28 lg:w-32 object-contain"
            style={{ left: "32%", bottom: "18%" }}
          />

          {/* Woman */}
          <motion.img
            src="/public/icons/woman.png"
            alt="Woman ordering"
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-0 right-4 md:right-8 z-10 w-36 md:w-56 lg:w-64 object-contain"
          />

          {/* Speech bubble */}
          <motion.img
            src="/public/icons/bubble.png"
            alt="Order bubble"
            animate={{ scale: [1, 1.05, 1], y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute z-20 right-[120px] md:right-[160px] bottom-[48%] md:bottom-[52%] w-12 md:w-20 object-contain"
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
