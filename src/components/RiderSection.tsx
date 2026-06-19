import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Zap,
  Banknote,
  Bike,
  MapPin,
  HeartHandshake,
} from "lucide-react";

const benefits = [
  { icon: Banknote, text: "Earn daily on your own schedule" },
  { icon: Bike, text: "Flexible hours, you choose when to ride" },
  { icon: MapPin, text: "Deliver in your local area" },
  { icon: HeartHandshake, text: "Full support from the Ounje team" },
];

const RiderSection = () => {
  const navigate = useNavigate();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="rider"
      className="bg-[#ECFFED] py-16 md:py-24 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      <div
        ref={ref}
        className="flex flex-col items-center max-w-6xl gap-12 mx-auto md:flex-row"
      >
        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 relative h-[380px] md:h-[580px] w-full order-2 md:order-1 flex items-end justify-center"
        >
          {/* Phone screen */}
          <motion.img
            src="/images/rider-screen.png"
            alt="Rider app screen"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              opacity: { duration: 0.6, delay: 0.1 },
              scale: { duration: 0.6, delay: 0.1 },
            }}
            className="relative z-10 h-[380px] md:h-[540px] lg:h-[620px] w-auto object-contain drop-shadow-2xl"
          />

          {/* Delivery guy, slides across */}
          <motion.img
            src="/images/delivery-guy.png"
            alt="Delivery rider"
            initial={{ x: -40, opacity: 0 }}
            animate={isInView ? { x: [-40, 40, -40], opacity: 1 } : {}}
            transition={{
              x: {
                duration: 5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 0.5,
              },
              opacity: { duration: 0.4, delay: 0.5 },
            }}
            className="absolute left-[10%] z-20 w-[220px] md:w-[230px] lg:w-[280px] h-auto object-contain drop-shadow-xl"
          />

          {/* Earn Daily badge */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-4 right-0 md:top-8 md:-right-2 bg-[#2C5E2E] text-white rounded-2xl px-4 py-3 shadow-xl z-30 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-[#FFC727]" />
            <span className="text-xs font-bold md:text-sm">Earn Daily</span>
          </motion.div>

          {/* Fast delivery badge */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute bottom-[55%] right-0 md:-right-2 bg-white rounded-2xl px-4 py-3 shadow-lg z-30 flex items-center gap-2 border border-gray-100"
          >
            <Zap className="w-4 h-4 text-[#FFC727]" />
            <span className="text-xs md:text-sm font-bold text-[#1A3F1C]">
              Fast Delivery
            </span>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="order-1 space-y-6 md:w-1/2 md:order-2"
        >
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-extrabold leading-tight text-black md:text-4xl lg:text-5xl"
          >
            Join the OunjeMarket
            <br />
            <span className="text-[#2C5E2E]">Be a Rider.</span>
            <br />
            Deliver Happiness.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base leading-relaxed text-gray-600 md:text-lg"
          >
            Ride when you want. Earn daily.
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
                <b.icon className="w-4 h-4 text-[#2C5E2E] flex-shrink-0" />
                <span className="flex-1 text-sm font-medium text-gray-700">
                  {b.text}
                </span>
                <CheckCircle2 className="w-4 h-4 text-[#2C5E2E] flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-3 pt-2"
          >
            <motion.button
              onClick={() => navigate("/rider/auth")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-[#2C5E2E] text-white font-bold px-7 py-3.5 rounded-2xl shadow-md hover:bg-[#1a3f1c] transition text-sm cursor-pointer"
            >
              Become a Rider
              <ArrowRight className="w-4 h-4" />
            </motion.button>
            <button
              onClick={() => navigate("/rider/auth")}
              className="text-[#1A3F1C] hover:underline text-xs font-bold transition-all px-4 py-2"
            >
              Rider Log In
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RiderSection;
