import { Button } from "./Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface Category {
  id: string;
  title: string;
  desc: string;
}

const projectCategories: Category[] = [
  {
    id: "1",
    title: "Egbon",
    desc: "Be a part of our amazing community. Let's show you how Ounje realy works",
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

const TestimonialsSection = () => (
  <section className="py-16 px-10 text-black flex justify-center items-center">
    <div>
      {/* Section Text */}
      <div className="text-center">
        <h2>Be a Part of Us</h2>
        <p className="my-5 max-w-[460px] mx-auto">
          Be a part of our amazing community. Let’s show you how Ounje works
        </p>
      </div>
      {/* image and tabs */}

      <div>
        <Tabs className="w-full" defaultValue={firstTab}>
          <TabsList className="w-full bg-[#FFC727] rounded-full mb-5 gap-10 ">
            {projectCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="py-3 w-full rounded-3xl data-[state=active]:bg-[#2C5E2E]"
              >
                <span>{category.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {projectCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <div className="flex justify-center">
                {category.id === "1" && (
                  <div>
                    <img
                      src="/images/egbon-screen.png"
                      alt="egbon screen"
                      className="h-[80vh]"
                    />
                  </div>
                )}
                {category.id === "2" && (
                  <div>
                    <img
                      src="/images/vendor-screen.png"
                      alt="egbon screen"
                      className="h-[80vh]"
                    />
                  </div>
                )}
                {category.id === "3" && (
                  <div>
                    <img
                      src="/images/rider-screen.png"
                      alt="egbon screen"
                      className="h-[80vh]"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          ))}

          <div className="md:w-[55vw] bg-[#2C5E2E] py-5 px-10 rounded-[20px] flex flex-col justify-center items-center gap-1 mt-8">
            {projectCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div>
                  {category.id == "1" && (
                    <p className="text-center text-white text-semibold text-[20px]">
                      {category.desc}
                    </p>
                  )}
                  {category.id == "2" && (
                    <p className="text-center text-white text-semibold text-[20px]">
                      {category.desc}
                    </p>
                  )}
                  {category.id == "3" && (
                    <p className="text-center text-white text-semibold text-[20px]">
                      {category.desc}
                    </p>
                  )}
                </div>
              </TabsContent>
            ))}
            <p className="text-center text-white text-semibold text-[20px]"></p>
            <div className="md:flex gap-7 mt-5 text-[10px] md:text-[20px]">
              <button className="bg-yellow-400 text-black flex justify-center items-center gap-2 px-3  rounded-[8px] md:rounded-[20px] hover:bg-yellow-300 transition py-2">
                <img
                  src="/icons/mage_playstore.png"
                  alt="playstore icon"
                  className="w-[20px] h-[20px] md:w-[30px] md:h-[30px]"
                />
                <span>Download on Google Play</span>
              </button>
              <button className="bg-yellow-400 text-black flex justify-center items-center gap-3 md:gap-2 px-3  rounded-[8px] md:rounded-[20px] hover:bg-yellow-300 transition py-2 ">
                <img
                  src="/icons/apple-icon.png"
                  alt="ios-icon"
                  className="w-[22px] h-[22px] md:w-[33px] md:h-[33px]"
                />
                <span>Download on APP Store</span>
              </button>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
