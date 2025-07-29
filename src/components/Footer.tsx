import React from "react";
import { Button } from "./Button";

const Footer = () => (
  <footer className="bg-black text-white py-8 w-full">
    <div className="max-w-6xl mx-auto px-4 flex flex-col justify-center items-start md:items-center gap-8 w-full">
      {/* Logo and copyright */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-2 min-w-[200px]">
        <img
          src="/images/ounje-logo.png"
          alt="Ounje Logo"
          className="w-10 h-10 rounded-lg "
        />
        <span className="font-extrabold text-2xl ml-2">OUNJE</span>
      </div>
      {/* Subscribe to newsletter */}
      <div className="bg-white rounded-[20px] shadow-lg  flex w-full overflow-hidden">
        <input
          type="text"
          placeholder="Enter email, Subscribe to our newsletter "
          className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-[12px] md:text-[20px] px-2 py-5"
        />
        <div className="bg-[#FFCA3A] py-3 px-7 text-[12px]">
          <Button>Subscribe</Button>
        </div>
      </div>
      {/* Links */}
      <div className="flex flex-col md:flex-row gap-10 w-full justify-between">
        <div className="">
          <div className="font-semibold mb-2">Be a part of us</div>
          <ul className="text-sm space-y-1 text-grey ">
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Ounje for Vendors
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Be a Rider for Ounje
              </a>
            </li>
          </ul>
        </div>
        <div className="">
          <div className="font-semibold mb-2">Links of Interest</div>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#" className="hover:underline">
                About Us
              </a>
            </li>
            <li>
              <a href="#FAQ" className="hover:underline">
                FAQ
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div className="">
          <div className="font-semibold mb-2">Privacy & Compliance</div>
          <ul className="text-sm space-y-1">
            <li>
              <a href="#" className="hover:underline">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Cookies Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Compliance
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="text-center text-gray-400 text-xs mt-8">
      &copy; {new Date().getFullYear()} Ounje. All rights reserved.
    </div>
  </footer>
);

export default Footer;
