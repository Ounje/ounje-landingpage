import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import ComingSoonModal from "../modals/ComingSoonDialog";
import { ArrowRight, User, Store, Bike } from "lucide-react";

const roles = [
  {
    id: "customer",
    title: "Customer",
    tagline: "Order like a local.",
    desc: "Browse nearby vendors, build your plate exactly how you want it, and get authentic Naija food delivered fast.",
    Icon: User,
    image: "/images/egbon-screen.png",
    bg: "#2C5E2E",
    accent: "#FFC727",
    textColor: "text-white",
    descColor: "text-white/70",
    btnBg: "#FFC727",
    btnText: "#1A3F1C",
    iconBg: "bg-white/15",
    iconColor: "text-[#FFC727]",
    appleLink: "https://apps.apple.com/ng/app/ounjefood/id6762204959",
  },
  {
    id: "vendor",
    title: "Vendor",
    tagline: "Cook. We handle the rest.",
    desc: "Reach more hungry customers and grow your business. OUNJE connects your kitchen to streets, campuses, and communities.",
    Icon: Store,
    image: "/images/vendor-screen.png",
    bg: "#FFC727",
    accent: "#2C5E2E",
    textColor: "text-[#1A3F1C]",
    descColor: "text-[#1A3F1C]/65",
    btnBg: "#1A3F1C",
    btnText: "#ffffff",
    iconBg: "bg-[#1A3F1C]/10",
    iconColor: "text-[#2C5E2E]",
    appleLink: "https://apps.apple.com/ng/app/ounjemarket/id6762347962",
  },
  {
    id: "rider",
    title: "Rider",
    tagline: "Ride. Earn. Repeat.",
    desc: "Turn your hustle into steady daily income. Deliver meals on your own terms and become part of the OUNJE network.",
    Icon: Bike,
    image: "/images/rider-screen.png",
    bg: "#1A3F1C",
    accent: "#FFC727",
    textColor: "text-white",
    descColor: "text-white/70",
    btnBg: "#FFC727",
    btnText: "#1A3F1C",
    iconBg: "bg-white/15",
    iconColor: "text-[#FFC727]",
    appleLink: "https://apps.apple.com/ng/app/ounjemarket/id6762347962",
  },
];

const JoinUsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="joinUs"
      className="py-20 md:py-28 px-4 md:px-8 bg-[#ECFFED] overflow-hidden"
    >
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2C5E2E]/60 mb-3">
            Everyone has a role
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A3F1C] leading-tight">
            Be a Part of Us
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map((role, i) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15 + i * 0.12 }}
              className="flex flex-col overflow-hidden rounded-3xl"
              style={{ background: role.bg }}
            >
              {/* Screen image, floats at top */}
              <div className="relative flex justify-center px-6 pt-8 overflow-hidden">
                {/* Soft glow behind image */}
                <div
                  className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                  style={{
                    background: `linear-gradient(to top, ${role.bg}, transparent)`,
                  }}
                />
                <motion.img
                  src={role.image}
                  alt={`${role.title} app screen`}
                  className="relative z-10 h-[240px] md:h-[260px] w-auto object-contain drop-shadow-2xl"
                  loading="lazy"
                  decoding="async"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35 }}
                />
              </div>

              {/* Card body */}
              <div className="flex flex-col flex-1 pt-4 pb-8 px-7">
                {/* Icon + title */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${role.iconBg}`}
                  >
                    <role.Icon className={`w-5 h-5 ${role.iconColor}`} />
                  </div>
                  <div>
                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.18em] ${role.descColor}`}
                    >
                      Join as
                    </p>
                    <h3
                      className={`text-xl font-extrabold leading-tight ${role.textColor}`}
                    >
                      {role.title}
                    </h3>
                  </div>
                </div>

                {/* Tagline */}
                <p
                  className={`text-lg font-bold mb-2 leading-snug ${role.textColor}`}
                >
                  {role.tagline}
                </p>

                {/* Desc */}
                <p
                  className={`text-sm leading-relaxed mb-6 flex-1 ${role.descColor}`}
                >
                  {role.desc}
                </p>

                {/* App Store and Play Store buttons */}
                <div className="flex gap-3 mt-auto">
                  <motion.a
                    href={role.appleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-white/10 bg-black text-white hover:bg-black/90 transition-colors shadow-md text-left cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C3.79 16.32 3.06 10.11 6.5 7.64c1.68-1.07 3.32-.82 4.41-.33.84.38 1.56.39 2.4 0 1.04-.49 2.76-.79 4.1.47-3.13 1.9-2.52 7.15.54 8.52a8.55 8.55 0 0 1-2.9 3.98M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.22 2.5-2.04 4.42-3.74 4.25" />
                    </svg>
                    <div className="leading-none">
                      <span className="block text-[8px] opacity-75 font-normal tracking-wide uppercase">Download on</span>
                      <span className="block text-xs font-extrabold mt-0.5 whitespace-nowrap">App Store</span>
                    </div>
                  </motion.a>

                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border border-white/10 bg-black text-white hover:bg-black/90 transition-colors shadow-md text-left cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186A2.22 2.22 0 0 1 3 20.612V3.388c0-.629.232-1.205.609-1.574M14.972 13.18l3.754-3.754-4.708-2.69-2.826 2.826 3.78 3.618M11.21 9.562l2.826-2.826L3.896 1.047a2.22 2.22 0 0 0-1.896.767l9.21 7.748M14.018 14.135l-2.808-2.686-9.2 7.74c.48.571 1.258.742 1.896.377l10.112-5.431" />
                    </svg>
                    <div className="leading-none">
                      <span className="block text-[8px] opacity-75 font-normal tracking-wide uppercase">Get it on</span>
                      <span className="block text-xs font-extrabold mt-0.5 whitespace-nowrap">Google Play</span>
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
