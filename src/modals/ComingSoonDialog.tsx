import React, { useEffect } from "react";
import MailchimpSubscribe from "react-mailchimp-subscribe";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ComingSoonModal = ({ isOpen, onClose }: Props) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const MAILCHIMP_URL = import.meta.env.VITE_MAILCHIMP_URL;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#2C5E2E] w-[343px] h-[363px] lg:w-[1245px] lg:h-[414px] py-2 px-6 rounded-[20px] shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 lg:text-[20px] right-4 text-white hover:text-black"
        >
          &times;
        </button>
        <div className="text-2xl flex items-center gap-2 lg:gap-4 font-bold text-start mb-10">
          <img
            src="/logo/ounje.png"
            className="w-[16px] h-[19px] lg:w-[34px] lg:h-[39px]"
            alt="Ounje logo"
          />
          <span className="text-[14px] lg:text-[24px] text-white">OUNJE</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[12px] mt-2">
          <h2 className="text-center text-white text-[24px] lg:text-[64px] mb-10">
            Coming Soon!!
          </h2>
          <p className="text-center mb-4 text-white lg:text-[24px] lg:px-20">
            Enter your mail to get notified when our app is available to
            download on all mobile platforms.
          </p>

          {MAILCHIMP_URL ? (
            <MailchimpSubscribe
              url={MAILCHIMP_URL}
              render={({ subscribe, status, message }) => (
                <div className="w-full">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const email = formData.get("email") as string;
                      subscribe({ EMAIL: email });
                    }}
                    className="lg:flex lg:w-[90%] lg:h-[79px] lg:rounded-[20px] overflow-hidden lg:text-[20px]"
                  >
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="h-full w-full px-4 py-2 mb-4 border rounded-[20px] lg:rounded-none focus:outline-none focus:ring-2 focus:ring-yellow-500 text-[18px]"
                      required
                      disabled={status === "sending" || status === "success"}
                    />
                    <button
                      type="submit"
                      className="h-full w-full py-3 bg-[#FFCA3A] text-grey-400 rounded-[20px] lg:rounded-none hover:bg-[#FFCA3A]/50 hover:text-white transition lg:w-[332px]"
                      disabled={status === "sending" || status === "success"}
                    >
                      {status === "sending"
                        ? "Subscribing..."
                        : status === "success"
                        ? "Subscribed!"
                        : status === "error"
                        ? "Try Again"
                        : "Get Notified"}
                    </button>
                  </form>

                  {status === "error" && (
                    <p
                      className="text-white mt-2 text-center text-sm lg:text-base"
                      dangerouslySetInnerHTML={{ __html: message }}
                    />
                  )}
                  {status === "success" && (
                    <p className="text-white mt-2 text-center">
                      Thank you for subscribing!
                    </p>
                  )}
                </div>
              )}
            />
          ) : (
            <div className="text-white text-center p-4">
              Newsletter service is currently unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
