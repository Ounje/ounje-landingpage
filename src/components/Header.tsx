"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import { motion, AnimatePresence } from "framer-motion";

const countries = [
  { label: "Lagos", value: "lagos" },
  { label: "Abuja", value: "abuja" },
  { label: "Enugu", value: "enugu" },
];

const menuItems = [
  { label: "Join Us", href: "/#joinUs" },
  { label: "About us", href: "/aboutus" },
  { label: "FAQs", href: "/contactus#FAQ" },
  { label: "Contact Us", href: "/contactus" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  // Close mobile menu when resizing to desktop view
  useEffect(() => {
    const handleResize = () => {
      // Close menu if window is resized to desktop width (768px = md breakpoint)
      if (window.innerWidth >= 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen]);

  const scrollToSection = (hash: string) => {
    const sectionId = hash.replace("#", "");
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-md bg-white/70 shadow-sm border-b border-[#2C5E2E]/10"
          : "bg-transparent"
      }`}
    >
      <div className="w-full flex flex-nowrap items-center justify-between px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4">
        
        {/* Logo */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <Link to="/" className="flex items-center gap-2">
            <motion.img
              src="/images/ounje-logo.png"
              alt="Ounje logo"
              className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] lg:w-[30px] lg:h-[30px]"
            />
            <span className="text-[#1A3F1C] text-[14px] sm:text-[15px] md:text-[17px] font-semibold uppercase whitespace-nowrap">
              OUNJEFOOD
            </span>
          </Link>
        </motion.div>

        {/* Tablet & Desktop Navigation */}
        <nav className="hidden md:flex justify-center items-center gap-4 md:gap-6 lg:gap-10 text-[15px] md:text-[16px] bg-white rounded-[20px] px-5 py-2 border border-[#2C5E2E]/20 whitespace-nowrap">
          {menuItems.map((item) => {
            const [path, hash] = item.href.includes("#")
              ? item.href.split("#")
              : [item.href, null];
            const isCurrentPage = location.pathname === path;

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={(e) => {
                  if (hash) {
                    e.preventDefault();
                    if (isCurrentPage) scrollToSection(`#${hash}`);
                    else navigate(`${path}#${hash}`);
                  } else if (isCurrentPage) e.preventDefault();
                  setIsMenuOpen(false);
                }}
                className="relative group transition"
              >
                {item.label}
                <span className="absolute left-0 bottom-[-3px] w-0 h-[2px] bg-[#FFC727] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            );
          })}
        </nav>

        {/* Tablet & Desktop Location Select */}
        <motion.div
          className="hidden md:flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Select onOpenChange={(open) => setIsOpen(open)} defaultValue="">
            <SelectTrigger className="inline-flex items-center gap-2 rounded-[20px] px-3 py-1 bg-white text-[#1A3F1C] text-[15px] md:text-[16px] border border-[#2C5E2E]/30 whitespace-nowrap">
              <SelectValue placeholder="Location" />
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-[#2C5E2E]" />
              </motion.div>
            </SelectTrigger>

            <SelectContent className="bg-white/90 border border-[#2C5E2E]/20 rounded-[20px] shadow-md origin-top">
              {countries.map((country, i) => (
                <motion.div
                  key={country.value}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                >
                  <SelectItem value={country.value}>{country.label}</SelectItem>
                </motion.div>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-[10px] border border-[#2C5E2E]/40 backdrop-blur-lg bg-white/40 text-[#2C5E2E]"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="fixed top-0 right-0 h-screen min-h-[100vh] w-[70%] sm:w-[60%] 
                         bg-[#FFF3E8] backdrop-blur-xl z-50 shadow-lg flex flex-col 
                         items-end justify-start pt-24 pb-12 space-y-8 pr-10 text-[#1A3F1C] 
                         rounded-l-[25px] overflow-y-auto text-right"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-5 right-5 p-2 bg-[#FFF3E8] rounded-full border border-[#2C5E2E]/20"
              >
                <X className="h-5 w-5 text-[#2C5E2E]" />
              </button>

              {/* Menu Links */}
              {menuItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.08 * i }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-lg font-medium hover:text-[#FFC727] transition"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Animated Select Location */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Select defaultValue="">
                  <SelectTrigger className="flex justify-end items-center gap-1 text-[#1A3F1C] text-lg font-medium bg-transparent border-none shadow-none focus:ring-0 hover:text-[#FFC727] transition-all">
                    <SelectValue placeholder="Location" />
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-4 w-4 mt-[2px]" />
                    </motion.div>
                  </SelectTrigger>

                  <SelectContent
                    className="mt-2 bg-white/90 backdrop-blur-md rounded-[12px] py-1 text-center border border-[#2C5E2E]/10 shadow-md w-[140px]"
                    side="bottom"
                    align="end"
                  >
                    {countries.map((country, i) => (
                      <motion.div
                        key={country.value}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                      >
                        <SelectItem
                          value={country.value}
                          className="py-1.5 text-[#1A3F1C] text-[15px] hover:text-[#FFC727] cursor-pointer"
                        >
                          {country.label}
                        </SelectItem>
                      </motion.div>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
