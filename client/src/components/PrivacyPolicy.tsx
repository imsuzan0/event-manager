export function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <div className="space-y-4">
              <p>
                When you use EventGhar, we collect and process the following
                types of information:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (profile picture, bio)</li>
                <li>Event-related information (event details, attendance)</li>
                <li>Payment information (when applicable)</li>
                <li>Usage data (how you interact with our platform)</li>
                <li>Device information (browser type, IP address)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              2. How We Use Your Information
            </h2>
            <div className="space-y-4">
              <p>We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and improve our services</li>
                <li>Process your event registrations</li>
                <li>Send you important updates about events</li>
                <li>Customize your experience</li>
                <li>Ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Information Sharing
            </h2>
            <p>We share your information only in specific circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>With event organizers (for event management)</li>
              <li>With service providers (payment processing, hosting)</li>
              <li>When required by law</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your
              information from unauthorized access, alteration, disclosure, or
              destruction. These measures include encryption, secure socket
              layer technology, and regular security assessments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to certain processing activities</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
            <p>
              We use cookies and similar technologies to enhance your
              experience, analyze usage, and assist in our marketing efforts.
              You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Updates to Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any significant changes through the platform or via
              email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or your personal
              information, please contact us at{" "}
              <a
                href="mailto:privacy@eventghar.com"
                className="text-blue-600 hover:underline"
              >
                privacy@eventghar.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
