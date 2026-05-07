import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle } from "lucide-react";

const faqs = [
  { q: "What is OunjeFood?", a: "OunjeFood is a Nigerian food delivery platform connecting hungry customers to local vendors, fast, affordable, and fresh." },
  { q: "How do I place an order?", a: "You can order right now via WhatsApp using the green 'Order Now' button! Once our app launches, you can also browse vendors, select your meal, and place orders in seconds." },
  { q: "Can I pay on delivery?", a: "Yes! We support pay-on-delivery for your convenience. We're also adding card and transfer payment options in the app." },
  { q: "Do I need to pay to join OunjeFood?", a: "No, joining OunjeFood is completely free for customers, whiles vendors and riders are to join OunjeMarket where vendors take customers orders and riders deliver such orders to the customer." },
  { q: "How fast is delivery?", a: "Our riders are dispatched immediately after your order is confirmed. Delivery times depend on your location and vendor distance, but we aim for the fastest possible service." },
  { q: "I'm a vendor, how do I list my food?", a: "Sign up as a vendor on the waitlist and our team will reach out to get you onboarded. You'll receive orders directly to your phone!" },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="FAQ"
      className="relative py-16 md:py-24 px-4 md:px-8 overflow-hidden"
      style={{
        backgroundImage: "url(/images/FAQs-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1A3F1C]/85 backdrop-blur-sm" />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-xs font-semibold text-white mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-white/70 text-sm md:text-base">
            Everything you need to know about OunjeFood
          </p>
        </motion.div>

        {/* FAQ accordion */}
        <div className="space-y-3 text-left">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full flex items-center justify-between px-5 py-4 md:px-6 md:py-5 text-left font-semibold text-[#1A3F1C] text-sm md:text-base hover:bg-gray-50/70 transition group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 flex-shrink-0 bg-[#ECFFED] rounded-full flex items-center justify-center text-xs font-bold text-[#2C5E2E]">
                    {i + 1}
                  </span>
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex-shrink-0 ml-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    open === i ? "bg-[#2C5E2E] text-white" : "bg-[#FFC727]/30 text-[#2C5E2E]"
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </motion.div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 md:px-6 md:pb-6 text-gray-600 text-sm md:text-base leading-relaxed border-t border-gray-100 pt-3 pl-16">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
