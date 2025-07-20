import React from "react";
import { Button } from "./Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { ChevronDown } from "lucide-react";

interface Client {
  label: string;
  value: string;
}

interface Step {
  label: string;
  icon: string;
  Image: string;
}

const steps = [
  { label: "Browse for Vendors", icon: "📱", Image: "/images/Phone.png" },
  { label: "Place Order", icon: "🛒", Image: "/images/Phone.png" },
  {
    label: "Simple Rider Tracking Update",
    icon: "🚴",
    Image: "/images/Phone.png",
  },
];

const Clients: Client[] = [
  { label: "Customer", value: "customer" },
  { label: "Rider", value: "rider" },
  { label: "Vendor", value: "vendor" },
];

{
  console.log(Clients[0].label);
}
const OreMiSection = () => (
  <section
    className="relative bg-white py-10 text-center bg-cover"
    style={{ backgroundImage: `url(/images/Oremi-bg.png)` }}
  >
    {/* Overlay */}
    <div className="absolute inset-0 bg-[#2C5E2E80] backdrop-blur-md" />
    {/* content */}
    <div className="relative">
      <div>
        <h2 className="text-3xl font-bold mb-2 text-white">Ore mi</h2>
        <p className="mb-8 text-white">
          Be a part of our amazing community. Let's show you how Ounje works
        </p>
        <Select defaultValue="customer">
          <SelectTrigger className="inline-flex items-center gap-2 rounded-[20px] px-4 py-2 bg-[#2C5E2E] text-white text-[20px]">
            <SelectValue />
            <ChevronDown className="h-4 w-4" />
          </SelectTrigger>
          <SelectContent className="bg-[#2C5E2E] border-none rounded-[20px]">
            {Clients.map((client) => (
              <SelectItem
                key={client.value}
                value={client.value}
                className="hover:bg-[#FFCA3A] hover:text-white"
              >
                {client.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {steps.map((step, i) => (
          <div key={i} className="   p-6 flex flex-col items-center">
            <div className="text-5xl mb-4">
              <img src={step.Image} alt={step.icon} />
            </div>
            <Button className="w-full bg-yellow-400 text-black font-semibold px-5 py-2 rounded-[10px] hover:bg-yellow-300 transition">
              {step.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default OreMiSection;
