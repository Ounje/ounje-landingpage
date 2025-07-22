export default function Hero() {
  return (
    <>
      <section
        className="relative top-0 h-[420px] md:h-[100vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(/images/AboutHero-img.png)` }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-[#0B3B0D80]" />

        {/* content */}
        <div className="relative inset-0 text-center">
          <h1 className="font-bold text-white md:text-[128px]">About Us</h1>
          <span className="text-white">Join us to meet the team</span>
        </div>
      </section>
    </>
  );
}
