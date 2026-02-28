"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MapPin, Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";

const cities = [
  { label: "Lagos", value: "lagos" },
  { label: "Abuja", value: "abuja" },
  { label: "Enugu", value: "enugu" },
];

const menuItems = [
  { label: "Join Us", href: "/#joinUs" },
  { label: "About Us", href: "/aboutus" },
  { label: "FAQs", href: "/contactus#FAQ" },
  { label: "Contact Us", href: "/contactus" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const scrollToSection = (hash: string) => {
    const sectionId = hash.replace("#", "");
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavClick = (e: React.MouseEvent, item: (typeof menuItems)[0]) => {
    if (!item.href.includes("#")) return;
    e.preventDefault();
    const [path, hash] = item.href.split("#");
    const isCurrentPage = location.pathname === (path || "/");
    if (isCurrentPage) {
      scrollToSection("#" + hash);
    } else {
      navigate(path + "#" + hash);
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#2C5E2E]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-10 h-16 md:h-[68px]">

          {/* ─── Logo ─── */}
          <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
            <Link to="/" className="flex items-center gap-2.5" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
              <div className="w-8 h-8 md:w-9 md:h-9 bg-[#2C5E2E] rounded-xl flex items-center justify-center shadow-sm">
                <img
                  src="/images/ounje-logo.png"
                  alt="Ounje logo"
                  className="w-5 h-5 md:w-6 md:h-6 object-contain"
                />
              </div>
              <span className="text-[#1A3F1C] text-[15px] md:text-[17px] font-extrabold uppercase tracking-wide">
                OunjeFood
              </span>
            </Link>
          </motion.div>

          {/* ─── Desktop Nav pill ─── */}
          <nav className="hidden md:flex items-center gap-1 bg-white rounded-2xl px-2 py-1.5 border border-[#2C5E2E]/15 shadow-sm">
            {menuItems.map((item) => {
              const [itemPath, itemHash] = item.href.split("#");
              const path = itemPath || "/";
              const isActive = itemHash
                ? location.pathname === path && location.hash === "#" + itemHash
                : location.pathname === path && path !== "/";
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#ECFFED] text-[#2C5E2E]"
                      : "text-[#1A3F1C] hover:bg-gray-50 hover:text-[#2C5E2E]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* ─── Desktop right: Location + Order Now ─── */}
          <div className="hidden md:flex items-center gap-3">
            <Select onOpenChange={setIsLocationOpen} defaultValue="">
              <SelectTrigger className="flex items-center gap-1.5 rounded-2xl px-3 py-2 bg-white text-[#1A3F1C] text-sm font-semibold border border-[#2C5E2E]/20 shadow-sm hover:bg-[#ECFFED] transition cursor-pointer">
                <MapPin className="w-3.5 h-3.5 text-[#2C5E2E] flex-shrink-0" />
                <SelectValue placeholder="Location" />
                <motion.div
                  animate={{ rotate: isLocationOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-3.5 h-3.5 text-[#2C5E2E]" />
                </motion.div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-[#2C5E2E]/15 rounded-2xl shadow-lg overflow-hidden">
                {cities.map((city) => (
                  <SelectItem
                    key={city.value}
                    value={city.value}
                    className="text-sm font-medium text-[#1A3F1C] hover:bg-[#ECFFED] cursor-pointer"
                  >
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <motion.button
              onClick={() => setIsOrderOpen(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-2xl text-sm shadow-md hover:bg-[#1fb855] transition"
            >
              <ShoppingBag className="w-4 h-4" />
              Order Now
            </motion.button>
          </div>

          {/* ─── Mobile hamburger ─── */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center bg-[#2C5E2E] rounded-xl shadow-sm"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  <Menu className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

      </motion.header>

      {/* ─── Mobile Drawer — rendered outside motion.header so backdrop-filter works on all pages ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-[55]"
              style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-screen w-[80%] sm:w-[58%] z-[60] flex flex-col bg-[#1A3F1C] shadow-2xl"
              style={{ paddingTop: "env(safe-area-inset-top)" }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <Link
                  to="/"
                  onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: "instant" }); }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 bg-[#FFC727]/20 rounded-xl flex items-center justify-center border border-[#FFC727]/30">
                    <img src="/images/ounje-logo.png" alt="Ounje" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-sm uppercase tracking-widest leading-none">OunjeFood</p>
                    <p className="text-white/40 text-[10px] mt-0.5">Order Fast. Eat Fresh.</p>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="px-4 py-6 space-y-1 overflow-y-auto">
                {menuItems.map((item, i) => {
                  const [itemPath, itemHash] = item.href.split("#");
                  const path = itemPath || "/";
                  const isActive = itemHash
                    ? location.pathname === path && location.hash === "#" + itemHash
                    : location.pathname === path && path !== "/";
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.22, delay: 0.05 * i }}
                    >
                      <Link
                        to={item.href}
                        onClick={(e) => {
                          handleNavClick(e, item);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-4 rounded-2xl text-[15px] font-semibold transition-all ${
                          isActive
                            ? "bg-[#FFC727]/15 text-[#FFC727] border border-[#FFC727]/20"
                            : "text-white/75 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 -rotate-90 transition ${isActive ? "text-[#FFC727]" : "text-white/30"}`} />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Location picker — sits right below nav items */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: 0.05 * menuItems.length }}
                  className="pt-3 mt-1 border-t border-white/10"
                >
                  <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest px-1 mb-2">Select City</p>
                  <Select defaultValue="">
                    <SelectTrigger className="w-full bg-[#FFC727] border-none rounded-2xl px-4 py-3 flex items-center gap-2 shadow-lg focus:ring-0">
                      <MapPin className="w-4 h-4 text-[#1A3F1C] flex-shrink-0" />
                      <SelectValue placeholder={<span className="text-[#1A3F1C] font-bold text-sm">Pick your city</span>} />
                    </SelectTrigger>
                    <SelectContent
                      className="bg-[#1A3F1C] border border-white/20 rounded-2xl shadow-xl z-[70]"
                      side="bottom"
                      align="start"
                    >
                      {cities.map((city) => (
                        <SelectItem
                          key={city.value}
                          value={city.value}
                          className="text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium cursor-pointer"
                        >
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WhatsAppOrderModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
    </>
  );
};

export default Header;
