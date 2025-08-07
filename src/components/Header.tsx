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
import { Button } from "./Button";
import { motion } from "framer-motion";

const countries = [
  { label: "Lagos", value: "lagos" },
  { label: "Abuja", value: "abuja" },
  { label: "Enugu", value: "enugu" },
];

// Ensure all paths are consistently formatted
const menuItems = [
  { label: "Join Us", href: "/#joinUs" }, // On current page
  { label: "About us", href: "/aboutus" }, // Absolute path
  { label: "FAQs", href: "/contactus#FAQ" }, // Absolute path with hash
  { label: "Contact Us", href: "/contactus" }, // Absolute path
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuOpen]);

  const scrollToSection = (hash: string) => {
    const sectionId = hash.replace("#", "");
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        scrollToSection(location.hash);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-30 md:flex justify-center items-center bg-transparent">
      <div className="w-full flex items-center justify-between md:justify-center md:gap-[150px] px-1 py-1 lg:px-4 lg:py-3">
        {/* Logo and Desktop Navigation */}
        <div className="w-full flex items-center justify-between md:justify-center md:gap-[50px] lg:gap-[170px] px-4 md:py-3">
          <Link
            to="/"
            className="text-2xl text-black backdrop-blur-sm bg-white/5 rounded-[20px] shadow-xl md:bg-white px-4 lg:px-3 py-1 md:rounded-[20px] flex items-center gap-2 md:border-[1px] md:border-black"
          >
            <img
              src="/images/ounje-logo.png"
              alt="ounje logo"
              className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]"
            />
            <span className="text-[15px] md:text-[18px] text-[#2C5E2E]">
              Ounje
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex justify-center gap-6 lg:gap-10 w-[635px] md:text-[15px] lg:text-[18px] bg-white rounded-[20px] lg:py- lg:px-8 py-1.5 border-[1px] border-black">
            {menuItems.map((item) => {
              const [path, hash] = item.href.includes("#")
                ? item.href.split("#")
                : [item.href, null];

              const isCurrentPage = location.pathname === path;

              return (
                <Link
                  key={item.label}
                  to={item.href.includes("#") ? path : item.href}
                  onClick={(e) => {
                    if (hash) {
                      e.preventDefault();
                      if (isCurrentPage) {
                        scrollToSection(`#${hash}`);
                      } else {
                        navigate(`${path}#${hash}`);
                      }
                    } else if (isCurrentPage) {
                      e.preventDefault();
                    }
                    setIsMenuOpen(false);
                  }}
                  className="hover:text-yellow-400"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Location Select */}
          <div className="hidden lg:flex items-center gap-2">
            <Select
              onOpenChange={(open) => setIsOpen(open)}
              defaultValue="lagos"
            >
              <SelectTrigger className="inline-flex items-center gap-2 rounded-[20px] px-4 py-1 bg-white text-black text-[18px] lg:text-[20px] border-[1px] border-black">
                <SelectValue placeholder="Select a city" />
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </SelectTrigger>
              <SelectContent className="bg-white border-[1px] border-black rounded-[20px]">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </motion.div>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden p-0.5 z-50 border border-black rounded-[10px] border-[#2C5E2E] backdrop-blur-lg bg-white/10">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1 text-[#2C5E2E] hover:text-yellow-400"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
          className="lg:hidden absolute top-0 backdrop-blur-lg bg-white/10 text-black border-none py-4 h-[100vh] w-full"
        >
          <nav className="flex flex-col space-y-4 px-4 justify-center mt-20">
            {menuItems.map((item) => {
              const [path, hash] = item.href.includes("#")
                ? item.href.split("#")
                : [item.href, null];

              const isCurrentPage = location.pathname === path;

              return (
                <Link
                  key={item.label}
                  to={item.href.includes("#") ? path : item.href}
                  onClick={(e) => {
                    if (hash) {
                      e.preventDefault();
                      if (isCurrentPage) {
                        scrollToSection(`#${hash}`);
                      } else {
                        navigate(`${path}#${hash}`);
                      }
                    } else if (isCurrentPage) {
                      e.preventDefault();
                    }
                    setIsMenuOpen(false);
                  }}
                  className="text-black-700 flex flex-col justify-center items-center hover:text-yellow-400 font-medium transition-colors px-2 py-1"
                >
                  {item.label}
                </Link>
              );
            })}
            <Select defaultValue="lagos">
              <SelectTrigger className="inline-flex justify-center ms-2  gap-2  text-black-700 text-md hover:text-yellow-400 font-medium transition-colors ">
                <SelectValue placeholder="Select a city" />
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </SelectTrigger>
              <SelectContent className="border-none text-start shadow-none">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </motion.div>
              </SelectContent>
            </Select>
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
