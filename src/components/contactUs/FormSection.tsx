import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2 } from "lucide-react";

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string;

type Status = "idle" | "sending" | "success" | "error";

export default function FormSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Contact Message from ${form.name}`,
          from_name: "OunjeFood Contact Form",
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error("Submission failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-16 md:py-20 px-4 md:px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 bg-[#ECFFED] border border-[#2C5E2E]/20 rounded-full px-4 py-1.5 text-xs font-semibold text-[#2C5E2E] mb-4">
            ✉️ Send a Message
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A3F1C] mb-2">Drop us a line</h2>
          <p className="text-gray-500 text-sm md:text-base">We typically respond within 24 hours.</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="bg-[#FEF1E6] rounded-3xl shadow-md p-6 md:p-10"
        >
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-3"
            >
              <div className="text-4xl">✅</div>
              <h3 className="text-xl font-extrabold text-[#1A3F1C]">Message Sent!</h3>
              <p className="text-gray-500 text-sm">We've received your message and will get back to you within 24 hours.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-4 text-sm font-semibold text-[#2C5E2E] underline underline-offset-2"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Name + Email row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1.5 text-[#1A3F1C] uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Chidi Okeke"
                    className={`w-full border-2 rounded-2xl px-4 py-3 text-sm outline-none bg-white transition placeholder-gray-400 ${
                      errors.name ? "border-red-400 focus:border-red-400" : "border-[#1A3F1C]/20 focus:border-[#2C5E2E]"
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold mb-1.5 text-[#1A3F1C] uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full border-2 rounded-2xl px-4 py-3 text-sm outline-none bg-white transition placeholder-gray-400 ${
                      errors.email ? "border-red-400 focus:border-red-400" : "border-[#1A3F1C]/20 focus:border-[#2C5E2E]"
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold mb-1.5 text-[#1A3F1C] uppercase tracking-wider">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  className={`w-full border-2 rounded-2xl px-4 py-3 text-sm outline-none bg-white resize-none transition placeholder-gray-400 ${
                    errors.message ? "border-red-400 focus:border-red-400" : "border-[#1A3F1C]/20 focus:border-[#2C5E2E]"
                  }`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>

              {status === "error" && (
                <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
              )}

              {/* Submit */}
              <div className="flex justify-center pt-1">
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  whileHover={{ scale: status === "sending" ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-10 py-3.5 rounded-2xl font-bold text-sm transition shadow-md bg-[#FFC727] text-[#1A3F1C] hover:bg-[#ffda55] disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
