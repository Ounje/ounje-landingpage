import { useState } from "react";
import CookiesPolicy from "./CookiesPolicy";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsAndConditions from "./TermsAndConditions";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, FileText, Cookie } from "lucide-react";

const tabs = [
  { id: "1", title: "Privacy Policy", icon: Shield, content: <PrivacyPolicy /> },
  { id: "2", title: "Terms & Conditions", icon: FileText, content: <TermsAndConditions /> },
  { id: "3", title: "Cookies Policy", icon: Cookie, content: <CookiesPolicy /> },
];

export default function PolicyPage() {
  const [activeTab, setActiveTab] = useState("1");
  const activeContent = tabs.find((t) => t.id === activeTab);

  return (
    <section className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Page title */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-[#ECFFED] border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2C5E2E] mb-4">
            📋 Legal
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A3F1C]">Privacy & Compliance</h1>
          <p className="text-gray-500 text-sm mt-2">Learn how we protect your data and handle your information</p>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all border ${
                  isActive
                    ? "bg-[#2C5E2E] text-white border-[#2C5E2E] shadow-md"
                    : "bg-white text-[#1A3F1C] border-[#2C5E2E]/20 hover:bg-[#ECFFED]"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.title}
              </button>
            );
          })}
        </div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10"
          >
            {activeContent?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
