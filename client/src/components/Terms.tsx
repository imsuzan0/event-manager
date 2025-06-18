export function Terms() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using EventGhar, you agree to be bound by these
              Terms of Use and our Privacy Policy. If you do not agree to these
              terms, please do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must be 13 years or older to use our services</li>
              <li>
                You are responsible for maintaining the security of your account
              </li>
              <li>Your account information must be accurate and up to date</li>
              <li>You may not share your account credentials with others</li>
              <li>You are responsible for all activities under your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              3. Event Creation and Management
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Events must comply with all applicable laws and regulations
              </li>
              <li>You must have the right to organize the events you create</li>
              <li>Event descriptions must be accurate and not misleading</li>
              <li>
                We reserve the right to remove events that violate our policies
              </li>
              <li>
                You are responsible for managing attendee information securely
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Violate any laws or regulations</li>
              <li>Infringe on others' intellectual property rights</li>
              <li>Post inappropriate, offensive, or harmful content</li>
              <li>Attempt to disrupt or compromise our services</li>
              <li>Harass or discriminate against other users</li>
              <li>Use our platform for unauthorized commercial purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              5. Payments and Refunds
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                All payments are processed securely through our payment
                providers
              </li>
              <li>Refunds are subject to event organizers' policies</li>
              <li>We may charge service fees for using our platform</li>
              <li>All fees are non-refundable unless required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              6. Intellectual Property
            </h2>
            <p>
              All content on EventGhar, including logos, designs, text, and
              software, is our property or used with permission. You may not
              copy, modify, or distribute it without authorization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              7. Limitation of Liability
            </h2>
            <p>
              EventGhar is provided "as is" without warranties. We are not
              responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Event cancellations or changes</li>
              <li>User-generated content</li>
              <li>Actions of event organizers or attendees</li>
              <li>Technical issues beyond our control</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">
              8. Modifications to Terms
            </h2>
            <p>
              We may update these terms at any time. Continued use of EventGhar
              after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
            <p>
              For questions about these terms, please contact us at{" "}
              <a
                href="mailto:legal@eventghar.com"
                className="text-blue-600 hover:underline"
              >
                legal@eventghar.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
