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
                <li>Account information (name, email)</li>
                <li>Event-related information (event details)</li>
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
                <li>Process your event registrations</li>
              </ul>
            </div>
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
                href="mailto:support@eventghar.xyz"
                className="text-blue-600 hover:underline"
              >
                support@eventghar.xyz
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
