const HeroSection = () => (
  <section className="relative h-[420px] md:h-[1000px]">
    {/* Hero content */}
    <div className="relative z-10 flex flex-col items-center text-center text-black px-3 h-full">
      <h1 className="text-5xl md:text-[350px] font-bold mb-4 mt-5 md:mt-10 text-[#2C5E2E]">
        Ounje
      </h1>
      <div className="flex gap-7 mt-20 text-[12px] md:text-[20px]">
        <button className="bg-yellow-400 text-black flex justify-center items-center gap-2 md:font-semibold px-3 py-0.5 md:px-5 md:py-2 rounded-[20px] hover:bg-yellow-300 transition">
          <img
            src="/icons/mage_playstore.png"
            alt="playstore icon"
            className="w-[30px] h-[30px]"
          />
          <span>Download on Google Play</span>
        </button>
        <button className="bg-yellow-400 text-black flex justify-center items-center gap-2 md:font-semibold px-3 py-0.5 md:px-5 md:py-2 rounded-[20px] hover:bg-yellow-300 transition">
          <img
            src="/icons/apple-icon.png"
            alt="ios-icon"
            className="w-[30px] h-[30px]"
          />
          <span>Download on APP Store</span>
        </button>
      </div>
      <p className="mb-6 text-[12px] md:text-[20px] font-small text-black mt-5 md:mt-10">
        Order Fast. Eat Fresh. Spend Less
      </p>
    </div>

    {/* Images positioned at bottom */}
    <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-4">
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
  </section>
);

export default HeroSection;
