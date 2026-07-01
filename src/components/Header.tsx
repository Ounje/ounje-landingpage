"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, Bell, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsAppOrderModal from "../modals/WhatsAppOrderModal";
import LoginModal from "../modals/LoginModal";
import RoleSelectionModal from "../modals/RoleSelectionModal";
import { useAuthStore } from "../hooks/useAuthStore";
import { useNotificationStore } from "../hooks/useNotificationStore";

const menuItems = [
  { label: "Join Us", href: "/#joinUs" },
  { label: "About Us", href: "/aboutus" },
  { label: "FAQs", href: "/contactus#FAQ" },
  { label: "Contact Us", href: "/contactus" },
];

function formatTimeAgo(dateString: string) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 0) return "just now";
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  } catch {
    return "";
  }
}

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNotificationClick = async (n: any) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    setIsOpen(false);

    if (n.type === "order_update" || n.type === "order_status") {
      if (n.relatedId) {
        navigate(`/customer/order/${n.relatedId}`);
      }
    } else if (n.type === "new_order" && n.relatedId) {
      navigate(`/vendor/dashboard`);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#1A3F1C] hover:text-[#2C5E2E] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 overflow-hidden text-left">
            <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-50">
              <span className="text-sm font-extrabold text-[#1A3F1C]">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-[#2C5E2E] hover:text-[#1A3F1C] font-bold transition-colors cursor-pointer"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto mt-1 divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs font-semibold flex flex-col items-center justify-center">
                  <Bell className="w-8 h-8 mb-2 text-gray-300 opacity-60" />
                  No notifications yet
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-[#ECFFED]/35 transition-colors cursor-pointer relative ${!n.isRead ? "bg-[#ECFFED]/15" : ""
                      }`}
                  >
                    {!n.isRead && (
                      <span className="absolute top-4 right-4 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                    <div className="shrink-0 mt-0.5">
                      {n.type === "order_update" || n.type === "order_status" ? (
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Bell className="w-4 h-4 text-[#2C5E2E]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-3">
                      <h6 className="text-xs font-extrabold text-[#1A3F1C] truncate">{n.title}</h6>
                      <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{n.body}</p>
                      <span className="text-[9px] text-gray-400 font-bold block mt-1 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRoleSelectOpen, setIsRoleSelectOpen] = useState(false);
  const { isAuthenticated, role, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardLink = () => {
    if (role === "vendor") return "/vendor/dashboard";
    if (role === "rider") return "/rider/dashboard";
    return "/customer/browse";
  };

  const isCustomerPage = location.pathname.startsWith("/customer/");
  const isPortalPage =
    location.pathname.startsWith("/customer/") ||
    location.pathname.startsWith("/vendor/") ||
    location.pathname.startsWith("/rider/");
  const logoLink = isCustomerPage
    ? "/customer/browse"
    : location.pathname.startsWith("/vendor/")
      ? "/vendor/dashboard"
      : location.pathname.startsWith("/rider/")
        ? "/rider/dashboard"
        : "/";

  const handleLoginClick = () => {
    if (isCustomerPage) {
      setIsLoginOpen(true);
    } else {
      setIsRoleSelectOpen(true);
    }
  };

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
        className={`fixed w-full top-0 transition-all duration-300 ${isMenuOpen ? "z-30" : "z-50"
          } ${isScrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-[#2C5E2E]/10"
            : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 lg:px-10 h-16 md:h-[68px]">

          {/* ─── Logo ─── */}
          <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.2 }}>
            <Link to={logoLink} className="flex items-center gap-2.5" onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}>
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
          {!isPortalPage && (
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
                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                      ? "bg-[#ECFFED] text-[#2C5E2E]"
                      : "text-[#1A3F1C] hover:bg-gray-50 hover:text-[#2C5E2E]"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* ─── Desktop right: Auth & Controls ─── */}
          <div className="hidden md:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                {/* <button
                  onClick={handleLoginClick}
                  className="text-[#1A3F1C] hover:text-[#2C5E2E] font-bold text-sm px-4 py-2 transition-colors cursor-pointer"
                >
                  Log In
                </button> */}
                <motion.a
                  href="https://apps.apple.com/ng/app/ounjefood/id6762204959"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 bg-[#2C5E2E] text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow-md hover:bg-[#1a3f1c] transition cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current text-white shrink-0" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.56 2.95-1.39z" />
                  </svg>
                  Download OunjeFood on Play Store
                </motion.a>
              </>
            ) : (
              <>
                <NotificationBell />
                <span className="text-xs font-semibold text-[#1A3F1C]/75">
                  Hi, <span className="font-bold text-[#2C5E2E]">{user?.name}</span> ({role})
                </span>
                <button
                  onClick={() => {
                    if (location.pathname === "/") {
                      navigate(getDashboardLink());
                    } else {
                      navigate("/");
                    }
                  }}
                  className={`font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${location.pathname === "/"
                    ? "premium-cta-btn text-white"
                    : "bg-[#ECFFED] text-[#2C5E2E] hover:bg-[#2C5E2E] hover:text-white border border-[#2C5E2E]/20"
                    }`}
                >
                  {location.pathname === "/" ? "Dashboard" : "Home"}
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
          {/* ─── Mobile Right Area: Bell + Hamburger ─── */}
          <div className="md:hidden flex items-center gap-2.5">
            {isAuthenticated && <NotificationBell />}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex items-center justify-center bg-[#2C5E2E] rounded-xl shadow-sm"
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
                  to={logoLink}
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
                {!isPortalPage && menuItems.map((item, i) => {
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
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-2xl text-base font-semibold transition ${isActive
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

                <div className={isPortalPage ? "space-y-4" : "border-t border-white/10 my-6 pt-6 space-y-4"}>
                  {!isAuthenticated ? (
                    <>
                      {/* <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLoginClick();
                        }}
                        className="w-full flex items-center justify-center bg-white text-[#2C5E2E] font-bold py-3.5 rounded-2xl text-sm shadow-md transition cursor-pointer"
                      >
                        Log In
                      </button> */}
                      <a
                        href="https://apps.apple.com/ng/app/ounjefood/id6762204959"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full flex items-center justify-center bg-[#FFC727] text-[#1A3F1C] font-bold py-3.5 rounded-2xl text-sm shadow-md transition cursor-pointer text-center"
                      >
                        Download App
                      </a>
                    </>
                  ) : (
                    <div className="space-y-3 text-white text-center">
                      <p className="text-xs text-white/60">Logged in as {user?.name} ({role})</p>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (location.pathname === "/") {
                            navigate(getDashboardLink());
                          } else {
                            navigate("/");
                          }
                        }}
                        className={`w-full font-bold py-3 rounded-2xl text-sm transition cursor-pointer border ${location.pathname === "/"
                          ? "premium-cta-btn text-white text-center px-4"
                          : "bg-white/10 text-white border-transparent hover:bg-white/20"
                          }`}
                      >
                        {location.pathname === "/" ? "Dashboard" : "Go to Home"}
                      </button>
                      {/* <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          logout();
                          navigate("/");
                        }}
                        className="w-full text-red-400 hover:text-red-500 font-bold py-2 text-sm transition cursor-pointer"
                      >
                        Logout
                      </button> */}
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
      <RoleSelectionModal
        isOpen={isRoleSelectOpen}
        onClose={() => setIsRoleSelectOpen(false)}
        onSelectCustomer={() => {
          setIsRoleSelectOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

export default Header;
