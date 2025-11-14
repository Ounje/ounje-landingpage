export default function FormSection() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
      <div className="bg-[#FEF1E6] w-full max-w-3xl mx-auto p-6 md:p-8 lg:p-10 rounded-[20px] shadow-md">
        <form className="space-y-5 md:space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium mb-2 text-[#1A3F1C]">
                Name
              </label>
              <input
                type="text"
                className="w-full border border-[#1A3F1C] rounded-[12px] md:rounded-[20px] px-4 py-3 md:py-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm md:text-base font-medium mb-2 text-[#1A3F1C]">
                Email Address
              </label>
              <input
                type="email"
                className="w-full border border-[#1A3F1C] rounded-[12px] md:rounded-[20px] px-4 py-3 md:py-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm md:text-base font-medium mb-2 text-[#1A3F1C]">
              Type Your Message Here
            </label>
            <textarea
              rows={6}
              className="w-full border border-[#1A3F1C] rounded-[12px] md:rounded-[20px] px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 resize-none transition"
            ></textarea>
          </div>
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="flex justify-center items-center w-full sm:w-auto min-w-[200px] px-8 py-3 md:py-3 rounded-[12px] md:rounded-[20px] bg-[#FFC727] text-[#1A3F1C] font-semibold text-sm md:text-base hover:bg-[#ffda55] transition shadow-md hover:shadow-lg"
            >
              Send message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
