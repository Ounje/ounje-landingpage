import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  linkdln: string;
  x: string;
  image: string;
}

export default function TeamSection() {
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Madu South Okechukwu",
      position: "CEO, Co-Founder",
      linkdln: "linkdn.com",
      x: "x.com",
      image: "/images/madu.png",
    },
    {
      id: "2",
      name: "Dayan Perera",
      position: "CTO, Co-Founder",
      linkdln: "linkdn.com",
      x: "x.com",
      image: "/images/dayan.png",
    },
    {
      id: "3",
      name: "Ago Chukwubuikem",
      position: "Full-Stack Developer",
      linkdln: "linkdn.com",
      x: "x.com",
      image: "/images/ago.png",
    },
    {
      id: "4",
      name: "Samuel Kayode",
      position: "UI/UX Design Intern",
      linkdln: "linkdn.com",
      x: "x.com",
      image: "/images/samuel.png",
    },
    {
      id: "5",
      name: "Micheal Osaretin",
      position: "Graphic/Brand Designer",
      linkdln: "linkdn.com",
      x: "x.com",
      image: "/images/micheal.png",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const activeMem = teamMembers[activeIndex];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  // Set Madu's image as the default
  const [activeImage, setActiveImage] = useState(teamMembers[0].image);
  const [activeMember, setActiveMember] = useState(teamMembers[0].id);

  return (
    <section className=" pt-10">
      {/* title banner */}
      <div className="hidden h-[50px] md:h-[100px] bg-[#2C5E2E] text-center w-full my-10 items-center flex justify-center">
        <h1 className="text-white text-lg md:text-4xl  font-bold">
          Meet The Team
        </h1>
      </div>
      {/* Mobile: Image above the list */}
      <div className="md:hidden">
        <div className="relative flex justify-center mb-6">
          {/* Image Container */}
          <div className="w-[300px] h-[300px] rounded-[20px] shadow-lg">
            <img
              src={activeMem.image}
              alt={activeMem.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 py-2 px-3 rounded-[50%] border border-[#2C5E2E] text-[#2C5E2E]  hover:bg-gray-100"
          >
            ❮
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 py-2 px-3 rounded-[50%] border border-[#2C5E2E]  text-[#2C5E2E] hover:bg-gray-100"
          >
            ❯
          </button>
        </div>

        {/* Mobile: Active Member Info */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold">{activeMem.name}</h3>
          <p className="text-[#2C5E2E]">{activeMem.position}</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href={activeMem.x}>
              <img src="/icons/x-logo.png" alt="X" className="w-6 h-6" />
            </a>
            <a href={activeMem.linkdln}>
              <img
                src="/icons/linkdln-logo.png"
                alt="LinkedIn"
                className="w-6 h-6"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col  gap-6 md:gap-8 justify-center items-center">
        {/* Desktop: Image to the left */}
        <div className="hidden md:block sticky top-6 h-fit">
          <div className="w-[300px] h-[300px] shadow-lg">
            <img
              src={activeImage}
              alt="Team member"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Team member list */}
        <div className="w-full md:w-2/3  space-y-3 md:space-y-4 text-[#2C5E2E]">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`p-3 md:p-4 rounded-lg transition-colors cursor-pointer ${
                activeMember === member.id
                  ? "text-[#FFCA3A] shadow-sm"
                  : "hover:text-[#FFCA3A]"
              }`}
              onMouseEnter={() => {
                setActiveImage(member.image);
                setActiveMember(member.id);
              }}
              onClick={() => {
                setActiveImage(member.image);
                setActiveMember(member.id);
              }}
            >
              <div className="flex justify-between  md:mx-10 items-start border-b border-[#FFCA3A] py-4">
                <div className="lg:w-[500px] gap-[5px]">
                  <h3 className="font-bold text-md md:text-lg">
                    {member.name}
                  </h3>
                  <p className="text-[#2C5E2E] text-sm md:text-[#2C5E2E]">
                    {member.position}
                  </p>
                </div>
                <span className="text-[#2C5E2E] text-sm md:text-[#2C5E2E] flex gap-2">
                  <a href={member.x}>
                    <img src="/icons/linkdln-logo.png" alt="linkdln logo" />
                  </a>
                  <a href={member.linkdln}>
                    <img src="/icons/x-logo.png" alt="x logo" />
                  </a>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
