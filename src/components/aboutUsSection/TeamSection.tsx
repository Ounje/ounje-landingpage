import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const teamMembers = [
  { img: "/images/team/south-madu.png", name: "South Madu" },
  { img: "/images/team/ego-chukwuebuka.png", name: "Ago Chukwubuikem" },
  { img: "/images/team/dandy-chukwudi.png", name: "Dandy Chukwudi" },
  { img: "/images/team/charles-chukudi.png", name: "Charles Chukwudi" },
  { img: "/images/team/osarhe-micheal.png", name: "Osarhe Michael" },
  { img: "/images/team/samuel-nyado.png", name: "Samuel Nyado" },
];

export default function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () =>
    setActiveIndex((i) => (i - 1 + teamMembers.length) % teamMembers.length);
  const next = () => setActiveIndex((i) => (i + 1) % teamMembers.length);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 overflow-hidden bg-white md:py-20">
      {/* Title banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-[#1A3F1C] py-10 flex flex-col items-center gap-2 mb-8 md:mb-12"
      >
        <h2 className="text-2xl font-extrabold text-white md:text-4xl">
          Meet The Team
        </h2>
        <p className="text-xs font-medium text-white/60 md:text-sm">
          The people making Ounje happen
        </p>
      </motion.div>

      {/* Subtext */}
      <p className="text-center text-[#1A3F1C]/70 px-6 md:px-24 text-sm md:text-base leading-relaxed mb-10 max-w-2xl mx-auto">
        Meet the team that has been working behind the screens making sure you
        get the best experience. We have all faced the problems you have
        encountered and that's why we are here to serve you better.
      </p>

      {/* Mobile — Carousel */}
      <div className="flex flex-col items-center px-6 md:hidden">
        <div className="relative w-full max-w-[300px] flex items-center justify-center">
          {/* Prev button */}
          <button
            onClick={prev}
            className="absolute -left-4 z-10 bg-white border border-[#2C5E2E]/20 shadow-md rounded-full p-2 text-[#2C5E2E] hover:bg-[#ECFFED] transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white w-full aspect-[3/4]"
            >
              <img
                src={teamMembers[activeIndex].img}
                alt={teamMembers[activeIndex].name}
                className="object-cover w-full h-full"
              />
            </motion.div>
          </AnimatePresence>

          {/* Next button */}
          <button
            onClick={next}
            className="absolute -right-4 z-10 bg-white border border-[#2C5E2E]/20 shadow-md rounded-full p-2 text-[#2C5E2E] hover:bg-[#ECFFED] transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Name */}
        <motion.p
          key={`name-${activeIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 font-semibold text-[#1A3F1C] text-sm"
        >
          {teamMembers[activeIndex].name}
        </motion.p>

        {/* Dots */}
        <div className="flex gap-1.5 mt-3">
          {teamMembers.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? "bg-[#2C5E2E] w-4" : "bg-[#2C5E2E]/30"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop — Responsive Grid */}
      <div className="hidden max-w-5xl grid-cols-2 gap-6 px-8 mx-auto md:grid lg:grid-cols-3 lg:px-24">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.img}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="group rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-white aspect-[3/4] relative"
          >
            <img
              src={member.img}
              alt={member.name}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
            {/* Name overlay on hover */}
            <div className="absolute inset-x-0 bottom-0 p-4 transition-transform duration-300 translate-y-full bg-gradient-to-t from-black/70 to-transparent group-hover:translate-y-0">
              <p className="text-sm font-semibold text-white">{member.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
