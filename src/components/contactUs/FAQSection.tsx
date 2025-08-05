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
    <section id="FAQ">
      <div className="w-full my-3 py-2 bg-[#1A3F1C] text-white text-center">
        {" "}
        <h2>FAQs</h2>{" "}
      </div>

      <div className="flex justify-center items-center mt-10">
        <img src="/images/FAQs-cuate.png" alt="FAQs image" />
      </div>

      <div className="my-20">
        {/* mobile screen faqs */}
        <div className="md:hidden">
          <div className="relative flex justify-center mb-6">
            {/* faq box */}
            <div
              className="my-20 bg-yellow-400 rounded-xl items-center p-6 text-center shadow cursor-pointer transition-all min-h-[375px] w-[300px]"
              onClick={() => toggleAnswerMobile(activeIndex)}
            >
              <p className="text-sm text-gray-600 mb-2">Tap to view</p>
              <div className=" h-full flex justify-center items-center">
                {openIndex !== activeIndex ? (
                  <>
                    <h3 className="text-sm text-black-300 leading-snug">
                      {activeFAQ.question}
                    </h3>
                  </>
                ) : (
                  <p className="text-black text-sm transform-easein">
                    {activeFAQ.answer}
                  </p>
                )}
              </div>
            </div>
            {/* Navigation Arrows */}
            <button
              onClick={prevQuestion}
              className="absolute left-4 top-1/2 -translate-y-1/2 py-2 px-3 rounded-[50%] border border-[#2C5E2E] text-[#2C5E2E]  hover:bg-gray-100"
            >
              ❮
            </button>
            <button
              onClick={nextQuestion}
              className="absolute right-4 top-1/2 -translate-y-1/2 py-2 px-3 rounded-[50%] border border-[#2C5E2E]  text-[#2C5E2E] hover:bg-gray-100"
            >
              ❯
            </button>
          </div>
        </div>
        {/* desktop screen faqs */}
        <div className="hidden md:grid max-w-6xl mx-auto  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-yellow-400 rounded-xl items-center p-6 text-center shadow cursor-pointer transition-all min-h-[375px]"
              onClick={() => toggleAnswer(index)}
            >
              {openIndex !== index ? (
                <p className="text-sm text-gray-600 mb-2">Tap to view</p>
              ) : (
                <p className="text-sm text-gray-600 mb-2">Tap to Close</p>
              )}
              <div className=" h-full flex justify-center items-center">
                {openIndex !== index ? (
                  <>
                    <h3 className="text-lg text-black-300 leading-snug">
                      {faq.question}
                    </h3>
                  </>
                ) : (
                  <p className="text-black text-sm transform-easein">
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
