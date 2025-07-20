import React from "react";

const community = [
  {
    title: "Become a Rider",
    desc: "Enjoy flexibility, freedom and competitive earnings by delivering through Ounje.",
    img: "/images/rider-img.png",
  },
  {
    title: "Become a Vendor",
    desc: "Grow with Ounje! Our platform will help you grow more sales and revenue.",
    img: "/images/vendor-img.png",
  },
  {
    title: "Become a Customer",
    desc: "Enjoy affordable meals with swift delivery and great food quality.",
    img: "/images/customer-img.png",
  },
];

const CommunitySection = () => (
  <section id="joinUs" className="bg-[#2C5E2E] py-14 text-white text-center">
    <h2 className="text-5xl font-extrabold mb-12 tracking-tight">
      Be a Part of Our Community
    </h2>
    <div className="flex flex-wrap justify-center gap-10">
      {community.map((c, i) => (
        <div
          key={i}
          className=" rounded-2xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center "
        >
          <img
            src={c.img}
            alt={c.title}
            className="w-64 h-[472px] rounded-xl mb-6 object-cover"
          />
          <div className="h-[130px]">
            <div className="font-semibold text-lg mb-2 text-white text-center">
              {c.title}
            </div>
            <div className="text-sm mb-6 text-gray-200 text-center leading-snug ">
              {c.desc}
            </div>
          </div>
          <button className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-xl text-lg hover:bg-yellow-300 transition w-full">
            Register Here
          </button>
        </div>
      ))}
    </div>
  </section>
);

export default CommunitySection;
