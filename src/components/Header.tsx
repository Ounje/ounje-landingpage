"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/Select";
import { Button } from "./Button";

const countries = [
  { label: "Lagos", value: "lagos" },
  { label: "Abuja", value: "abuja" },
  { label: "Enugu", value: "enugu" },
];

const menuItems = [
  { label: "Join Us", href: "#joinUs" },
  { label: "About us", href: "aboutus" },
  { label: "FAQs", href: "#FAQ" },
  { label: "Contact Us", href: "contactUs" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <header className="fixed w-full top-0 z-30 md:flex justify-center items-center bg-transparent">
      <div className="w-full flex items-center justify-between md:justify-center md:gap-[150px] px-4 py-3">
        {/* Logo */}
        <div className="w-full flex items-center justify-between md:justify-center md:gap-[50px] lg:gap-[170px] px-4 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl text-black backdrop-blur-sm bg-white/5 rounded-[20px] shadow-xl md:bg-white px-4 md:px-3 py-2 rounded-[20px] flex items-center gap-2 border-[1px] border-black"
          >
            <img
              src="/images/ounje-logo.png"
              alt="ounje logo"
              className="w-[30px] h-[30px]"
            />
            <span className="text-[20px] md:text-[18px]">Ounje</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 lg:gap-10 text-[18px] lg:text-[20px] bg-white rounded-[20px] px-6 lg:px-8 py-2.5 border-[1px] border-black">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={`/${item.href}`}
                className="hover:text-yellow-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Location Select */}
          <div className="hidden md:flex items-center gap-2">
            <Select defaultValue="lagos">
              <SelectTrigger className="inline-flex items-center gap-2 rounded-[20px] px-4 py-2 bg-white text-black text-[18px] lg:text-[20px] border-[1px] border-black">
                <SelectValue placeholder="Select a city" />
                <ChevronDown />
              </SelectTrigger>
              <SelectContent className="bg-white rounded-[20px]">
                {countries.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className=" md:hidden p-0.5 z-50 border border-black rounded-[10px] border-grey backdrop-blur-lg bg-white/10">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-black hover:text-yellow-400  "
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-0 backdrop-blur-lg bg-white/10 text-black border-none py-4 h-[100vh] w-full">
          <nav className="flex flex-col space-y-4 px-4 justify-center mt-20">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-black-700 hover:text-yellow-400 font-medium transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
              <Button variant="outline" size="sm">
                Login
              </Button>
              <Button size="sm" className="hover:text-yellow-400">
                Sign Up
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
