import { useNavigate } from "react-router-dom";
import { Smartphone, ChefHat, Bike, Apple } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";


export default function ComingSoonPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#ECFFED] min-h-screen flex flex-col font-sans text-gray-800 pt-16">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full bg-white rounded-[32px] p-8 shadow-xl border border-[#2C5E2E]/10 text-center space-y-6 relative overflow-hidden">
          
          {/* Decorative background gradients */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#ECFFED] rounded-full blur-2xl opacity-75" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#FFC727]/10 rounded-full blur-2xl opacity-75" />

          {/* Device and status indicator */}
          <div className="relative w-16 h-16 bg-[#ECFFED]/80 text-[#2C5E2E] rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <Smartphone className="w-8 h-8" />
            <div className="absolute -top-1.5 -right-2.5 bg-[#FFC727] text-[#1A3F1C] text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm animate-pulse whitespace-nowrap">
              Web Portal Coming Soon
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl md:text-2xl font-black text-[#1A3F1C] tracking-tight">OunjéMarket on Web</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#2C5E2E]">iOS App is Available Now</p>
          </div>

          <p className="text-xs text-gray-500 leading-relaxed max-w-sm mx-auto font-medium">
            We are currently building our web-based merchant dashboard and delivery logistics portal. In the meantime, the official OunjéMarket iOS app is fully ready and available to manage your kitchen orders and rider operations today.
          </p>

          {/* Download and Navigation controls */}
          <div className="space-y-3 pt-2">
            <a 
              href="https://apps.apple.com/ng/app/ounjemarket/id6762347962" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 bg-[#1A3F1C] hover:bg-black text-white py-3.5 rounded-2xl transition-all shadow-md group cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Apple className="w-5.5 h-5.5 fill-current text-white shrink-0 group-hover:scale-105 transition-transform" />
              <div className="text-left leading-none">
                <span className="text-[8px] text-gray-300 font-medium block">Get it on the</span>
                <span className="text-xs font-black block mt-0.5">App Store</span>
              </div>
            </a>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-[#ECFFED] hover:bg-[#2C5E2E]/10 border border-[#2C5E2E]/15 text-[#2C5E2E] font-black py-3.5 rounded-2xl text-xs transition-colors cursor-pointer"
            >
              Back to Customer Web App
            </button>
          </div>

          {/* Features description */}
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2.5 text-left bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
              <ChefHat className="w-5 h-5 text-[#2C5E2E] shrink-0" />
              <div>
                <span className="text-[9px] font-black text-[#1A3F1C] block leading-none">Kitchen App</span>
                <span className="text-[8px] text-gray-400 font-bold mt-0.5">For Buka Owners</span>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-left bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
              <Bike className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <span className="text-[9px] font-black text-[#1A3F1C] block leading-none">Rider App</span>
                <span className="text-[8px] text-gray-400 font-bold mt-0.5">For Delivery Riders</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
