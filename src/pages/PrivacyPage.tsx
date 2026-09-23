import { Link } from 'react-router-dom'
import LegalPage, { type LegalSection } from '../components/LegalPage'
import { SITE } from '../lib/brand'

const updated = '21 September 2026'

const sections: LegalSection[] = [
  {
    id: 'who-we-are',
    heading: '1. Who we are',
    body: (
      <>
        <p>
          Naivolabs (&ldquo;Naivolabs&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is an applied AI systems
          company registered in Kenya, with its office at {SITE.address.lines}.
        </p>
        <p>
          This policy explains what personal data we collect when you visit {SITE.url.replace('https://', '')},
          when you contact us, and when you use a system we have deployed for your organization. It also
          explains your rights and how to exercise them.
        </p>
        <p>
          We handle personal data in line with the <strong>Kenya Data Protection Act, 2019</strong> and, where it
          applies to you, the <strong>EU/UK General Data Protection Regulation</strong>. Where we process data on
          behalf of a client organization, that organization is the data controller and we act as a data
          processor under a written agreement.
        </p>
      </>
    ),
  },
  {
    id: 'what-we-collect',
    heading: '2. What we collect',
    body: (
      <>
        <p>
          <strong>Information you give us.</strong> When you submit a form, email us or book a call we collect
          your name, work email address, organization, the budget range you select and the content of your
          message. If you subscribe to our notes, we store your email address and the date you subscribed.
        </p>
        <p>
          <strong>Information collected automatically.</strong> Our hosting infrastructure records standard
          server logs, IP address, user agent, requested path, timestamp and response status, for security and
          reliability purposes. These logs are retained for a short period and are not used to profile visitors.
        </p>
        <p>
          <strong>Analytics.</strong> If you consent to analytics cookies, we collect aggregated, anonymised
          measurements such as page views, referrers, approximate country and device class. We do not use
          analytics to build individual profiles.
        </p>
        <p>
          <strong>Information in systems we operate.</strong> When we deploy a system for a client, it may
          process the personal data of that client&rsquo;s users, for example the content of a phone call,
          message or submitted document. In those cases the client determines what is processed and why, and
          this policy applies only to our role as processor. We do not use client data to train models.
        </p>
      </>
    ),
  },
  {
    id: 'cookies',
    heading: '3. Cookies and similar technologies',
    body: (
      <>
        <p>We use three categories of cookies and local storage:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Strictly necessary.</strong> Required for the site to load, to remember your cookie choice
            and to keep the site secure. These cannot be switched off and are set without consent because they
            are exempt.
          </li>
          <li>
            <strong>Analytics.</strong> Set only if you consent. They help us understand which pages are useful
            so we can improve the site.
          </li>
          <li>
            <strong>Marketing.</strong> Not currently used on this site. If we introduce them, they will be set
            only with your consent.
          </li>
        </ul>
        <p>
          You can change or withdraw your choice at any time using the{' '}
          <Link to="/privacy#cookies">cookie preferences</Link> control in the site footer. Withdrawing consent
          stops future collection; it does not affect processing already carried out.
        </p>
      </>
    ),
  },
  {
    id: 'why',
    heading: '4. Why we process your data',
    body: (
      <>
        <p>We rely on the following legal bases:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Contract and pre-contract steps</strong>, to respond to an enquiry, prepare a proposal and
            deliver the services you engage us for.
          </li>
          <li>
            <strong>Legitimate interests</strong>, to keep the site secure, prevent abuse and improve our
            services, balanced against your rights.
          </li>
          <li>
            <strong>Consent</strong>, for analytics and marketing cookies, and for sending you our notes if you
            subscribe. You may withdraw consent at any time.
          </li>
          <li>
            <strong>Legal obligation</strong>, where we must retain records for tax, accounting or regulatory
            purposes.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'sharing',
    heading: '5. Who we share it with',
    body: (
      <>
        <p>
          We do not sell personal data. We share it only with service providers who help us run the business,
          and only to the extent they need it:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Infrastructure and hosting providers that run this website and our clients&rsquo; deployments.</li>
          <li>Email and communication providers used to answer your enquiry or send our notes.</li>
          <li>Professional advisers where legally required.</li>
        </ul>
        <p>
          Some providers may process data outside Kenya. Where that happens we put contractual safeguards in
          place, including standard clauses, and we assess the destination&rsquo;s protections before transferring.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    heading: '6. How long we keep it',
    body: (
      <>
        <p>
          Enquiry and contact records are kept while we are in discussion and for up to 24 months afterwards, so
          we can pick up a conversation you return to. Newsletter subscriptions are kept until you unsubscribe.
          Server logs are kept for up to 90 days. Data processed on behalf of a client is kept according to that
          client&rsquo;s instructions and the agreement between us.
        </p>
      </>
    ),
  },
  {
    id: 'security',
    heading: '7. How we protect it',
    body: (
      <>
        <p>
          We apply encryption in transit, least-privilege access, audit logging and role-scoped permissions
          across the systems we operate. Access to production data is limited to the people who need it to
          deliver the service, and is reviewed. Systems we build for clients ship with these controls as part of
          the deployment rather than as an add-on.
        </p>
        <p>
          No system is perfectly secure. If a breach affects your personal data we will notify you and the
          Office of the Data Protection Commissioner within the timeframes required by law.
        </p>
      </>
    ),
  },
  {
    id: 'rights',
    heading: '8. Your rights',
    body: (
      <>
        <p>Subject to the applicable law, you have the right to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>be informed about how your data is used, and to access a copy of it;</li>
          <li>have inaccurate data corrected;</li>
          <li>request deletion of data we no longer need;</li>
          <li>object to, or restrict, processing based on legitimate interests;</li>
          <li>withdraw consent at any time, without affecting prior lawful processing;</li>
          <li>receive your data in a portable format; and</li>
          <li>complain to the Office of the Data Protection Commissioner (Kenya) or your local supervisory authority.</li>
        </ul>
        <p>
          To exercise any of these, email{' '}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We respond within 30 days and may ask you to verify
          your identity first.
        </p>
      </>
    ),
  },
  {
    id: 'children',
    heading: '9. Children',
    body: (
      <>
        <p>
          This website is aimed at professionals and is not directed at children. We do not knowingly collect
          personal data from children through this site. Where a client deployment may involve children&rsquo;s
          data, that is handled under the client&rsquo;s instructions with additional safeguards and a written
          data processing agreement.
        </p>
      </>
    ),
  },
  {
    id: 'changes',
    heading: '10. Changes to this policy',
    body: (
      <>
        <p>
          We review this policy at least annually and whenever our processing changes materially. The date at the
          top of the page always reflects the current version. If a change is significant, we will make it
          prominent on the site.
        </p>
        <p>
          This document is provided for transparency and does not replace the data processing agreement in place
          with any client organization.
        </p>
      </>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      metaTitle="Privacy Policy"
      metaDescription="How Naivolabs collects, uses, shares and protects personal data, cookies, your rights under the Kenya Data Protection Act 2019, and how to get in touch."
      path="/privacy"
      updated={updated}
      summary="What we collect, why we collect it, how long we keep it, and how to change your mind."
      sections={sections}
    />
  )
}
