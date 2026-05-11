export default function PrivacyPolicy() {
  return (
    <div className="text-[#1A3F1C] space-y-6 text-sm md:text-base leading-relaxed">
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1A3F1C] mb-1">Privacy Policy</h1>
        <p className="text-xs text-gray-400 font-medium">Last updated: 17/08/2025</p>
      </div>

      <p className="text-gray-600">
        At OUNJEFOOD, your privacy is important to us. This Privacy Policy explains how we collect, use,
        disclose, and protect your information when you use our website, mobile app, and services.
      </p>
      <p className="text-gray-600">By using OUNJEFOOD, you agree to the terms of this Privacy Policy.</p>

      {[
        {
          title: "1. Information We Collect",
          content: (
            <>
              <p className="text-gray-600 mb-3">We may collect the following types of information:</p>
              <div className="space-y-3">
                <div className="bg-[#ECFFED] rounded-2xl p-4">
                  <p className="font-semibold text-[#2C5E2E] mb-2">a. Personal Information</p>
                  <ul className="space-y-1 text-gray-600 text-sm list-disc list-inside">
                    <li>Name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Delivery address</li>
                    <li>Payment details (processed securely by third-party providers)</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="font-semibold text-[#2C5E2E] mb-2">b. Non-Personal Information</p>
                  <ul className="space-y-1 text-gray-600 text-sm list-disc list-inside">
                    <li>Device information (IP address, browser type, operating system)</li>
                    <li>Usage data (pages visited, time spent, app activity)</li>
                    <li>Location data (when delivery tracking is enabled)</li>
                  </ul>
                </div>
              </div>
            </>
          ),
        },
        {
          title: "2. How We Use Your Information",
          content: (
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>Process and deliver food orders.</li>
              <li>Communicate order updates and promotions.</li>
              <li>Provide customer support.</li>
              <li>Improve and personalise our services.</li>
              <li>Detect and prevent fraud or unauthorised activity.</li>
            </ul>
          ),
        },
        {
          title: "3. Sharing of Information",
          content: (
            <>
              <p className="text-gray-600 mb-3">We may share your information with:</p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside mb-3">
                <li>Vendors (to fulfil your order).</li>
                <li>Delivery partners (to deliver your food).</li>
                <li>Payment processors (to complete transactions).</li>
                <li>Service providers (for analytics, customer support, or marketing).</li>
                <li>Regulatory authorities if required by law.</li>
              </ul>
              <p className="text-gray-600">We do not sell or rent your personal information to third parties.</p>
            </>
          ),
        },
        {
          title: "4. Data Security",
          content: (
            <p className="text-gray-600">
              We implement reasonable security measures to protect your information. However, no method
              of transmission over the internet is 100% secure, and we cannot guarantee absolute protection.
            </p>
          ),
        },
        {
          title: "5. Your Rights",
          content: (
            <ul className="space-y-2 text-gray-600 list-disc list-inside">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction or deletion of your information.</li>
              <li>Opt-out of promotional communications.</li>
              <li>Withdraw consent for location tracking (may affect delivery features).</li>
            </ul>
          ),
        },
        {
          title: "6. Cookies and Tracking",
          content: (
            <p className="text-gray-600">
              We use cookies and similar technologies to enhance user experience and analyse traffic.
              You can manage cookies through your browser settings.
            </p>
          ),
        },
        {
          title: "7. Data Retention",
          content: (
            <p className="text-gray-600">
              We retain your information for as long as necessary to provide our services and comply
              with legal obligations.
            </p>
          ),
        },
        {
          title: "8. Third-Party Links",
          content: (
            <p className="text-gray-600">
              Our platform may contain links to third-party websites or apps. We are not responsible
              for the privacy practices of these external platforms.
            </p>
          ),
        },
        {
          title: "9. Children's Privacy",
          content: (
            <p className="text-gray-600">
              OUNJEFOOD is not directed to individuals under 18. We do not knowingly collect data from children.
            </p>
          ),
        },
        {
          title: "10. Changes to This Policy",
          content: (
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. Updates will be posted on our
              website/app, and continued use means you accept the changes.
            </p>
          ),
        },
        {
          title: "11. Contact Us",
          content: (
            <div className="bg-[#ECFFED] border border-[#2C5E2E]/20 rounded-2xl p-4 space-y-1 text-gray-700 text-sm">
              <p>📧 Email: <a href="mailto:support@ounjefood.com" className="text-[#2C5E2E] font-semibold hover:underline">support@ounjefood.com</a></p>
              <p>📞 Phone: <span className="font-semibold">+2349071686888</span></p>
            </div>
          ),
        },
      ].map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-base md:text-lg font-extrabold text-[#1A3F1C]">{section.title}</h2>
          {section.content}
        </div>
      ))}
    </div>
  );
}
