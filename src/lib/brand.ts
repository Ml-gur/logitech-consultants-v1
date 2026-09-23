/**
 * Naivolabs, brand + site constants.
 *
 * Single source of truth for the company identity, the messaging system, and
 * every place the site needs a canonical name, URL or contact detail. Derived
 * from the Naivo Labs brand identity foundation (v1.0, 21 September 2026).
 *
 * Rule: the brand name is ONE word, "Naivolabs". Never "Naivo Labs",
 * "NaivoLabs" or "Naivo" in user-facing copy.
 *
 * The domain lives here so a move (staging → production, new TLD) is a
 * one-line change that propagates to index.html-adjacent meta, canonical URLs,
 * robots.txt, sitemap.xml and structured data.
 */

export const SITE = {
  name: 'Naivolabs',
  legalName: 'Naivolabs',
  /** Canonical production origin, no trailing slash. */
  url: 'https://naivolabs.com',
  /** Default social share card. */
  image: '/og-image.png',
  locale: 'en_KE',
  /** Short external category definition. */
  category: 'Applied AI systems',
  /** The conceptual centre of the brand. */
  essence: 'Intelligence at work.',
  /** The larger company ambition. */
  brandIdea: 'Put intelligence to work.',
  /** Primary meta description (≤ 155 chars for SERP display). */
  description:
    'Naivolabs is an applied AI systems company. We design, build and deploy governed intelligent systems that work inside real organizational environments.',
  /** Brand promise, the operational definition of the company. */
  promise:
    'We build systems that work in the real world, measure their results and remain honest about their limits.',
  email: 'hello@naivolabs.com',
  phone: '+254112292847',
  phoneDisplay: '+254 112 292 847',
  address: {
    street: '51 Lenana Road',
    city: 'Nairobi',
    country: 'KE',
    postalCode: '00100',
    /** Single-line form used in the footer / contact card. */
    lines: '51 Lenana Road, Nairobi, 00100, Kenya',
  },
  geo: { latitude: -1.2864, longitude: 36.7812 },
  /** TODO(operator): replace with the live profiles before launch. */
  social: {
    x: 'https://x.com/naivolabs',
    linkedin: 'https://www.linkedin.com/company/naivolabs',
    youtube: 'https://www.youtube.com/@naivolabs',
    github: 'https://github.com/naivolabs',
  },
} as const

/** The three public definitions of the company (brand doc §02). */
export const DEFINITIONS = {
  external: 'Naivolabs is an applied AI systems company building intelligent technology for organizations.',
  descriptive:
    'Naivolabs designs, builds and deploys intelligent AI systems that help organizations serve people, use information and operate their workflows.',
  internal: 'We build governed AI systems that understand, decide and act inside real organizational environments.',
} as const

/** Purpose / mission / vision (brand doc §06–§08). */
export const PURPOSE =
  'To make organizations radically easier to deal with by building AI systems that complete real work inside real institutions.'

export const MISSION =
  'To design, deploy and productize intelligent AI systems that help organizations serve people, use information and operate more effectively.'

export const VISION =
  'A world where organizations can put trustworthy intelligence to work across how they serve people, manage information and operate.'

/**
 * What Naivolabs builds, four actions, not a list of technologies
 * (brand doc §12–§13). Ordered lowest → highest in the capability stack.
 */
export interface Capability {
  id: string
  /** Single-word action. */
  name: string
  headline: string
  description: string
  /** Concrete systems that express this action. */
  systems: string[]
  /** What "done" looks like, used as the checklist. */
  outcomes: string[]
}

export const CAPABILITIES: Capability[] = [
  {
    id: 'converse',
    name: 'Converse',
    headline: 'Systems that communicate naturally with people.',
    description:
      'Voice and conversational systems that answer, ask and route, through the channels people already use, in the languages they actually speak.',
    systems: ['Voice agents', 'AI receptionists', 'Conversational agents', 'Customer service', 'Information services'],
    outcomes: [
      'Answers in seconds, at any hour, without a queue',
      'Natural voice and messaging on the channels people already use',
      'Knows when to hand the conversation to a person',
      'Every conversation logged, reviewable and measurable',
    ],
  },
  {
    id: 'understand',
    name: 'Understand',
    headline: 'Systems that work with organizational information.',
    description:
      'Retrieval and reasoning over your documents, policies and institutional knowledge, grounded in your sources, not in guesswork.',
    systems: ['Knowledge agents', 'Documents', 'Institutional knowledge', 'Search and retrieval', 'Information intelligence'],
    outcomes: [
      'Answers cited back to the document they came from',
      'Institutional knowledge that survives staff turnover',
      'Scoped access: people see only what they should',
      'Accuracy measured against a maintained evaluation set',
    ],
  },
  {
    id: 'act',
    name: 'Act',
    headline: 'Systems that perform defined tasks.',
    description:
      'The step most AI stops short of: completing the work, booking, routing, filing, notifying, escalating, inside the systems you already run.',
    systems: ['Booking', 'Routing', 'Data entry', 'Transaction initiation', 'Notifications', 'Human escalation'],
    outcomes: [
      'Completion, not conversation: the task actually finishes',
      'Writes into your CRM, calendar and back office, not a side tool',
      'Approval gates wherever the stakes require a human',
      'Failures surfaced to a person instead of silently dropped',
    ],
  },
  {
    id: 'orchestrate',
    name: 'Orchestrate',
    headline: 'Systems that connect intelligence to larger workflows.',
    description:
      'Multi-step processes, system integrations and agent coordination, with the monitoring, evaluation and governance that production demands.',
    systems: ['Workflow automation', 'Multi-step processes', 'System integrations', 'Agent coordination', 'Monitoring', 'Governance', 'Evaluation'],
    outcomes: [
      'Intelligence wired into the workflow, not bolted beside it',
      'Audit trail on every automated decision',
      'Evaluation suites that catch regressions before your users do',
      'Reusable adapters so the next deployment is faster than the last',
    ],
  },
]

/**
 * The Naivo deployment model (brand doc §14), every engagement moves through
 * these stages, and each deployment is expected to feed reusable templates,
 * evaluation suites, documentation and integration adapters back into the
 * company.
 */
export const DEPLOYMENT_MODEL = [
  { step: 'Discover', detail: 'Understand the organization, the buyer and the outcome that matters.' },
  { step: 'Understand the work', detail: 'Map how the work is actually done today, not how the org chart says it is.' },
  { step: 'Build', detail: 'Build the smallest system that can complete the work.' },
  { step: 'Integrate', detail: 'Wire it into the systems of record people already use.' },
  { step: 'Deploy', detail: 'Put it in front of real users, under real load.' },
  { step: 'Govern', detail: 'Permissions, approval gates, audit trails and escalation paths.' },
  { step: 'Measure', detail: 'Agree the metrics before launch, then report them honestly.' },
  { step: 'Learn', detail: 'Read what the deployment taught us, including what failed.' },
  { step: 'Standardize', detail: 'Turn what worked into templates, evaluation suites and adapters.' },
  { step: 'Productize', detail: 'Fold the repeatable parts into the product.' },
] as const

/** The internal flywheel (brand doc §15). */
export const FLYWHEEL = [
  'Real customer',
  'Real problem',
  'Naivo solution',
  'Live deployment',
  'Measured outcome',
  'Learning',
  'Reusable pattern',
  'Product',
  'More deployments',
  'Stronger products',
] as const

export const FLYWHEEL_PRINCIPLE = 'Every deployment should make the next one better.'

/**
 * Differentiation as a combination, not a single feature (brand doc §22).
 */
export const DIFFERENTIATORS = [
  {
    title: 'Production, not demonstration',
    description: 'We build systems that operate in real environments, under real conditions, with real users.',
  },
  {
    title: 'Completion, not conversation',
    description: 'The system does not stop at generating an answer. It moves the work forward.',
  },
  {
    title: 'Governance by design',
    description: 'Audit trails, permissions, approval gates and controlled execution are part of the system, not an afterthought.',
  },
  {
    title: 'African operational fluency',
    description: 'Voice, mobile communication, language, local infrastructure and organizational realities inform how we build.',
  },
  {
    title: 'Productization discipline',
    description: 'Successful deployments become repeatable products instead of permanent bespoke work.',
  },
  {
    title: 'Evidence over claims',
    description: 'We publish what we can measure and stay honest about what we cannot yet prove.',
  },
] as const

/** Brand values (brand doc §25). */
export const VALUES = [
  { title: 'Evidence over hype', description: 'We say what we can prove.' },
  { title: 'Finish the work', description: 'An impressive demonstration is not the same as a useful system.' },
  { title: 'Earn trust', description: 'Trust is built through engineering, governance and behaviour.' },
  { title: 'Build from reality', description: 'We design around how organizations actually operate.' },
  { title: 'Make every deployment count', description: 'Every engagement should create reusable knowledge or technology.' },
  { title: 'Think beyond borders', description: 'Our origin is African. Our ambition is global.' },
] as const

/**
 * Brand principles, behavioural rules, not inspiration (brand doc §26).
 * Also used as the honest replacement for a testimonials wall: they are the
 * commitments the company can stand behind before it has named references.
 */
export const PRINCIPLES = [
  { title: 'Never make a claim we cannot support' },
  { title: 'Start with a real problem, not a fashionable technology' },
  { title: 'Deploy before declaring success' },
  { title: 'Measure what matters' },
  { title: 'Human oversight stays where the stakes require it' },
  { title: 'Custom work should create reusable technology' },
  { title: 'Platform ambitions follow proven demand' },
] as const

/** Where Naivolabs does not compete (brand doc §10). */
export const COMPETITIVE_LANDSCAPE = [
  {
    title: 'Global AI platforms',
    tone: 'neutral' as const,
    items: [
      'Powerful infrastructure and models',
      'Built for developers, not operations',
      'You still translate capability into your environment',
      'No one on the hook for the outcome',
      'Support ends at the API boundary',
    ],
  },
  {
    title: 'Generic AI agencies',
    tone: 'neutral' as const,
    items: [
      'Custom builds, one project at a time',
      'Little accumulated technology between clients',
      'Demonstration-first, production-second',
      'Governance handled as paperwork',
      'Knowledge leaves with the contractor',
    ],
  },
  {
    title: 'Naivolabs',
    tone: 'accent' as const,
    items: [
      'Applied intelligence between the platform and your actual work',
      'Governed systems with audit trails and approval gates',
      'Completion, not conversation: the task finishes',
      'Every deployment feeds reusable templates and evaluations',
      'Measured outcomes, reported honestly',
    ],
  },
] as const

/** Who we build for first (brand doc §18). */
export const SEGMENTS = [
  {
    name: 'Membership organizations',
    detail: 'Chambers of commerce, associations and professional bodies with high volumes of repeat interaction.',
  },
  {
    name: 'Education',
    detail: 'Universities, colleges and large institutions where information and service requests never stop.',
  },
  {
    name: 'Healthcare administration',
    detail: 'Non-clinical workflows first: scheduling, information, routing and follow-up.',
  },
  {
    name: 'Operations-heavy enterprises',
    detail: 'Where communication and administrative coordination consume significant staff time.',
  },
  {
    name: 'Government',
    detail: 'Approached through lower-risk information and service-navigation use cases.',
  },
] as const

/**
 * What we measure (replaces invented ROI statistics).
 *
 * The brand doc is explicit that the first site must not pretend proof exists.
 * This is the honest alternative: the dimensions every deployment is measured
 * against, with targets agreed before launch and reported after it.
 */
export const MEASUREMENT_DIMENSIONS = [
  {
    metric: 'Completion rate',
    detail: 'Share of requests the system finishes end to end without a human stepping in.',
  },
  {
    metric: 'Escalation accuracy',
    detail: 'How often the system hands off to a person, and whether it was the right call.',
  },
  {
    metric: 'Time to first response',
    detail: 'From the moment a person makes contact to a useful answer.',
  },
  {
    metric: 'Answer groundedness',
    detail: 'Whether an answer traces back to a source document, checked against an evaluation set.',
  },
  {
    metric: 'Cost per completed task',
    detail: 'What the work costs now, against what it cost before.',
  },
  {
    metric: 'Hours returned to the team',
    detail: 'Staff time moved off repetitive handling and back onto judgement work.',
  },
] as const

/** Convenience helpers ---------------------------------------------------- */

/** Absolute URL for a site-relative path. */
export function absUrl(path = '/'): string {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}

/** The brand name split for the two-tone wordmark ("Naivo" + accent "labs"). */
export const WORDMARK = { head: 'Naivo', tail: 'labs' } as const
