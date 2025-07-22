import { useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  icon: string;
  image: string;
}

export default function TeamSection() {
  const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Madu South Okechukwu",
      position: "CEO, Co-Founder",
      icon: "X 冊",
      image: "/images/madu.png",
    },
    {
      id: "2",
      name: "Dayan Perera",
      position: "CTO, Co-Founder",
      icon: "X 冊",
      image: "/images/dayan.png",
    },
    {
      id: "3",
      name: "Ago Chukwubuikem",
      position: "Full-Stack Developer",
      icon: "X 冊",
      image: "/images/ago.png",
    },
    {
      id: "4",
      name: "Samuel Kayode",
      position: "UI/UX Design Intern",
      icon: "X 冊",
      image: "/images/samuel.png",
    },
    {
      id: "5",
      name: "Micheal Osaretin",
      position: "Graphic/Brand Designer",
      icon: "X 冊",
      image: "/images/micheal.png",
    },
  ];

  // Set Madu's image as the default
  const [activeImage, setActiveImage] = useState(teamMembers[0].image);
  const [activeMember, setActiveMember] = useState(teamMembers[0].id);

  return (
    <section className=" bg-[#2C5E2E] pt-10">
      {/* title banner */}
      <div className="h-[50px] md:h-[100px] bg-[#FFCA3A] text-center w-full my-10 items-center flex justify-center">
        <h1 className="text-black text-lg md:text-4xl  font-bold">
          Meet The Team
        </h1>
      </div>
      {/* Mobile: Image above the list */}
      <div className="md:hidden sticky flex justify-center mb-6">
        <div className="w-[200px] h-[200px] rounded-[20px] overflow-hidden border-4 border-[#FFCA3A] shadow-lg">
          <img
            src={activeImage}
            alt="Team member"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col  gap-6 md:gap-8 justify-center items-center">
        {/* Desktop: Image to the left */}
        <div className="hidden md:block sticky top-6 h-fit">
          <div className="w-[300px] h-[300px] rounded-[20px] overflow-hidden border-4 border-[#FFCA3A] shadow-lg">
            <img
              src={activeImage}
              alt="Team member"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Team member list */}
        <div className="w-full md:w-2/3  space-y-3 md:space-y-4 text-white">
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
                  <p className="text-white text-sm md:text-white">
                    {member.position}
                  </p>
                </div>
                <span className="text-white text-sm md:text-white">
                  {member.icon}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
