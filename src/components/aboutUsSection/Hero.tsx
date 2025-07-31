export default function Hero() {
  return (
    <>
      <section className="p-5 mb-20 h-[100vh] md:h-[120vh]">
        {/* content */}
        <div className=" items-center text-center mt-10">
          <h1 className="font-bold text-[#2C5E2E] md:text-[128px] mt-20">
            About Us
          </h1>
          <p className="text-[#2C5E2E] mt-10">Join us to meet the team</p>
          <div className="flex justify-center mt-10">
            <img
              src="/images/AboutHero-img.png"
              alt="about us image"
              className=" items-center w-[80vw] md:w-[60vw] h-[65vw] lg:h-[80vh]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
