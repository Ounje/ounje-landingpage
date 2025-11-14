import { Button } from "../Button";

export default function JoinTeamSection() {
  return (
    <section className="py-16 bg-[#E9FFEF] flex justify-center items-center">
      {/* Wrapper Card */}
      <div className="w-[90vw] md:w-[70vw] lg:w-[55vw] bg-[#1A3F1C] rounded-[24px] py-10 px-6 md:px-12 flex flex-col items-center text-center shadow-md">

        {/* Title */}
        <h2 className="text-white text-2xl md:text-3xl font-bold mb-2">
          Join Our Team
        </h2>

        {/* Subtitle */}
        <p className="text-white text-sm md:text-base max-w-[600px] leading-relaxed mb-6">
          Together we can make a difference in serving the nation one plate at a
          time.
        </p>

        {/* Button */}
        <Button className="bg-[#FFC727] hover:bg-[#FFD34A] text-black font-medium rounded-[14px] px-6 md:px-10 py-3 flex items-center gap-2 text-sm md:text-base">
          Click Here To Check For Open Roles
          <img 
            src="/icons/next-black.png" 
            alt="arrow icon" 
            className="w-4 md:w-5"
          />
        </Button>
      </div>
    </section>
  );
}
