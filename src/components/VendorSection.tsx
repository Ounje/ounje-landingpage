interface Client {
  label: string;
  value: string;
}

const Clients: Client[] = [
  { label: "Customer", value: "customer" },
  { label: "Rider", value: "rider" },
  { label: "Vendor", value: "vendor" },
];

{
  console.log(Clients[0].label);
}
const VendorSection = () => (
  <section className="py-16 px-10 text-black flex justify-center items-center">
    <div>
      <div className="text-center p-10">
        <h2 className="mb-5">We Bring The Orders To You</h2>
        <p className="px-5 lg:w-[1196px]">
          No need for a big shop or fancy tech. With OUNJE, customers find you,
          place their orders, and we handle the rest from pickup to delivery.
          You just focus on cooking. We bring the orders right to your phone.
        </p>
      </div>
      <div className="flex justify-center items-center">
        <img src="/frames/Frame 204.png" alt="cooking guy" />
      </div>
    </div>
  </section>
);

export default VendorSection;
