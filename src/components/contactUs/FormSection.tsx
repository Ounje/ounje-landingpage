export default function FormSection() {
  return (
    <section>
      <div className="bg-[#FEF1E6] w-[80vw] p-8 rounded-[20px]  mx-auto">
        <form className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-[#1A3F1C] rounded-[20px] px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Email Address</label>
              <input
                type="email"
                className="w-full border border-[#1A3F1C] rounded-[20px] px-3 py-3 outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Type Your Message Here</label>
            <textarea className="w-full border h-32 border-[#1A3F1C] rounded-[20px] px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-400"></textarea>
          </div>
          <button
            type="submit"
            className="flex justify-center items-center w-[30vw] rounded-[20px] bg-yellow-400 text-green-900 font-semibold py-2  hover:bg-yellow-500 transition mx-auto"
          >
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
