import CookiesPolicy from "./CookiesPolicy";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

export default function PolicyPage() {
  interface Tab {
    id: number;
    title: string;
    content: React.ReactNode;
  }

  const tabs: Tab[] = [
    {
      id: 1,
      title: "Privacy Policy",
      content: <PrivacyPolicy />,
    },
    {
      id: 2,
      title: "Terms and Conditions",
      content: <TermsAndConditions />,
    },
    {
      id: 3,
      title: "Cookies Policy",
      content: <CookiesPolicy />,
    },
  ];
  return (
    <section className="mt-10">
      <div className="mt-20">
        <div>
          <Tabs
            defaultValue={tabs[0].id.toString()}
            className="w-full flex flex-col lg:flex-row justify-center gap-5 p-10 "
          >
            <TabsList className="w-full lg:w-[20%] bg-transparent lg:bg-[#FFF3E8] p-1 rounded-[20px] mb-5 gap-10 md:gap-10 flex-col mt-5 ">
              {tabs.map((tab) => (
                <TabsTrigger
                  className="bg-[#FFF3E8] lg:bg-transparent rounded-[20px] w-full h-[52px] gap-2 border-none lg:border-b border-[#1A3F1C] shadow-none text-[#2C5E2E] group"
                  key={tab.id}
                  value={tab.id.toString()}
                >
                  <div className="rounded-full bg-[#2C5E2E] w-4 h-4 opacity-0 group-focus:opacity-100"></div>
                  {tab.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((tab) => (
              <TabsContent
                className="w-full lg:w-[80%]"
                key={tab.id}
                value={tab.id.toString()}
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
}
