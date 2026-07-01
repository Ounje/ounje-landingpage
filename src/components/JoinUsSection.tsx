import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import ComingSoonModal from "../modals/ComingSoonDialog";
import { Store, Bike } from "lucide-react";

const roles = [
  {
    id: "vendor",
    title: "Vendor",
    tagline: "Cook. We handle the rest.",
    desc: "Reach more hungry customers, manage orders seamlessly, and scale your sales. OunjeMarket connects your kitchen to campuses, streets, and communities.",
    Icon: Store,
    image: "/images/vendor-screen.png",
    bg: "#FFC727",
    accent: "#2C5E2E",
    textColor: "text-[#1A3F1C]",
    descColor: "text-[#1A3F1C]/75",
    iconBg: "bg-[#1A3F1C]/10",
    iconColor: "text-[#2C5E2E]",
    appleLink: "https://apps.apple.com/ng/app/ounjemarket/id6762347962",
  },
  {
    id: "rider",
    title: "Rider",
    tagline: "Ride. Earn. Repeat.",
    desc: "Turn your hustle into steady daily payouts. Deliver hot meals on your own schedule and become a key part of the OunjeMarket delivery network.",
    Icon: Bike,
    image: "/images/rider-screen.png",
    bg: "#1A3F1C",
    accent: "#FFC727",
    textColor: "text-white",
    descColor: "text-white/70",
    iconBg: "bg-white/15",
    iconColor: "text-[#FFC727]",
    appleLink: "https://apps.apple.com/ng/app/ounjemarket/id6762347962",
  },
];

const JoinUsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65 } },
  };

  return (
    <section
      id="joinUs"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#ECFFED] overflow-hidden"
    >
      <div ref={ref} className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#2C5E2E]/60 mb-3">
            PARTNER WITH OUNJEMARKET
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A3F1C] leading-tight">
            Grow Your Buka. Ride & Earn.
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 + i * 0.15 }}
              className="flex flex-col overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-[#2C5E2E]/5"
              style={{ background: role.bg }}
            >
              {/* Screen image, floats at top */}
              <div className="relative flex justify-center px-6 pt-8 overflow-hidden bg-black/5">
                {/* Soft glow behind image */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                  style={{
                    background: `linear-gradient(to top, rgba(0,0,0,0.05), transparent)`,
                  }}
                />
                <motion.img
                  src={role.image}
                  alt={`${role.title} app screen`}
                  className="relative z-10 h-[240px] md:h-[260px] w-auto object-contain drop-shadow-2xl"
                  loading="lazy"
                  decoding="async"
                  whileHover={{ scale: 1.03, y: -4 }}
                  transition={{ duration: 0.35 }}
                />
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 pt-6 pb-8 px-7 md:px-9">
                {/* Icon + title */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${role.iconBg}`}
                  >
                    <role.Icon className={`w-5.5 h-5.5 ${role.iconColor}`} />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-extrabold uppercase tracking-[0.18em] ${role.descColor}`}
                    >
                      Join as a
                    </p>
                    <h3
                      className={`text-2xl font-extrabold leading-tight ${role.textColor}`}
                    >
                      {role.title}
                    </h3>
                  </div>
                </div>

                {/* Tagline */}
                <p
                  className={`text-lg md:text-xl font-bold mb-2.5 leading-snug ${role.textColor}`}
                >
                  {role.tagline}
                </p>

                {/* Desc */}
                <p
                  className={`text-sm leading-relaxed mb-8 flex-1 font-medium ${role.descColor}`}
                >
                  {role.desc}
                </p>

                {/* App Store and Play Store buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-auto w-full">
                  {/* App Store Badge */}
                  <motion.a
                    href={role.appleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 px-3 rounded-xl shadow-md border border-white/10 hover:bg-[#1a1a1a] transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z" />
                    </svg>
                    <div className="flex flex-col items-start leading-none text-left">
                      <span className="text-[8px] font-normal text-white/70">Download on the</span>
                      <span className="text-[11px] md:text-xs font-bold text-white mt-0.5 whitespace-nowrap">App Store</span>
                    </div>
                  </motion.a>

                  {/* Play Store Badge */}
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 px-3 rounded-xl shadow-md border border-white/10 hover:bg-[#1a1a1a] transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none">
                      <path d="M3.609 1.814L13.792 12 3.609 22.186c-.198-.109-.329-.313-.329-.56V2.374c0-.247.131-.451.329-.56z" fill="#0DF8E6" />
                      <path d="M17.186 8.609l-3.394 3.391 3.394 3.391 3.754-2.115c1.042-.587 1.042-1.543 0-2.13l-3.754-2.137z" fill="#FFA000" />
                      <path d="M3.609 1.814l13.577 6.795-3.394 3.391L3.609 1.814z" fill="#FF3D00" />
                      <path d="M3.609 22.186l10.183-10.186 3.394 3.391L3.609 22.186z" fill="#4CAF50" />
                    </svg>
                    <div className="flex flex-col items-start leading-none text-left">
                      <span className="text-[8px] font-normal text-white/70">GET IT ON</span>
                      <span className="text-[11px] md:text-xs font-bold text-white mt-0.5 whitespace-nowrap">Google Play</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default JoinUsSection;
