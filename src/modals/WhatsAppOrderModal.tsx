import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, MessageCircle, Trash2 } from "lucide-react";

const WHATSAPP_NUMBER = "2348123358739";

interface MenuItem {
  id: string;
  name: string;
  emoji: string;
  price: number;
  category: string;
}

const menuItems: MenuItem[] = [
  { id: "1", name: "Jollof Rice", emoji: "🍛", price: 1500, category: "Rice" },
  { id: "2", name: "Fried Rice", emoji: "🍚", price: 1500, category: "Rice" },
  { id: "3", name: "White Rice & Stew", emoji: "🍲", price: 1200, category: "Rice" },
  { id: "4", name: "Pounded Yam & Egusi", emoji: "🫕", price: 2000, category: "Swallow" },
  { id: "5", name: "Eba & Okro Soup", emoji: "🥣", price: 1800, category: "Swallow" },
  { id: "6", name: "Amala & Ewedu", emoji: "🍜", price: 1800, category: "Swallow" },
  { id: "7", name: "Grilled Chicken", emoji: "🍗", price: 2500, category: "Protein" },
  { id: "8", name: "Beef Suya", emoji: "🥩", price: 2000, category: "Protein" },
  { id: "9", name: "Fried Fish", emoji: "🐟", price: 2200, category: "Protein" },
  { id: "10", name: "Moi Moi", emoji: "🫘", price: 600, category: "Sides" },
  { id: "11", name: "Fried Plantain", emoji: "🍌", price: 500, category: "Sides" },
  { id: "12", name: "Coleslaw", emoji: "🥗", price: 400, category: "Sides" },
];

const categories = ["All", "Rice", "Swallow", "Protein", "Sides"];

interface CartItem extends MenuItem {
  qty: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  defaultLocation?: string;
}

export default function WhatsAppOrderModal({ isOpen, onClose, defaultLocation }: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"menu" | "details">("menu");
  const [name, setName] = useState("");
  const [location, setLocation] = useState(defaultLocation ?? "");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (defaultLocation) setLocation(defaultLocation);
  }, [defaultLocation]);

  const filtered = activeCategory === "All" ? menuItems : menuItems.filter(m => m.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing && existing.qty > 1) return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
      return prev.filter(c => c.id !== id);
    });
  };

  const deleteFromCart = (id: string) => setCart(prev => prev.filter(c => c.id !== id));

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const totalItems = cart.reduce((sum, c) => sum + c.qty, 0);

  const getQty = (id: string) => cart.find(c => c.id === id)?.qty || 0;

  const sendOrder = () => {
    const orderLines = cart.map(c => `  • ${c.emoji} ${c.name} x${c.qty} = ₦${(c.price * c.qty).toLocaleString()}`).join("\n");
    const msg = `🛵 *New Order from OunjeFood Website!*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📍 *Location:* ${location}\n` +
      `📞 *Phone:* ${phone}\n\n` +
      `🛒 *Order Details:*\n${orderLines}\n\n` +
      `💰 *Total: ₦${total.toLocaleString()}*\n` +
      (note ? `📝 *Note:* ${note}\n` : "") +
      `\n_Sent via OunjeFood Website_`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    onClose();
    setCart([]);
    setStep("menu");
    setName(""); setLocation(""); setPhone(""); setNote("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep("menu");
      setLocation(defaultLocation ?? "");
    }, 400);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-0 sm:px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative bg-white w-full sm:max-w-2xl rounded-t-[28px] sm:rounded-[28px] overflow-hidden shadow-2xl"
            style={{ maxHeight: "92vh" }}
            onClick={(e: any) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#2C5E2E] px-5 pt-5 pb-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="bg-[#FFC727] rounded-xl p-2">
                  <ShoppingBag className="w-5 h-5 text-[#1A3F1C]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">Order Food</h3>
                  <p className="text-white/70 text-xs">via WhatsApp · Fast & Easy</p>
                </div>
              </div>
              <button onClick={handleClose} className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="bg-[#1A3F1C] px-5 py-3 flex gap-2">
              {["Pick Items", "Your Details"].map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === (i === 0 ? "menu" : "details") ? "bg-[#FFC727] text-[#1A3F1C]" : i === 0 && step === "details" ? "bg-white/30 text-white" : "bg-white/10 text-white/40"}`}>
                    {i === 0 && step === "details" ? "✓" : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step === (i === 0 ? "menu" : "details") ? "text-[#FFC727]" : i === 0 && step === "details" ? "text-white/60" : "text-white/30"}`}>{s}</span>
                  {i === 0 && <div className="w-8 h-[1px] bg-white/20 mx-1" />}
                </div>
              ))}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "calc(92vh - 160px)" }}>
              {step === "menu" ? (
                <div>
                  {/* Category tabs */}
                  <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-gray-100">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? "bg-[#2C5E2E] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Menu grid */}
                  <div className="grid grid-cols-2 gap-3 p-4">
                    <AnimatePresence mode="popLayout">
                      {filtered.map((item, i) => {
                        const qty = getQty(item.id);
                        return (
                          <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            className={`relative rounded-2xl border-2 p-4 transition-all ${qty > 0 ? "border-[#2C5E2E] bg-[#f0faf0]" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                          >
                            <div className="text-3xl mb-2">{item.emoji}</div>
                            <p className="font-semibold text-sm text-gray-800 leading-tight mb-1">{item.name}</p>
                            <p className="text-[#2C5E2E] font-bold text-sm">₦{item.price.toLocaleString()}</p>
                            <div className="mt-3 flex items-center gap-2">
                              {qty > 0 ? (
                                <>
                                  <button onClick={() => removeFromCart(item.id)} className="bg-[#2C5E2E] text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#1a3f1c] transition">
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-bold text-[#2C5E2E] w-4 text-center text-sm">{qty}</span>
                                  <button onClick={() => addToCart(item)} className="bg-[#2C5E2E] text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#1a3f1c] transition">
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </>
                              ) : (
                                <button onClick={() => addToCart(item)} className="bg-[#FFC727] text-[#1A3F1C] rounded-full w-7 h-7 flex items-center justify-center hover:bg-[#ffda55] transition">
                                  <Plus className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                            {qty > 0 && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 bg-[#2C5E2E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {qty}
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Cart Summary */}
                  {cart.length > 0 && (
                    <div className="px-4 pb-2">
                      <div className="bg-gray-50 rounded-2xl p-3 mb-2">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Your Cart ({totalItems} items)</p>
                        <div className="space-y-1.5">
                          {cart.map(c => (
                            <div key={c.id} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700">{c.emoji} {c.name} ×{c.qty}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-[#2C5E2E]">₦{(c.price * c.qty).toLocaleString()}</span>
                                <button onClick={() => deleteFromCart(c.id)} className="text-red-400 hover:text-red-600 transition">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between">
                          <span className="font-bold text-gray-800">Total</span>
                          <span className="font-bold text-[#2C5E2E]">₦{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="p-5 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Order Summary</p>
                    <div className="bg-[#f0faf0] rounded-2xl p-4 space-y-2">
                      {cart.map(c => (
                        <div key={c.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">{c.emoji} {c.name} ×{c.qty}</span>
                          <span className="font-semibold text-[#2C5E2E]">₦{(c.price * c.qty).toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#2C5E2E]/20 pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-[#2C5E2E]">₦{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your Details</p>
                    {[
                      { label: "Full Name", value: name, setter: setName, placeholder: "e.g. Chidi Okeke", type: "text" },
                      { label: "Delivery Location", value: location, setter: setLocation, placeholder: "e.g. 12 Allen Ave, Ikeja", type: "text" },
                      { label: "Phone Number", value: phone, setter: setPhone, placeholder: "e.g. 08012345678", type: "tel" },
                    ].map(field => (
                      <div key={field.label}>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                        <input
                          type={field.type}
                          value={field.value}
                          onChange={e => field.setter(e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C5E2E] transition placeholder-gray-400"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Special Note (optional)</label>
                      <textarea
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="Any special requests or instructions..."
                        rows={2}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2C5E2E] transition resize-none placeholder-gray-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Bottom CTA */}
            <div className="px-4 py-4 bg-white border-t border-gray-100 sticky bottom-0">
              {step === "menu" ? (
                <button
                  disabled={cart.length === 0}
                  onClick={() => setStep("details")}
                  className="w-full bg-[#2C5E2E] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1a3f1c] transition text-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {cart.length === 0 ? "Pick items to continue" : `Continue with ${totalItems} item${totalItems > 1 ? "s" : ""} · ₦${total.toLocaleString()}`}
                </button>
              ) : (
                <div className="flex gap-3">
                  <button onClick={() => setStep("menu")} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-4 rounded-2xl hover:border-gray-300 transition text-sm">
                    ← Back
                  </button>
                  <button
                    disabled={!name || !location || !phone}
                    onClick={sendOrder}
                    className="flex-[2] bg-[#25D366] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#1fb855] transition text-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Send Order via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
