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

                {/* CTA */}
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl text-sm shadow-lg transition-colors"
                  style={{ background: role.btnBg, color: role.btnText }}
                >
                  Download Our App
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
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
