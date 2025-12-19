import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Aionysus',
  description: 'Terms of Service for Aionysus - the terms and conditions governing your use of our AI sommelier service and wine purchases.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-stone-950 to-black">
      <main className="max-w-3xl mx-auto px-4 py-24">
        <Link href="/" className="text-gold-400 hover:text-gold-300 text-sm mb-8 inline-block">
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-serif font-bold mb-8 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-300 bg-clip-text text-transparent">
          Terms of Service
        </h1>

        <div className="prose prose-invert prose-gold max-w-none space-y-6 text-gold-100/80">
          <p className="text-gold-200/60 text-sm">
            Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">1. Introduction</h2>
            <p>
              Welcome to Aionysus. These Terms of Service ("Terms") govern your use of our website aionysus.wine and our AI sommelier service (together, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p>
              Aionysus is operated by a company registered in England and Wales. These Terms are governed by the laws of England and Wales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our Service and purchase alcohol. By using our Service, you confirm that you are of legal drinking age in the United Kingdom.
            </p>
            <p>
              We reserve the right to request proof of age at any time and to refuse service if satisfactory proof is not provided. Alcohol will only be delivered to persons aged 18 or over, and we require a signature from an adult upon delivery.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">3. Account Registration</h2>
            <p>
              To access certain features of our Service, you may need to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing accurate and complete information</li>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorised use</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that violate these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">4. Products and Pricing</h2>
            <p>
              All wines listed on our website are subject to availability. We endeavour to ensure that product descriptions and prices are accurate, but errors may occur. If we discover an error in the price of a product you have ordered, we will inform you and give you the option to reconfirm the order at the correct price or cancel it.
            </p>
            <p>
              Prices are displayed in GBP and include VAT where applicable. Delivery charges are shown separately at checkout.
            </p>
            <p>
              Wine is a natural product and vintage variations may occur. Images are for illustration purposes only.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">5. Orders and Payment</h2>
            <p>
              When you place an order, you are making an offer to purchase. We reserve the right to accept or decline any order. A contract is formed only when we send you a dispatch confirmation.
            </p>
            <p>
              We accept payment by major credit and debit cards through our secure payment processor. All payments are subject to validation and authorisation by your card issuer.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">6. Delivery</h2>
            <p>
              We deliver to addresses within the United Kingdom. Delivery times are estimates and not guaranteed. We are not liable for delays outside our control.
            </p>
            <p>
              Alcohol deliveries require a signature from a person aged 18 or over. If no one is available to accept delivery, the courier may leave a card with instructions for redelivery or collection.
            </p>
            <p>
              Risk of loss and damage passes to you upon delivery. Please inspect your order upon receipt and report any damage or discrepancies within 48 hours.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">7. Returns and Refunds</h2>
            <p>
              Under the Consumer Contracts Regulations 2013, you have the right to cancel your order within 14 days of receiving your goods, provided the wine is unopened and in its original condition.
            </p>
            <p>
              To exercise this right, please contact us at{' '}
              <a href="mailto:hello@aionysus.wine" className="text-gold-400 hover:text-gold-300">
                hello@aionysus.wine
              </a>
              . You are responsible for the cost of returning the goods unless they are faulty or not as described.
            </p>
            <p>
              If you receive a faulty or incorrect product, please contact us within 48 hours. We will arrange collection and provide a full refund or replacement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">8. AI Sommelier Service</h2>
            <p>
              Our AI sommelier provides wine recommendations based on your preferences and our wine database. While we strive for accuracy, recommendations are for guidance only and should not be considered professional advice.
            </p>
            <p>
              By using the voice feature, you consent to the recording and processing of your voice data as described in our Privacy Policy. You may opt out of voice recording at any time.
            </p>
            <p>
              The AI sommelier may suggest wines based on your conversation. Final purchasing decisions are your responsibility.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">9. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, and software, is the property of Aionysus or our licensors and is protected by copyright and other intellectual property laws.
            </p>
            <p>
              You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">10. Acceptable Use</h2>
            <p>
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorised access to any part of the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Transmit any malicious code or harmful content</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest information about other users</li>
              <li>Use automated systems to access the Service without permission</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Aionysus shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
            </p>
            <p>
              Nothing in these Terms excludes or limits our liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded by law.
            </p>
            <p>
              Our total liability to you for any claims arising from these Terms shall not exceed the amount you paid for the products or services giving rise to the claim.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Aionysus, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">13. Third-Party Links</h2>
            <p>
              Our Service may contain links to third-party websites. We are not responsible for the content, privacy practices, or terms of any third-party sites. Your use of third-party sites is at your own risk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">14. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting to our website. Your continued use of the Service after changes are posted constitutes acceptance of the modified Terms.
            </p>
            <p>
              We will notify you of significant changes by email or by posting a prominent notice on our website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">15. Termination</h2>
            <p>
              We may suspend or terminate your access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
            <p>
              Upon termination, your right to use the Service will cease immediately. Provisions that by their nature should survive termination will remain in effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">16. Governing Law and Disputes</h2>
            <p>
              These Terms are governed by the laws of England and Wales. Any disputes arising from these Terms or your use of the Service shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
            <p>
              If you are a consumer, you may also have rights under the laws of your country of residence that cannot be waived by contract.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">17. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">18. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Aionysus regarding your use of the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gold-300">19. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <p>
              Email:{' '}
              <a href="mailto:hello@aionysus.wine" className="text-gold-400 hover:text-gold-300">
                hello@aionysus.wine
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
