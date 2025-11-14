import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Newsletter service is currently unavailable");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      x: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <footer className="bg-black text-white py-12 px-6 md:px-14 relative overflow-visible">
      {/* Floating WhatsApp Button (Visible only on desktop) */}
      <motion.a
        href="https://wa.me/234XXXXXXXXXX" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 1, y: 0 }}
        animate={{
          scale: [1, 1.08, 1],
          y: [0, -4, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.15 }}
        className="
          hidden lg:flex
          absolute 
          -top-9 right-20 
          bg-[#FFC727] 
          w-[65px] h-[65px] 
          items-center justify-center 
          rounded-[16px] 
          shadow-2xl 
          hover:bg-[#ffda55] 
          transition
        "
      >
        <motion.img
          src="/icons/whatsapp-icon.png"
          alt="WhatsApp"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="w-[50px] h-[50px]"
        />
      </motion.a>

      {/* Fixed WhatsApp Button for Mobile and iPad */}
      <motion.a
        href="https://wa.me/234XXXXXXXXXX" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="
          fixed
          bottom-6 right-6
          lg:hidden
          bg-[#FFCA3A]
          w-[56px] h-[56px]
          sm:w-[60px] sm:h-[60px]
          md:w-[65px] md:h-[65px]
          items-center justify-center
          rounded-full
          shadow-2xl
          z-50
          flex
          hover:bg-[#ffda55]
          transition-colors
        "
      >
        <motion.img
          src="/icons/whatsapp-icon.png"
          alt="WhatsApp"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="w-[32px] h-[32px] sm:w-[36px] sm:h-[36px] md:w-[40px] md:h-[40px]"
        />
      </motion.a>

      {/* Wrapper */}
      <motion.div
        className="max-w-[1200px] mx-auto w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
      >
        {/* Logo + Newsletter */}
        <motion.div
          className="flex flex-col items-start border-b border-[#2C5E2E]/20 pb-10 mb-10 w-full"
          variants={itemVariants}
        >
          <motion.div
            className="flex items-center gap-2 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <motion.img
              src="/images/ounje-logo.png"
              alt="Ounje logo"
              className="w-[35px] h-[35px]"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            />
            <h2 className="text-[22px] font-bold uppercase">
              <span className="text-white">OUNJE</span>
              <span className="text-[#FFC727]">FOOD</span>
            </h2>
          </motion.div>

          {/* Newsletter Bar */}
          <motion.form
            onSubmit={handleSubscribe}
            className="flex w-full bg-white rounded-full overflow-hidden shadow-md max-w-[100%]"
            variants={itemVariants}
          >
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 text-gray-800 text-sm md:text-base outline-none"
              required
            />
            <motion.button
              type="submit"
              className="bg-[#FFC727] text-[#1A3F1C] font-medium px-8 md:px-10 py-4 flex items-center justify-center gap-2 rounded-r-full hover:bg-[#ffda55] transition text-sm md:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-7-7 7 7-7 7"
                />
              </motion.svg>
            </motion.button>
          </motion.form>
        </motion.div>

        {/* Links Section - Centered */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 text-center gap-10 justify-center items-start"
          variants={containerVariants}
        >
          {/* Be a part of us */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="font-bold mb-4 pb-1 text-[16px] border-b border-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Be a part of us
            </motion.h3>
            <ul className="space-y-2 text-sm">
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/#customer"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Careers
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/#vendor"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Ounje-food for Vendors
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/#rider"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Be a Rider for Ounje-food
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Links of Interest */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="font-bold mb-4 pb-1 text-[16px] border-b border-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Links of Interest
            </motion.h3>
            <ul className="space-y-2 text-sm">
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/aboutus"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    About Us
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/contactus#FAQ"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    FAQ
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/contactus#contactHero"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Contact Us
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
            </ul>
          </motion.div>

          {/* Privacy & Compliance */}
          <motion.div variants={itemVariants}>
            <motion.h3
              className="font-bold mb-4 pb-1 text-[16px] border-b border-transparent"
              whileHover={{ scale: 1.05 }}
            >
              Privacy & Compliance
            </motion.h3>
            <ul className="space-y-2 text-sm">
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/privacyandcompliance"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Terms & Conditions
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/privacyandcompliance"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Privacy Policy
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/privacyandcompliance"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Cookies Policy
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
              <motion.li
                variants={itemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/privacyandcompliance"
                  className="hover:text-[#FFC727] transition-colors duration-200 inline-block"
                >
                  <motion.span
                    variants={linkVariants}
                    whileHover="hover"
                    className="flex items-center gap-1"
                  >
                    Compliance
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Copyright Centered */}
        <motion.div
          className="text-center text-gray-400 text-xs md:text-sm mt-10"
          variants={itemVariants}
        >
          © {new Date().getFullYear()} Ounje. All rights reserved.
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;
