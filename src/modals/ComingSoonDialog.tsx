import { useEffect } from "react";
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
      <div className="bg-[#2C5E2E] w-[343px] h-[460px] lg:w-[1245px] lg:h-[500px] py-2 px-6 rounded-[20px] shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 lg:text-[20px] right-4 text-white hover:text-black"
        >
          &times;
        </button>
        <div className="text-2xl flex items-center gap-2 lg:gap-4 font-bold text-start mb-3">
          <img
            src="/logo/ounje.png"
            className="w-[16px] h-[19px] lg:w-[34px] lg:h-[39px]"
            alt="Ounje logo"
          />
          <span className="text-[14px] lg:text-[24px] text-white">OUNJE</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[12px]">
          <h2 className="text-center text-white text-[24px] lg:text-[64px] mb-3">
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);

                    const data = {
                      EMAIL: (formData.get("email") as string) || "",
                      FNAME: (formData.get("fname") as string) || "",
                      LNAME: (formData.get("lname") as string) || "",
                      PHONE: (formData.get("phone") as string) || "",
                    } as any;

                    subscribe(data);
                    {
                      status === "success" && onClose;
                    }
                  }}
                  className="w-full "
                >
                  {/* First Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-[80%] mx-auto">
                    <input
                      type="text"
                      name="fname"
                      placeholder="Enter Your First Name i.e Dayan"
                      required
                      className="w-full px-4 py-3 lg:py-6 rounded-[20px] text-gray-800 border-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {/* Last Name */}
                    <input
                      type="text"
                      name="lname"
                      placeholder="Enter Your Last Name"
                      required
                      className="w-full px-4 py-3 lg:py-6 rounded-[20px] text-gray-800 border-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {/* Phone */}
                    <input
                      type="text"
                      name="phone"
                      placeholder="+234"
                      className="w-full px-4 py-3 lg:py-6 rounded-[20px] text-gray-800 border-none focus:ring-2 focus:ring-yellow-400"
                    />
                    {/* Email */}
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      required
                      className="w-full px-4 py-3 lg:py-6 rounded-[20px] text-gray-800 border-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  {/* Submit Button - spans 2 cols */}
                  <div className="flex justify-center mt-5 w-full">
                    <button
                      type="submit"
                      className="w-[40%] mx-auto bg-[#FACC15] text-black font-semibold py-3 lg:py-6 rounded-[20px] hover:bg-yellow-400 transition "
                    >
                      Get Notified
                    </button>
                  </div>

                  {/* Status Messages */}
                  <div className="col-span-1 md:col-span-2">
                    {status === "sending" && (
                      <p className="text-blue-300 text-sm">Sending...</p>
                    )}
                    {status === "error" && (
                      <p
                        className="text-red-400 text-sm"
                        dangerouslySetInnerHTML={{ __html: message as string }}
                      />
                    )}
                    {status === "success" && (
                      <p className="text-green-400 text-sm">
                        Thank you for subscribing!
                      </p>
                    )}
                  </div>
                </form>
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
