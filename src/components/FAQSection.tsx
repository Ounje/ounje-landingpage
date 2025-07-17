import React, { useState } from "react";

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
    <section className="bg-white py-10 text-center">
      <h2 className="text-3xl font-bold mb-6 text-[#234a1f]">FAQs</h2>
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-yellow-400 rounded-lg shadow">
            <button
              className="w-full text-left px-6 py-4 font-semibold text-[#234a1f] focus:outline-none flex justify-between items-center"
              onClick={() => setOpen(open === i ? null : i)}
            >
              {faq.q}
              <span>{open === i ? "-" : "+"}</span>
            </button>
            {open === i && (
              <div className="px-6 pb-4 text-[#234a1f] text-left text-sm">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
