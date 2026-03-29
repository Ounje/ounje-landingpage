import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle } from "lucide-react";

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
      "Ounje is a platform that connects you to your favourite local food vendors for fast and affordable food delivery within your neighbourhood.",
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
    question: "Can I Pay On Delivery?",
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
      'Just head to our website or app, click on "Join Us," and choose whether you want to sign up as a vendor or rider. It\'s quick and easy.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <section id="FAQ" className="py-16 md:py-24 bg-[#ECFFED]">
      {/* Header banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full bg-[#1A3F1C] py-10 flex flex-col items-center gap-2 mb-12"
      >
        <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold text-white/80 mb-2">
          <HelpCircle className="w-3.5 h-3.5" /> Got Questions?
        </span>
        <h2 className="text-white text-2xl md:text-4xl font-extrabold">Frequently Asked Questions</h2>
        <p className="text-white/60 text-xs md:text-sm font-medium">Everything you need to know about OunjeFood</p>
      </motion.div>

      {/* Accordion */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 space-y-3">
        {faqs.map((faq, i) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#2C5E2E]/10 hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggle(faq.id)}
              className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 text-left font-semibold text-[#1A3F1C] text-sm md:text-base hover:bg-gray-50/60 transition"
            >
              <span className="flex items-center gap-3">
                <span className="w-7 h-7 flex-shrink-0 bg-[#ECFFED] rounded-full flex items-center justify-center text-xs font-bold text-[#2C5E2E]">
                  {i + 1}
                </span>
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openId === faq.id ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className={`flex-shrink-0 ml-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  openId === faq.id ? "bg-[#2C5E2E] text-white" : "bg-[#FFC727]/30 text-[#2C5E2E]"
                }`}
              >
                <Plus className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 md:px-6 md:pb-6 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100 pt-3 pl-16">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
