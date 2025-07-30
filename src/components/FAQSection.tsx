import { useState } from "react";

const faqs = [
  {
    q: "What is Ounje?",
    a: "Ounje is a food delivery platform for great meals and fast delivery.",
  },
  {
    q: "How do I place an order?",
    a: "Browse vendors, select your meal, and place your order easily on our app.",
  },
  {
    q: "Can I pay on delivery?",
    a: "Yes, you can pay on delivery for your convenience.",
  },
  {
    q: "Do I need to pay to join Ounje?",
    a: "No, joining Ounje is free for everyone!",
  },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section
      id="FAQ"
      className="relative bg-cover bg-no-repeat py-10 text-center px-5 "
      style={{
        backgroundImage: `url(/images/FAQs-bg.png)`,
      }}
    >
      <div className="absolute inset-0 bg-[#2C5E2E80]" />
      <div className="relative">
        <h2 className="text-3xl font-bold mb-6 text-white">FAQs</h2>
        <div className="max-w-full mx-auto flex flex-col gap-4 px-10">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-yellow-400 rounded-[20px] shadow py-[25px] "
            >
              <button
                className="w-full text-center px-6 py-4 font-semibold text-black hover:text-white focus:outline-none flex justify-center items-center"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
              </button>
              {open === i && (
                <div className="px-6 pb-4 text-black  text-center text-sm">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
