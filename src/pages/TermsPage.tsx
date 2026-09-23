'use client'

import { Link } from 'react-router-dom'
import LegalPage, { type LegalSection } from '../components/LegalPage'
import { SITE } from '../lib/brand'

const updated = '21 September 2026'

const sections: LegalSection[] = [
  {
    id: 'agreement',
    heading: '1. These terms',
    body: (
      <>
        <p>
          These terms govern your use of the Naivolabs website at{' '}
          {SITE.url.replace('https://', '')} and any content, material or interface made available through it.
          By using the site you accept them. If you do not accept them, please do not use the site.
        </p>
        <p>
          Services we deliver to an organization are governed by a separate written agreement signed by both
          parties. Where that agreement conflicts with these terms, the signed agreement prevails. These terms
          do not create a client relationship on their own.
        </p>
      </>
    ),
  },
  {
    id: 'company',
    heading: '2. Who you are dealing with',
    body: (
      <>
        <p>
          The site is operated by Naivolabs, registered in Kenya, with its office at {SITE.address.lines}. You
          can reach us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: 'use',
    heading: '3. Acceptable use',
    body: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>use the site in a way that breaks any applicable law or regulation;</li>
          <li>attempt to gain unauthorised access to the site, its servers or any connected system;</li>
          <li>probe, scan or test the vulnerability of the site without our prior written consent;</li>
          <li>introduce malware, or interfere with the availability or integrity of the site;</li>
          <li>scrape or bulk-extract content using automated means in a way that imposes unreasonable load; or</li>
          <li>misrepresent your identity, or your affiliation with any person or organization.</li>
        </ul>
        <p>
          We may suspend or restrict access where we reasonably believe these rules have been broken or where we
          need to protect the site or other users.
        </p>
      </>
    ),
  },
  {
    id: 'content',
    heading: '4. Our content and intellectual property',
    body: (
      <>
        <p>
          The site, its design, text, graphics, source code and the Naivolabs name and marks are owned by us or
          licensed to us, and are protected by copyright, trade mark and other laws. You may read, download and
          print material for your own internal evaluation. You may not republish, resell or create derivative
          works from it without our written permission.
        </p>
        <p>
          Nothing on this site transfers ownership of any intellectual property. Client systems we build are
          governed by the intellectual property terms of the relevant engagement agreement.
        </p>
      </>
    ),
  },
  {
    id: 'deployment-patterns',
    heading: '5. Capability and deployment patterns',
    body: (
      <>
        <p>
          The deployment patterns, capability descriptions and measurement dimensions published on this site are
          illustrative. They describe how we approach a class of problem; they are not a warranty that a
          particular result will be achieved for your organization.
        </p>
        <p>
          We do not publish performance claims we cannot support. Any outcome figures that appear on this site in
          future will be tied to a specific engagement and identified as such. Nothing on this site is an offer
          capable of acceptance, and no client relationship arises until a written agreement is signed.
        </p>
      </>
    ),
  },
  {
    id: 'third-party',
    heading: '6. Links and third-party services',
    body: (
      <>
        <p>
          The site may link to third-party websites and services that we do not control. We are not responsible
          for their content, availability or privacy practices, and a link is not an endorsement. Where a client
          system integrates a third-party platform, that platform&rsquo;s own terms and privacy policy apply to
          your use of it.
        </p>
      </>
    ),
  },
  {
    id: 'availability',
    heading: '7. Availability and changes',
    body: (
      <>
        <p>
          We aim to keep the site available but do not guarantee uninterrupted access. We may change, suspend or
          withdraw any part of the site at any time, including content, features and these terms. The date at the
          top of this page shows when these terms were last changed; continued use after a change means you
          accept the updated terms.
        </p>
      </>
    ),
  },
  {
    id: 'liability',
    heading: '8. Liability',
    body: (
      <>
        <p>
          The site and its content are provided on an &ldquo;as is&rdquo; basis. To the fullest extent permitted
          by law, we exclude all implied warranties, conditions and representations relating to the site.
        </p>
        <p>
          We are not liable for indirect or consequential loss, loss of profit, revenue, business or anticipated
          savings arising from your use of the site. Where liability cannot lawfully be excluded, our total
          liability arising from your use of the site is limited to KES 10,000.
        </p>
        <p>
          Nothing in these terms limits liability for fraud, fraudulent misrepresentation, death or personal
          injury caused by negligence, or any other liability that cannot lawfully be limited.
        </p>
      </>
    ),
  },
  {
    id: 'governing-law',
    heading: '9. Governing law and disputes',
    body: (
      <>
        <p>
          These terms are governed by the laws of Kenya. The courts of Kenya have exclusive jurisdiction over any
          dispute arising from them, except that we may seek relief in any jurisdiction where necessary to
          protect our intellectual property.
        </p>
      </>
    ),
  },
  {
    id: 'contact',
    heading: '10. Contact',
    body: (
      <>
        <p>
          Questions about these terms should go to <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. See the{' '}
          <Link to="/contact">contact page</Link> for everything else, and our{' '}
          <Link to="/privacy">privacy policy</Link> for how we handle personal data.
        </p>
      </>
    ),
  },
]

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & conditions"
      metaTitle="Terms & Conditions"
      metaDescription="The terms governing use of the Naivolabs website: acceptable use, intellectual property, liability limits, and the law that applies."
      path="/terms"
      updated={updated}
      summary="The ground rules for using this site, and the limits on what we promise about it."
      sections={sections}
    />
  )
}
