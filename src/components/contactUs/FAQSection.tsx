import { useState } from "react";

const faqs = [
  {
    question: "What is Ounje?",
    answer:
      "Ounje is a platform that connects you to your favorite local food vendors for fast and affordable food delivery within your neighborhood.",
  },
  {
    question: "How Do I Place an Order?",
    answer:
      "To place an order, simply browse the menu of your preferred vendor, add items to your cart, and proceed to checkout. You can pay online or choose cash on delivery.",
  },
  {
    question: "Is Ounje Available In My Area?",
    answer:
      "Ounje is currently available in select areas. Enter your location on the homepage to check if we deliver to your area.",
  },
  {
    question: "Can I pay On Delivery?",
    answer:
      "Yes, Ounje supports multiple payment methods, including secure online payment and cash on delivery where available.",
  },
  {
    question: "Do I Need To Pay To Join Ounje?",
    answer:
      "No, joining Ounje as a customer is completely free. You only pay when you place an order.",
  },
  {
    question: "How Do I Become A Vendor Or Rider On Ounje?",
    answer:
      "You can become a vendor or rider by filling out the application form on our 'Join Us' page. Our team will review your submission and contact you shortly.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section>
      <div className="w-full my-3 py-2 bg-[#1A3F1C] text-white text-center">
        {" "}
        <h2>FAQs</h2>{" "}
      </div>

      <div className="flex justify-center items-center mt-10">
        <img src="/images/FAQs-cuate.png" alt="FAQs image" />
      </div>

      <div className="my-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-yellow-400 rounded-xl items-center p-6 text-center shadow cursor-pointer transition-all min-h-[330px]"
              onClick={() => toggleAnswer(index)}
            >
              <p className="text-sm text-gray-600 mb-2">Tap to view</p>
              <div className=" h-full">
                <h3 className="text-lg font-semibold text-black leading-snug mb-2">
                  {faq.question}
                </h3>
                {openIndex === index && (
                  <p className="text-black text-sm flex justify-center items-center ">
                    <div>{faq.answer}</div>
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
