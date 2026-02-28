import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#ECFFED] to-white pt-28 pb-0">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-[5%] w-64 h-64 bg-[#FFC727]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-[5%] w-56 h-56 bg-[#2C5E2E]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2C5E2E] shadow-sm"
        >
          <span className="w-2 h-2 bg-[#FFC727] rounded-full animate-pulse inline-block" />
          Our Story
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-extrabold text-[#2C5E2E] text-5xl sm:text-6xl md:text-7xl lg:text-[100px] leading-none tracking-tight"
        >
          About Us
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-sm md:text-base text-[#2C5E2E]/70 font-medium max-w-sm"
        >
          Meet the passionate team behind Nigeria's favourite food platform
        </motion.p>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 w-full max-w-3xl mx-auto relative"
        >
          <div className="absolute -inset-4 bg-[#2C5E2E]/5 rounded-3xl blur-xl" />
          <img
            src="/public/images/AboutHero-img.png"
            alt="Ounje team and story"
            className="relative z-10 w-full h-auto object-cover rounded-3xl shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
