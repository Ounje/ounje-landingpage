import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";
import { useState } from "react";
import ComingSoonModal from "../modals/ComingSoonDialog";

interface Category {
  id: string;
  title: string;
  desc: string;
}

const projectCategories: Category[] = [
  {
    id: "1",
    title: "Egbon",
    desc: "Be a part of our amazing community. Let's show you how Ounje really works.",
  },
  {
    id: "2",
    title: "Vendor",
    desc: "Reach more hungry customers and grow your business — OUNJE connects your kitchen to the streets, campuses, and communities that love your food.",
  },
  {
    id: "3",
    title: "Rider",
    desc: "Turn your hustle into steady income, deliver meals, earn on your own terms, and become a trusted part of the OUNJE network.",
  },
];

const firstTab = projectCategories[0].id;

const JoinUsSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      id="joinUs"
      className="py-16 px-6 text-black flex justify-center items-center"
    >
      <div>
        {/* Header */}
        <div className="text-center">
          <h2>Be a Part of Us</h2>
          <p className="my-5 max-w-[460px] mx-auto">
            Be a part of our amazing community. Let’s show <br /> you how Ounje works
          </p>
        </div>

        {/* Tabs */}
        <div>
          <Tabs className="w-full" defaultValue={firstTab}>
            {/* Tab buttons */}
            <TabsList className="w-full bg-[#FFC727] p-1 rounded-[20px] mb-5 gap-3 md:gap-10">
              {projectCategories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="py-1 md:py-3 font-bold w-full rounded-2xl data-[state=active]:bg-[#2C5E2E] data-[state=active]:text-white transition-all duration-300 ease-in-out"
                >
                  <span>{category.title}</span>
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#2C5E2E] transition-all duration-300 
                  transform origin-left scale-x-0 data-[state=active]:scale-x-100 w-full"
                  />
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Content */}
            {projectCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="flex justify-center">
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center"
                  >
                    {category.id === "1" && (
                      <img
                        src="/images/egbon-screen.png"
                        alt="Egbon screen"
                        className="h-[80vh]"
                      />
                    )}
                    {category.id === "2" && (
                      <img
                        src="/images/vendor-screen.png"
                        alt="Vendor screen"
                        className="h-[80vh]"
                      />
                    )}
                    {category.id === "3" && (
                      <img
                        src="/images/rider-screen.png"
                        alt="Rider screen"
                        className="h-[80vh]"
                      />
                    )}
                  </motion.div>
                </div>
              </TabsContent>
            ))}

            {/* Join Button Area */}
            <div className="md:w-[55vw] bg-[#2C5E2E] py-5 px-10 rounded-[20px] flex flex-col justify-center items-center gap-3 mt-8">
              {projectCategories.map((category) => (
                <TabsContent key={category.id} value={category.id}>
                  <p className="text-center text-white font-semibold text-[15px]">
                    {category.desc}
                  </p>
                </TabsContent>
              ))}

              {/* Join the Waitlist Button */}
              <motion.button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FFC727] text-[#1A3F1C] flex justify-center items-center gap-2 md:font-semibold 
                           w-[200px] h-[39px] md:w-[275px] md:h-[45px] lg:w-[359px] lg:h-[66px]
                           rounded-[8px] md:rounded-[20px] hover:bg-[#ffda55] transition mt-3"
              >
                <span>Join the waitlist</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14m-7-7 7 7-7 7"
                  />
                </svg>
              </motion.button>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default JoinUsSection;
