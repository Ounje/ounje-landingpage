import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import ComingSoonModal from "../modals/ComingSoonDialog";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    id: "1",
    title: "Egbon",
    emoji: "👤",
    desc: "Be a part of our amazing community. Let's show you how Ounje really works.",
    image: "/images/egbon-screen.png",
    color: "from-[#2C5E2E]",
  },
  {
    id: "2",
    title: "Vendor",
    emoji: "🏪",
    desc: "Reach more hungry customers and grow your business — OUNJE connects your kitchen to the streets, campuses, and communities that love your food.",
    image: "/images/vendor-screen.png",
    color: "from-[#1A3F1C]",
  },
  {
    id: "3",
    title: "Rider",
    emoji: "🛵",
    desc: "Turn your hustle into steady income, deliver meals, earn on your own terms, and become a trusted part of the OUNJE network.",
    image: "/images/rider-screen.png",
    color: "from-[#0d2e0e]",
  },
];

const JoinUsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="joinUs" className="py-16 md:py-24 px-4 md:px-8 bg-[#ECFFED] overflow-hidden">
      <div ref={ref} className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-[#2C5E2E]/10 border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2C5E2E] mb-4">
            🤝 Community
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-black leading-tight mb-4">
            Be a Part of Us
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto">
            Be a part of our amazing community. Let's show you how Ounje works.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Tabs className="w-full" defaultValue="1">
            <TabsList className="w-full bg-[#FFC727] p-1.5 rounded-2xl mb-8 gap-2">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="py-2.5 md:py-3 font-bold w-full rounded-xl text-sm md:text-base
                    data-[state=active]:bg-[#2C5E2E] data-[state=active]:text-white
                    data-[state=inactive]:text-[#1A3F1C]
                    transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <span className="hidden sm:inline">{cat.emoji}</span>
                  <span>{cat.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((cat) => (
              <TabsContent key={cat.id} value={cat.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Screen image with decorative bg */}
                  <div className="flex justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-[#2C5E2E]/5 rounded-3xl blur-2xl" />
                    <motion.img
                      src={cat.image}
                      alt={`${cat.title} screen`}
                      className="relative z-10 h-[50vh] md:h-[60vh] w-auto object-contain drop-shadow-2xl rounded-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  {/* CTA Card */}
                  <div className="bg-[#2C5E2E] rounded-3xl py-8 px-6 md:px-12 flex flex-col items-center gap-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFC727]/10 rounded-full blur-2xl" />
                    <p className="text-center text-white font-semibold text-sm md:text-base max-w-xl leading-relaxed relative z-10">
                      {cat.desc}
                    </p>
                    <motion.button
                      onClick={() => setIsModalOpen(true)}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative z-10 bg-[#FFC727] text-[#1A3F1C] font-bold px-8 py-3.5 rounded-2xl hover:bg-[#ffda55] transition flex items-center gap-2 text-sm md:text-base shadow-lg"
                    >
                      Join the Waitlist
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>

      <ComingSoonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
};

export default JoinUsSection;
