import React from "react";

const Footer = () => (
  <footer className="bg-[#1a2a16] text-white py-8">
    <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-8">
      {/* Logo and social */}
      <div className="mb-6 md:mb-0">
        <div className="font-bold text-2xl mb-2">OUNJE</div>
        <div className="text-sm">
          &copy; {new Date().getFullYear()} Ounje. All rights reserved.
        </div>
      </div>
      {/* Links */}
      <div className="flex flex-col md:flex-row gap-8">
        <div>
          <div className="font-semibold mb-2">Be a part of us</div>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Ounje
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Chew
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Company
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Links of Interest</div>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#" className="hover:underline">
                About us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Order food
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-2">Privacy & Compliance</div>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Cookies Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
