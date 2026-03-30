import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";

export default function JoinTeamSection() {
  return (
    <section className="py-16 md:py-20 px-4 bg-[#ECFFED] flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-2xl bg-[#1A3F1C] rounded-3xl py-12 px-6 md:px-14 flex flex-col items-center text-center shadow-xl relative overflow-hidden"
      >
        {/* Decorative circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFC727]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute w-40 h-40 rounded-full pointer-events-none -bottom-10 -left-10 bg-white/5 blur-2xl" />

        {/* Badge */}
        <span className="mb-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white/80">
          <Users className="w-3.5 h-3.5" /> Check Out Open Roles
        </span>

        <h2 className="mb-3 text-2xl font-extrabold leading-tight text-white md:text-3xl">
          Join Our Team
        </h2>
        <p className="max-w-md mb-8 text-sm leading-relaxed text-white/70 md:text-base">
          Together we can make a difference in serving the nation one plate at a
          time. If you're passionate about food and technology, we'd love to
          hear from you.
        </p>

        <motion.a
          href="#"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2 bg-[#FFC727] hover:bg-[#ffda55] text-[#1A3F1C] font-bold rounded-2xl px-8 py-3.5 text-sm transition shadow-lg"
        >
          View Open Roles
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </motion.div>
    </section>
  );
}
