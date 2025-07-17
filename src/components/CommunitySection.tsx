import React from "react";

const community = [
  {
    title: "Become a Rider",
    desc: "Enjoy flexibility, freedom, and earnings by becoming Ounje Rider.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Become a Vendor",
    desc: "Grow with Ounje! Our platform will help you get more sales.",
    img: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Become a Customer",
    desc: "Enjoy affordable meals with safe delivery and great food quality.",
    img: "https://images.unsplash.com/photo-1523987355523-c7b5b0723c6a?auto=format&fit=crop&w=400&q=80",
  },
];

const CommunitySection = () => (
  <section className="bg-[#234a1f] py-10 text-white text-center">
    <h2 className="text-3xl font-bold mb-6">Be a Part of Our Community</h2>
    <div className="flex flex-wrap justify-center gap-6">
      {community.map((c, i) => (
        <div
          key={i}
          className="bg-white text-[#234a1f] rounded-lg shadow p-6 w-72 flex flex-col items-center"
        >
          <img
            src={c.img}
            alt={c.title}
            className="w-28 h-28 rounded-full mb-4 object-cover"
          />
          <div className="font-bold text-lg mb-1">{c.title}</div>
          <div className="text-sm mb-2">{c.desc}</div>
          <button className="bg-yellow-400 text-[#234a1f] font-semibold px-4 py-2 rounded hover:bg-yellow-300 transition">
            Register Here
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default CommunitySection;
