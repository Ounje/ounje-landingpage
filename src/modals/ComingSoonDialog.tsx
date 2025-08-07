import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ComingSoonModal({ isOpen, onClose }: Props) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[#2C5E2E] w-[343px] h-[363px] lg:w-[1245px] lg:h-[414px]  p-6 rounded-[20px] shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-black"
        >
          &times;
        </button>
        <div className="text-2xl flex items-center gap-2 lg:gap-4 font-bold text-start mb-2">
          <img
            src="/logo/ounje.png"
            className="w-[16px] h-[19px] lg:w-[34px] lg:h-[39px]"
          />
          <span className="text-[14px] text-[24px] text-white">OUNJE</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[12px] mt-2">
          <h2 className="text-center mb-6 text-white text-[24px] lg:text-[64px]">
            Coming Soon!!
          </h2>
          <p className="text-center mb-4 text-white lg:text-[24px] lg:px-20">
            Enter your mail to get notified when our app is available to
            download on all mobile platforms.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thanks! You'll be notified.");
              onClose();
            }}
            className="lg:flex lg:w-[90%]  lg:h-[79px] lg:rounded-[20px] overflow-hidden lg:text-[20px]"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="h-full w-full px-4 py-2 mb-4 border rounded-[20px] lg:rounded-none  focus:outline-none focus:ring-2 focus:ring-yellow-500"
              required
            />
            <button
              type="submit"
              className="h-full w-full py-3 bg-[#FFCA3A] text-grey-400 rounded-[20px] lg:rounded-none hover:bg-[#FFCA3A]/50 hover:text-white transition lg:w-[332px]"
            >
              Get Notified
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
