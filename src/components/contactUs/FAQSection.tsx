import { useEffect, useState } from "react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    id: "1",
    question: "What is Ounje?",
    answer:
      "Ounje is a platform that connects you to your favorite local food vendors for fast and affordable food delivery within your neighborhood.",
  },
  {
    id: "2",
    question: "How Do I Place an Order?",
    answer:
      "Simply sign up on the app, browse vendors or build your own plate, place your order, and track your delivery in real time.",
  },
  {
    id: "3",
    question: "Is Ounje Available In My Area?",
    answer:
      "We currently operate in select areas across Lagos. You can check availability by entering your delivery address in the app.",
  },
  {
    id: "4",
    question: "Can I pay On Delivery?",
    answer:
      "No. All payments are made securely online through our integrated Paystack system to ensure smooth transactions.",
  },
  {
    id: "5",
    question: "Do I Need To Pay To Join Ounje?",
    answer:
      "No. Signing up on Ounje is completely free for customers, vendors, and riders.",
  },
  {
    id: "6",
    question: "How Do I Become A Vendor Or Rider On Ounje?",
    answer:
      "Just head to our website or app, click on “Join Us,” and choose whether you want to sign up as a vendor or rider. It’s quick and easy.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeFAQ = faqs[activeIndex];

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleAnswerMobile = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const nextQuestion = () => {
    setActiveIndex((prev) => (prev + 1) % faqs.length);
  };

  const prevQuestion = () => {
    setActiveIndex((prev) => (prev - 1 + faqs.length) % faqs.length);
  };

  return (
    <section id="FAQ" className="pb-8 md:pb-12 lg:pb-16">
      <div className="w-full py-4 md:py-5 bg-[#1A3F1C] text-white text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">FAQs</h2>
      </div>

      <div className="flex justify-center items-center px-4 mb-8 md:mb-12">
        <img
          src="/images/FAQs-cuate.png"
          alt="FAQs image"
          className="w-[200px] h-auto sm:w-[280px] md:w-[350px] lg:w-[400px] object-contain"
        />
      </div>

      <div className="px-4 md:px-6 lg:px-8">
        {/* mobile screen faqs */}
        <div className="md:hidden mb-8">
          <div className="relative flex justify-center">
            {/* faq box */}
            <div
              className="bg-[#FFC727] rounded-xl items-center p-5 md:p-6 text-center shadow-lg cursor-pointer transition-all min-h-[280px] max-h-[400px] w-full max-w-[320px] flex flex-col justify-center"
              onClick={() => toggleAnswerMobile(activeIndex)}
            >
              <p className="text-xs md:text-sm text-gray-700 mb-3 font-medium">
                {openIndex !== activeIndex ? "Tap to view" : "Tap to close"}
              </p>
              <div className="h-full flex justify-center items-center px-2">
                {openIndex !== activeIndex ? (
                  <h3 className="text-sm md:text-base text-[#1A3F1C] leading-snug font-semibold">
                    {activeFAQ.question}
                  </h3>
                ) : (
                  <p className="text-[#1A3F1C] text-sm md:text-base leading-relaxed">
                    {activeFAQ.answer}
                  </p>
                )}
              </div>
            </div>
            {/* Navigation Arrows */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevQuestion();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 py-2 px-3 rounded-full border-2 border-[#2C5E2E] bg-white text-[#2C5E2E] hover:bg-[#2C5E2E] hover:text-white transition shadow-md"
              aria-label="Previous question"
            >
              ❮
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextQuestion();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 py-2 px-3 rounded-full border-2 border-[#2C5E2E] bg-white text-[#2C5E2E] hover:bg-[#2C5E2E] hover:text-white transition shadow-md"
              aria-label="Next question"
            >
              ❯
            </button>
          </div>
        </div>
        {/* desktop screen faqs */}
        <div className="hidden md:grid max-w-6xl mx-auto grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#FFC727] rounded-xl p-6 lg:p-8 text-center shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-105 min-h-[320px] flex flex-col justify-center"
              onClick={() => toggleAnswer(index)}
            >
              <p className="text-xs md:text-sm text-gray-700 mb-4 font-medium">
                {openIndex !== index ? "Tap to view" : "Tap to close"}
              </p>
              <div className="h-full flex justify-center items-center">
                {openIndex !== index ? (
                  <h3 className="text-base lg:text-lg text-[#1A3F1C] leading-snug font-semibold">
                    {faq.question}
                  </h3>
                ) : (
                  <p className="text-[#1A3F1C] text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
