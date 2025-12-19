import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Aionysus',
  description: 'Privacy Policy for Aionysus - how we collect, use, and protect your personal data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black">
      <main className="max-w-3xl mx-auto px-4 py-24">
        <Link href="/" className="text-gold-400 hover:text-gold-300 text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-8 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
          Privacy Policy
        </h1>

        <div className="prose prose-invert prose-gold max-w-none space-y-6 text-gold-100/80">
          <p className="text-gold-200/60 text-sm">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">1. Introduction</h2>
            <p>
              Welcome to Aionysus ("we," "our," or "us"). We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website aionysus.wine and use our AI sommelier service.
            </p>
            <p>
              We are registered in England and Wales and comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gold-200">Personal Information</h3>
            <p>We may collect the following personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address (when you create an account)</li>
              <li>Delivery address (when you make a purchase)</li>
              <li>Payment information (processed securely via our payment provider)</li>
              <li>Voice recordings and conversation transcripts (when using our AI sommelier)</li>
              <li>Wine preferences and purchase history</li>
            </ul>

            <h3 className="text-xl font-semibold text-gold-200">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address and browser type</li>
              <li>Device information</li>
              <li>Pages visited and time spent on our site</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our AI sommelier service</li>
              <li>Process orders and deliver products</li>
              <li>Personalise wine recommendations</li>
              <li>Send you updates about your orders and our service (with your consent)</li>
              <li>Comply with legal obligations, including age verification for alcohol sales</li>
              <li>Prevent fraud and ensure the security of our platform</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">4. Legal Basis for Processing</h2>
            <p>Under UK GDPR, we process your data based on:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Contract:</strong> To fulfil orders and provide our services</li>
              <li><strong>Legitimate interests:</strong> To improve our services and prevent fraud</li>
              <li><strong>Consent:</strong> For marketing communications and voice recordings</li>
              <li><strong>Legal obligation:</strong> For age verification and tax records</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">5. Data Sharing</h2>
            <p>We may share your data with:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment processors (Stripe/Shopify Payments)</li>
              <li>Delivery partners for order fulfilment</li>
              <li>Cloud service providers (for secure data storage)</li>
              <li>AI service providers (Hume AI for voice processing)</li>
              <li>Law enforcement when required by law</li>
            </ul>
            <p>We do not sell your personal data to third parties.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to provide our services and comply with legal obligations. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information: Until you request deletion</li>
              <li>Order records: 7 years (for tax purposes)</li>
              <li>Voice recordings: 30 days (unless you opt to save conversations)</li>
              <li>Marketing preferences: Until you unsubscribe</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">7. Your Rights</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Rectification:</strong> Correct inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Object:</strong> Object to certain processing activities</li>
              <li><strong>Withdraw consent:</strong> Where processing is based on consent</li>
            </ul>
            <p>
              To exercise these rights, contact us at{' '}
              <a href="mailto:privacy@aionysus.wine" className="text-gold-400 hover:text-gold-300">
                privacy@aionysus.wine
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">8. Cookies</h2>
            <p>
              We use cookies to improve your experience. Essential cookies are required for the site to function. Analytics cookies help us understand how visitors use our site. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">9. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your data, including encryption, secure servers, and regular security assessments. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">10. Age Verification</h2>
            <p>
              Our services are only available to individuals of legal drinking age (18+ in the UK). We implement age verification measures and reserve the right to request proof of age before processing alcohol orders.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">11. International Transfers</h2>
            <p>
              Some of our service providers may be located outside the UK. Where we transfer data internationally, we ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the UK Information Commissioner.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting a notice on our website or sending you an email.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <p>
              Email:{' '}
              <a href="mailto:privacy@aionysus.wine" className="text-gold-400 hover:text-gold-300">
                privacy@aionysus.wine
              </a>
            </p>
            <p>
              You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at{' '}
              <a href="https://ico.org.uk" className="text-gold-400 hover:text-gold-300" target="_blank" rel="noopener noreferrer">
                ico.org.uk
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
