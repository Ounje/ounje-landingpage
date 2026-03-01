import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, ArrowRight, TrendingUp, Zap } from "lucide-react";

const scrollToJoinUs = () => {
  const el = document.getElementById("joinUs");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const benefits = [
  { icon: "💵", text: "Earn daily on your own schedule" },
  { icon: "🛵", text: "Flexible hours — you choose when to ride" },
  { icon: "📍", text: "Deliver in your local area" },
  { icon: "🤝", text: "Full support from the Ounje team" },
];

const RiderSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="rider" className="bg-[#FFF3E8] py-16 md:py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div ref={ref} className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative h-[380px] md:h-[580px] w-full order-2 md:order-1 flex items-end justify-center"
        >
          {/* Background blobs */}
          <div className="absolute inset-0 bg-[#2C5E2E]/15 rounded-full blur-3xl scale-75 pointer-events-none" />
          <div className="absolute bottom-0 right-[10%] w-48 h-48 bg-[#FFC727]/25 rounded-full blur-3xl pointer-events-none" />

          {/* Phone screen — main hero visual */}
          <motion.img
            src="/images/rider-screen.png"
            alt="Rider app screen"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ opacity: { duration: 0.6, delay: 0.1 }, scale: { duration: 0.6, delay: 0.1 } }}
            className="relative z-10 h-[380px] md:h-[540px] lg:h-[620px] w-auto object-contain drop-shadow-2xl"
          />

          {/* Delivery guy — slides across */}
          <motion.img
            src="/images/delivery-guy.png"
            alt="Delivery rider"
            initial={{ x: -40, opacity: 0 }}
            animate={isInView ? {
              x: [-40, 40, -40],
              opacity: 1,
            } : {}}
            transition={{
              x: { duration: 5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5, delay: 0.5 },
              opacity: { duration: 0.4, delay: 0.5 },
            }}
            className="%] left-[10%] z-20 w-[220px] md:w-[230px] lg:w-[280px] h-auto object-contain drop-shadow-xl"
          />

          {/* Earn Daily badge — top right float */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-0 md:top-8 md:-right-2 bg-[#2C5E2E] text-white rounded-2xl px-4 py-3 shadow-xl z-30 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#FFC727]" />
            <span className="text-xs md:text-sm font-bold">Earn Daily</span>
          </motion.div>

          {/* Fast delivery badge — mid right */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute bottom-[55%] right-0 md:-right-2 bg-white rounded-2xl px-4 py-3 shadow-lg z-30 flex items-center gap-2 border border-gray-100"
          >
            <Zap className="w-4 h-4 text-[#FFC727]" />
            <span className="text-xs md:text-sm font-bold text-[#1A3F1C]">Fast Delivery</span>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:w-1/2 space-y-6 order-1 md:order-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#2C5E2E]/10 border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2C5E2E]"
          >
            🛵 For Riders
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight"
          >
            Join the Ounje<br />
            <span className="text-[#2C5E2E]">Rider Force!</span><br />
            Deliver Happiness.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-gray-600 leading-relaxed"
          >
            Earn daily on your schedule. Deliver meals, make lives easier,
            and become a trusted part of the OUNJE network.
          </motion.p>

          {/* Benefits */}
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-gray-100"
              >
                <span className="text-xl flex-shrink-0">{b.icon}</span>
                <span className="text-sm font-medium text-gray-700 flex-1">{b.text}</span>
                <CheckCircle2 className="w-4 h-4 text-[#2C5E2E] flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={scrollToJoinUs}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-[#2C5E2E] text-white font-bold px-7 py-3.5 rounded-2xl shadow-md hover:bg-[#1a3f1c] transition text-sm"
          >
            Become a Rider
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default RiderSection;
