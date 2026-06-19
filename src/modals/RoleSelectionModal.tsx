import { motion, AnimatePresence } from "framer-motion";
import { X, User, Store, Bike, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCustomer: () => void;
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  onSelectCustomer,
}: RoleSelectionModalProps) {
  const navigate = useNavigate();

  const handleSelectVendor = () => {
    onClose();
    navigate("/vendor/auth");
  };

  const handleSelectRider = () => {
    onClose();
    navigate("/rider/auth");
  };

  const roles = [
    {
      id: "customer",
      title: "Customer Portal",
      description: "Order delicious meals from local bukás around you.",
      icon: User,
      action: onSelectCustomer,
    },
    {
      id: "vendor",
      title: "Vendor Portal",
      description: "Register your kitchen, manage menus, and track weekly payouts.",
      icon: Store,
      action: handleSelectVendor,
    },
    {
      id: "rider",
      title: "Rider Portal",
      description: "Deliver orders on your schedule and grow your wallet earnings.",
      icon: Bike,
      action: handleSelectRider,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-100 z-10 text-center space-y-6"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header info */}
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#2C5E2E] bg-[#ECFFED] px-3.5 py-1 rounded-full">
                Welcome to Ounje
              </span>
              <h3 className="text-xl font-black text-[#1A3F1C] mt-3">
                How would you like to proceed?
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-1">
                Choose the role that fits your goals today
              </p>
            </div>

            {/* Role List Selection */}
            <div className="space-y-4 text-left">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <div
                    key={r.id}
                    onClick={r.action}
                    className="group border-2 border-gray-100 hover:border-[#2C5E2E] rounded-2xl p-4 flex items-center justify-between cursor-pointer bg-white hover:bg-[#ECFFED]/10 transition-all hover:scale-[1.01]"
                  >
                    <div className="flex gap-4 items-center min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#ECFFED] text-[#2C5E2E] flex items-center justify-center shrink-0 group-hover:bg-[#2C5E2E] group-hover:text-white transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 pr-2">
                        <h4 className="text-sm font-extrabold text-[#1A3F1C]">
                          {r.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 font-semibold mt-0.5 leading-snug">
                          {r.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#2C5E2E] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
