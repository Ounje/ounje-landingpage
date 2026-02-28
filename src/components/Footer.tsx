import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "2348123358739";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Newsletter service coming soon! Thanks for your interest.");
    setEmail("");
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <>
      {/* Fixed mobile WhatsApp Order button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOrderOpen(true)}
        className="fixed bottom-6 right-5 lg:hidden z-50 bg-[#25D366] text-white font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm"
      >
        <MessageCircle className="w-5 h-5" />
        Order Now
      </motion.button>

      <footer className="bg-black text-white py-14 px-5 md:px-10 lg:px-16 relative overflow-visible">

        {/* Desktop floating WhatsApp order button */}
        <motion.button
          onClick={() => setIsOrderOpen(true)}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
          transition={{ y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.4 } }}
          whileHover={{ scale: 1.12 }}
          className="hidden lg:flex absolute -top-7 right-16 bg-[#25D366] text-white font-bold gap-2 items-center px-5 py-3.5 rounded-2xl shadow-2xl hover:bg-[#1fb855] transition z-10"
        >
          <motion.img
            src="/icons/whatsapp-icon.png"
            alt="WhatsApp"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-6"
          />
          Order via WhatsApp
        </motion.button>

        <motion.div
          ref={ref}
          className="max-w-[1200px] mx-auto"
          variants={container}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {/* Logo + Newsletter */}
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-10 mb-10">
            <div className="flex items-center gap-2">
              <img src="/images/ounje-logo.png" alt="Ounje logo" className="w-8 h-8" />
              <h2 className="text-xl font-bold uppercase">
                <span className="text-white">OUNJE</span>
                <span className="text-[#FFC727]">FOOD</span>
              </h2>
            </div>

            <motion.form
              onSubmit={handleSubscribe}
              className="flex w-full md:max-w-md bg-white/10 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <input
                type="email"
                placeholder="Subscribe to our newsletter"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-transparent text-white text-sm placeholder-white/50 outline-none"
                required
              />
              <motion.button
                type="submit"
                className="bg-[#FFC727] text-[#1A3F1C] font-bold px-6 py-3.5 text-sm hover:bg-[#ffda55] transition flex items-center gap-1.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
                <motion.svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5"
                  animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                </motion.svg>
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Links */}
          <motion.div variants={container} className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
            {[
              {
                title: "Be a Part of Us",
                links: [
                  { label: "Careers", to: "/#customer" },
                  { label: "Ounje for Vendors", to: "/#vendor" },
                  { label: "Become a Rider", to: "/#rider" },
                ],
              },
              {
                title: "Links of Interest",
                links: [
                  { label: "About Us", to: "/aboutus" },
                  { label: "FAQs", to: "/contactus#FAQ" },
                  { label: "Contact Us", to: "/contactus" },
                ],
              },
              {
                title: "Privacy & Legal",
                links: [
                  { label: "Terms & Conditions", to: "/privacyandcompliance" },
                  { label: "Privacy Policy", to: "/privacyandcompliance" },
                  { label: "Cookies Policy", to: "/privacyandcompliance" },
                ],
              },
            ].map((col) => (
              <motion.div key={col.title} variants={item}>
                <h4 className="font-bold text-[#FFC727] mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-white/60 hover:text-white text-sm transition-colors duration-200 hover:underline underline-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Social + Copyright */}
          <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-white/10">
            <p className="text-white/40 text-xs md:text-sm">
              © {new Date().getFullYear()} OunjeFood. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <motion.a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.15, y: -2 }}
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#25D366] transition"
              >
                <img src="/icons/whatsapp-logo.png" alt="WhatsApp" className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#1DA1F2] transition"
              >
                <img src="/icons/x-logo.png" alt="X/Twitter" className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.15, y: -2 }}
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#0077b5] transition"
              >
                <img src="/icons/linkdln-logo.png" alt="LinkedIn" className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </footer>

      <WhatsAppOrderModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
};

export default Footer;
