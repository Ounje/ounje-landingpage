import { useState } from "react";
import ComingSoonModal from "../modals/ComingSoonDialog";

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="home" className="relative h-[420px] md:h-[1000px]">
      {/* Hero content */}
      <div className="relative z-10 flex  flex-col items-center text-center text-black pt-5 px-3 h-full">
        <h1 className="text-6xl md:text-[200px] lg:text-[350px] font-bold mb-2 mt-20 md:mt-20 text-[#2C5E2E]">
          Ounje
        </h1>
        <div className="flex flex-col items-center md:flex-row gap-2 md:gap-7 mt-5 md:mt-20 text-[12px] md:text-[14px] lg:text-[20px]">
          <button
            className="bg-yellow-400 text-black flex justify-center items-center gap-2 md:font-semibold w-[250px] h-[39px] md:w-[275px] md:h-[45px] lg:w-[359px] lg:h-[66px] rounded-[8px] md:rounded-[20px] hover:bg-yellow-300 transition "
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/icons/mage_playstore.png"
              alt="playstore icon"
              className="w-[30px] h-[30px]"
            />
            <span>Download on Google Play</span>
          </button>

          <button
            className="bg-yellow-400 text-black flex justify-center items-center gap-2 md:font-semibold w-[250px] h-[39px] lg:w-[359px] lg:h-[66px]  rounded-[8px] md:rounded-[20px] hover:bg-yellow-300 transition"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src="/icons/apple-icon.png"
              alt="ios-icon"
              className="w-[30px] h-[30px]"
            />
            <span>Download on APP Store</span>
          </button>
        </div>
        <p className=" mb-2 md:mb-6 text-[12px] md:text-[20px] font-small text-black mt-5 md:mt-10">
          Order Fast. Eat Fresh. Spend Less
        </p>
      </div>

      {/* Images positioned at bottom */}
      <div className="absolute bottom-[-5%] left-0 right-0 flex justify-between ">
        <img
          src="/icons/Street Food-cuate.png"
          alt="Street Food-cuate"
          className="w-[157px] h-[105px] md:w-[500px] md:h-[320px]"
        />
        <img
          src="/icons/Take Away-cuate.png"
          alt="Take Away-cuate"
          className="w-[157px] h-[105px] md:w-[500px] md:h-[300px]"
        />
      </div>

      {/* Modal */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default HeroSection;
