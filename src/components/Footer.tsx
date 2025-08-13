import { Link } from "react-router-dom";
import { Button } from "./Button";
import MailchimpSubscribe from "react-mailchimp-subscribe";

const Footer = () => {
  const MAILCHIMP_URL = import.meta.env.VITE_MAILCHIMP_URL;

  return (
    <footer className="absolute bg-black text-white py-8 w-full">
      <div className="max-w-6xl mx-auto px-4 flex flex-col justify-center items-start md:items-center gap-8 w-full">
        {/* Logo and copyright */}
        <div className="flex items-center justify-start w-full gap-4 md:gap-2 min-w-[200px]">
          <img
            src="/images/ounje-logo.png"
            alt="Ounje Logo"
            className="w-10 h-10 rounded-lg "
          />
          <span className="font-extrabold text-2xl ml-2">OUNJE</span>
        </div>
        {/* Subscribe to newsletter */}

        {MAILCHIMP_URL ? (
          <MailchimpSubscribe
            url={MAILCHIMP_URL}
            render={({ subscribe, status, message }) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get("email") as string;
                  subscribe({ EMAIL: email });
                }}
                className="bg-white rounded-[20px] shadow-lg  flex w-full overflow-hidden"
              >
                <input
                  required
                  disabled={status === "sending" || status === "success"}
                  type="text"
                  placeholder="Enter email, Subscribe to our newsletter "
                  className="flex-1 outline-none text-gray-700 placeholder-gray-400 text-[12px] md:text-[20px] px-2 py-2 md:px-2 md:py-5"
                />
                <div className="bg-[#FFCA3A] py-1 px-3 md:py-3 md:px-7 text-[12px]">
                  <Button
                    disabled={status === "sending" || status === "success"}
                  >
                    {status === "sending"
                      ? "Subscribing..."
                      : status === "success"
                      ? "Subscribed!"
                      : status === "error"
                      ? "Try Again"
                      : "Subscribe"}
                  </Button>
                </div>
              </form>
            )}
          />
        ) : (
          <div className="text-white text-center p-4">
            Newsletter service is currently unavailable
          </div>
        )}

        {/* Links */}
        <div className="flex flex-col md:flex-row gap-10 w-full justify-between">
          <div className="">
            <div className="font-semibold mb-5 text-start md:text-center">
              Be a part of us
            </div>
            <ul className="text-sm font-normal space-y-1 text-grey text-center">
              <li className="">
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
            <div className="font-semibold mb-5 text-start md:text-center">
              Links of Interest
            </div>
            <ul className="text-sm font-normal space-y-1 text-grey text-center">
              <li>
                <Link to="#aboutus" className="hover:underline">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#FAQ" className="hover:underline">
                  FAQ
                </a>
              </li>
              <li>
                <Link to="#contactus" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="">
            <div className="font-semibold mb-5 text-start md:text-center">
              Privacy & Compliance
            </div>
            <ul className="text-sm font-normal space-y-1 text-grey text-center">
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
};

export default Footer;
