"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";
import LoginModal from "../modals/LoginModal";
import { useAuthStore } from "../hooks/useAuthStore";

const menuItems = [
  { label: "Join Us", href: "/#joinUs" },
  { label: "About Us", href: "/aboutus" },
  { label: "FAQs", href: "/contactus#FAQ" },
  { label: "Contact Us", href: "/contactus" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { isAuthenticated, role, logout, user } = useAuthStore();
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
    if (item.href.includes("#")) {
      e.preventDefault();
      const [path, hash] = item.href.split("#");
      const isCurrentPage = location.pathname === (path || "/");
      if (isCurrentPage) {
        navigate(path + "#" + hash, { replace: true });
        scrollToSection("#" + hash);
      } else {
        navigate(path + "#" + hash);
      }
    } else {
      // No hash, if same page with a hash active, clear it and scroll to top
      const isCurrentPage = location.pathname === item.href;
      if (isCurrentPage && location.hash) {
        e.preventDefault();
        navigate(item.href, { replace: true });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed w-full top-0 transition-all duration-300 ${
          isMenuOpen ? "z-30" : "z-50"
        } ${
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
                : location.pathname === path && path !== "/" && !location.hash;
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

          {/* ─── Desktop right: Auth & Controls ─── */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-[#1A3F1C] hover:text-[#2C5E2E] font-bold text-sm px-4 py-2 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <motion.button
                  onClick={() => navigate("/customer/browse")}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#2C5E2E] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:bg-[#1a3f1c] transition cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Order Now
                </motion.button>
              </>
            ) : (
              <>
                <span className="text-xs font-semibold text-[#1A3F1C]/75">
                  Hi, <span className="font-bold text-[#2C5E2E]">{user?.name}</span> ({role})
                </span>
                <button
                  onClick={() => {
                    if (role === "vendor") navigate("/vendor/dashboard");
                    else if (role === "rider") navigate("/rider/dashboard");
                    else navigate("/customer/browse");
                  }}
                  className="bg-[#ECFFED] text-[#2C5E2E] hover:bg-[#2C5E2E] hover:text-white border border-[#2C5E2E]/20 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="text-red-600 hover:text-red-800 font-bold text-xs px-2 py-2 cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
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

      {/* ─── Mobile Drawer (outside motion.header to avoid compositing layer trapping backdrop-filter) ─── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
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
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="fixed top-0 right-0 h-screen w-[78%] sm:w-[60%] z-50 flex flex-col bg-[#1A3F1C] shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <Link
                  to="/"
                  onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: "instant" }); }}
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center">
                    <img
                      src="/images/ounje-logo.png"
                      alt="Ounje"
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="text-white font-extrabold text-base uppercase tracking-wide">
                    OunjeFood
                  </span>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-5 py-8 space-y-3 overflow-y-auto">
                {menuItems.map((item, i) => {
                  const [itemPath, itemHash] = item.href.split("#");
                  const path = itemPath || "/";
                  const isActive = itemHash
                    ? location.pathname === path && location.hash === "#" + itemHash
                    : location.pathname === path && path !== "/" && !location.hash;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: 0.06 * i }}
                    >
                      <Link
                        to={item.href}
                        onClick={(e) => {
                          handleNavClick(e, item);
                          setIsMenuOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-base font-semibold transition ${
                          isActive
                            ? "bg-white/15 text-[#FFC727]"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <span className="w-2 h-2 bg-[#FFC727] rounded-full" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="border-t border-white/10 my-6 pt-6 space-y-4">
                  {!isAuthenticated ? (
                    <>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsLoginOpen(true);
                        }}
                        className="w-full flex items-center justify-center bg-white text-[#2C5E2E] font-bold py-3.5 rounded-2xl text-sm shadow-md transition cursor-pointer"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/customer/browse");
                        }}
                        className="w-full flex items-center justify-center bg-[#FFC727] text-[#1A3F1C] font-bold py-3.5 rounded-2xl text-sm shadow-md transition cursor-pointer"
                      >
                        Order Online
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3 text-white text-center">
                      <p className="text-xs text-white/60">Logged in as {user?.name} ({role})</p>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (role === "vendor") navigate("/vendor/dashboard");
                          else if (role === "rider") navigate("/rider/dashboard");
                          else navigate("/customer/browse");
                        }}
                        className="w-full bg-white/10 text-white font-bold py-3 rounded-2xl text-sm transition cursor-pointer"
                      >
                        Go to Dashboard
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="w-full text-red-400 hover:text-red-500 font-bold py-2 text-sm transition cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <WhatsAppOrderModal isOpen={isOrderOpen} onClose={() => setIsOrderOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Header;
