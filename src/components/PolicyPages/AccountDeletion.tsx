export default function AccountDeletion() {
  return (
    <div className="text-[#1A3F1C] space-y-6 text-sm md:text-base leading-relaxed">
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A3F1C] mb-1">Account Deletion</h1>
      </div>

      <p className="text-gray-600">
        You can request the deletion of your account and all associated personal data at any time.
      </p>

      {[
        {
          title: "OunjeFood (Customer App)",
          content: (
            <ol className="space-y-2 text-gray-600 list-decimal list-inside pl-2">
              <li>Open the OunjeFood app</li>
              <li>Go to your Profile</li>
              <li>Tap "Settings"</li>
              <li>Tap "Delete Account"</li>
              <li>Confirm your request</li>
            </ol>
          ),
        },
        {
          title: "OunjeMarket – Vendor Portal",
          content: (
            <ol className="space-y-2 text-gray-600 list-decimal list-inside pl-2">
              <li>Open the OunjeMarket app</li>
              <li>Go to your Profile</li>
              <li>Tap "Account Settings"</li>
              <li>Tap "Deactivate / Delete Account"</li>
              <li>Confirm your request</li>
            </ol>
          ),
        },
        {
          title: "OunjeMarket – Rider Portal",
          content: (
            <ol className="space-y-2 text-gray-600 list-decimal list-inside pl-2">
              <li>Open the OunjeMarket app</li>
              <li>Go to your Profile</li>
              <li>Tap "Account Settings"</li>
              <li>Tap "Deactivate / Delete Account"</li>
              <li>Confirm your request</li>
            </ol>
          ),
        },
        {
          title: "Or contact us directly:",
          content: (
            <div className="bg-[#ECFFED] border border-[#2C5E2E]/20 rounded-2xl p-4 space-y-2 text-gray-700 text-sm">
              <p>📧 Email: <a href="mailto:south.madu@ounjefood.com" className="text-[#2C5E2E] font-semibold hover:underline">south.madu@ounjefood.com</a></p>
              <p>💬 WhatsApp: <span className="font-semibold">+234 812 335 8739</span></p>
            </div>
          ),
        },
      ].map((section, index) => (
        <div key={index} className="space-y-3">
          <h2 className="text-base md:text-lg font-extrabold text-[#1A3F1C]">{section.title}</h2>
          {section.content}
        </div>
      ))}

      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-8">
        <p className="text-sm text-gray-600 leading-relaxed font-medium">
          Once your request is submitted, your account and all personal data will be permanently deleted within 7 days. Active orders or pending payouts must be resolved before deletion can be completed.
        </p>
      </div>
    </div>
  );
}
