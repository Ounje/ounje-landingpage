import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function TeamSection() {
  const teamImages = [
    "/images/team/south-madu.png",
    "/images/team/ego-chukwuebuka.png",
    "/images/team/dandy-chukwudi.png",
    "/images/team/micheal.png",
    "/images/team/charles-chukudi.png",
    "/images/team/osarhe-micheal.png",
    "/images/team/samuel-nyado.png",
    "/images/team/josh-josuakim.png",
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const next = () =>
    setActiveIndex((prev) => (prev + 1) % teamImages.length);

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };

  /* ✅ AUTO-SLIDE EVERY 5 SECONDS (SLOWER) */
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000); // ⏳ now slower — 5 seconds per slide

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 px-6 md:px-10">

      {/* TITLE BANNER */}
      <div className="w-full bg-[#1A3F1C] py-10 flex justify-center">
        <h1 className="text-white text-3xl md:text-4xl font-extrabold">
          Meet The Team
        </h1>
      </div>

      {/* SUBTEXT */}
      <p className="text-center text-[#1A3F1C] px-6 md:px-24 mt-4 text-sm md:text-base leading-relaxed mb-10">
        Meet the team that has been working behind the screens making sure you get
        the best experience. We have all faced the problems you have encountered
        and that’s why we are here to serve you better.
      </p>

      {/* 📱 MOBILE — SINGLE IMAGE CAROUSEL */}
      <div className="md:hidden flex flex-col items-center">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }} /* Slightly smoother */
          className="rounded-2xl shadow-lg overflow-hidden border bg-white ml-4"
          style={{ width: "259px", height: "337px" }}
        >
          <img
            src={teamImages[activeIndex]}
            alt="team member"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* 🖥 DESKTOP — GRID OF CARDS */}
      <div className="hidden md:grid grid-cols-4 gap-8 justify-center ml-14">
        {teamImages.map((img, index) => (
          <motion.div
            key={img}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg border bg-white flex justify-center"
            style={{ width: "259px", height: "337px" }}
          >
            <img
              src={img}
              alt="team card"
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </div>

    </section>
  );
}
