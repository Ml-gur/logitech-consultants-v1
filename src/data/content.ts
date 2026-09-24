/**
 * Bundled site content.
 *
 * This file is the static fallback the site renders when the CMS is not
 * configured or unreachable (see src/lib/cms.ts). Content is aligned with the
 * Naivolabs brand identity foundation: evidence over claims, so we publish
 * deployment PATTERNS with the dimensions we measure, not invented client
 * names and metrics. Named references are added as engagements go live.
 */

export interface DeploymentPattern {
  slug: string
  /** Pattern name, what we deploy, e.g. "AI Voice Receptionist". */
  name: string
  /** Primary segment this pattern is built for. */
  category: string
  image: string
  tagline: string
  /** Typical time from kickoff to first live deployment. */
  timeframe: string
  /** Which of the four capability actions the pattern spans. */
  stack: string[]
  /** The problem, stated at the operational level. */
  problem: string
  /** How the system is built and where it sits in the organization. */
  approach: string
  /** Systems and channels it connects to. */
  integrations: string[]
  /** What we measure, agreed with the client before launch. */
  measures: { metric: string; detail: string }[]
  /** Governance controls shipped as part of the system. */
  governance: string[]
}

export const deploymentPatterns: DeploymentPattern[] = [
  {
    slug: 'ai-voice-receptionist',
    name: 'AI Voice Receptionist',
    category: 'Membership organizations',
    image: '/images/ai-voice-receptionist.webp',
    tagline:
      'An intelligent first point of contact that answers, understands, retrieves and completes, then hands off to a person when it should.',
    timeframe: '4–6 weeks to first live deployment',
    stack: ['Converse', 'Understand', 'Act'],
    problem:
      'A small team fields the same questions all day, hours, fees, meeting dates, application status, directions. Calls arrive faster than anyone can answer them, so members wait, calls go unanswered, and the staff who should be doing judgement work spend their day repeating themselves. After hours, the organization simply goes silent.',
    approach:
      'We deploy a voice agent grounded in the organization\u2019s own published information and policies. It answers common questions from source documents, asks for the details a request needs, and completes defined actions, logging a request, booking an appointment, sending a document, notifying the right department. Anything outside its scope is transferred to a person with the context already captured, so the caller never repeats themselves.',
    integrations: [
      'Existing phone lines and provider',
      'WhatsApp and messaging channels',
      'CRM or membership register',
      'Calendar and booking system',
      'Document store and policy pages',
    ],
    measures: [
      { metric: 'Completion rate', detail: 'Requests finished end to end without a person stepping in.' },
      { metric: 'Time to answer', detail: 'Including after-hours and peak-volume periods.' },
      { metric: 'Escalation accuracy', detail: 'How often it hands off, and whether that call was right.' },
      { metric: 'Hours returned', detail: 'Staff time moved off repeat calls and onto member service.' },
    ],
    governance: [
      'Every conversation transcribed, logged and reviewable',
      'Hard boundaries on what the agent may say or commit to',
      'Transfer to a named person, with context passed across',
      'A kill switch the client controls, not us',
    ],
  },
  {
    slug: 'institutional-knowledge-agent',
    name: 'Institutional Knowledge Agent',
    category: 'Higher education',
    image: '/images/knowledge-and-data.webp',
    tagline:
      'Answers drawn from the institution\u2019s own documents, cited back to the source, scoped to who is asking.',
    timeframe: '6–8 weeks to first live deployment',
    stack: ['Understand', 'Act', 'Orchestrate'],
    problem:
      'The answer exists, but it lives in a policy PDF, a staff intranet page, a spreadsheet and the memory of one person who is on leave. Staff and students ask the same questions across email, phone and a helpdesk, and someone senior has to go and find the document every single time. When that person leaves, the knowledge leaves with them.',
    approach:
      'We build a retrieval layer over the institution\u2019s real sources, then put a governed agent in front of it. Answers come back with the document they came from attached, so a person can check rather than trust. Access follows the role of whoever is asking, a student and a faculty administrator do not see the same corpus. Where an answer implies an action, the agent can raise the request rather than describe it.',
    integrations: [
      'Document stores, intranet and shared drives',
      'Student or staff information system',
      'Email and helpdesk queues',
      'Single sign-on for role-scoped access',
    ],
    measures: [
      { metric: 'Answer groundedness', detail: 'Traceable to a source document, checked against an evaluation set.' },
      { metric: 'Deflection', detail: 'Questions resolved without a staff member having to intervene.' },
      { metric: 'Time to first response', detail: 'Across email, phone and walk-in channels.' },
      { metric: 'Knowledge coverage', detail: 'How much of the real question set the system can answer.' },
    ],
    governance: [
      'Role-scoped retrieval, no cross-boundary bleed',
      'Every answer cited to its source document',
      'Maintained evaluation suite run before each release',
      'Clear labelling where an answer is not from an approved source',
    ],
  },
  {
    slug: 'service-request-routing',
    name: 'Service Request Routing',
    category: 'Operations-heavy enterprises',
    image: '/images/service-request-routing.webp',
    tagline:
      'Requests captured, understood and routed to the right queue in the systems of record, with the status visible to the requester.',
    timeframe: '5–7 weeks to first live deployment',
    stack: ['Converse', 'Act', 'Orchestrate'],
    problem:
      'Requests arrive through every channel at once and land in one shared inbox. Someone reads each one, guesses the right team, retypes the details into the ticketing system and replies to the requester. Requests get misrouted, duplicated or lost between systems, and nobody, including the person who asked, can say where any given request stands.',
    approach:
      'We put a single intake layer across the channels the organization already uses. Requests are captured, classified against the organization\u2019s own categories and routed into the systems of record as structured records rather than forwarded emails. The requester gets a reference and a status they can check. Everything that falls outside a confident classification goes to a queue for human triage instead of being guessed at.',
    integrations: [
      'Ticketing or case management system',
      'Email, WhatsApp and web forms',
      'Existing category and SLA definitions',
      'Notification and status endpoints',
    ],
    measures: [
      { metric: 'Routing accuracy', detail: 'Requests landing with the team that should own them.' },
      { metric: 'Manual handling rate', detail: 'Share of requests needing a person to re-enter or reassign.' },
      { metric: 'Time to assignment', detail: 'From arrival to an owner being accountable.' },
      { metric: 'Leakage', detail: 'Requests that stall, duplicate or disappear between systems.' },
    ],
    governance: [
      'Confidence thresholds: low-confidence items go to humans by default',
      'Full audit trail on every automated routing decision',
      'Approval gates before any action with a financial or contractual effect',
      'Exception queue that a person owns, reviewed on a fixed cadence',
    ],
  },
  {
    slug: 'document-intake',
    name: 'Document Intake & Processing',
    category: 'Healthcare administration',
    image: '/images/document-intake.webp',
    tagline:
      'Documents received, read, validated and filed into the right system, with anything uncertain flagged for a person.',
    timeframe: '6–8 weeks to first live deployment',
    stack: ['Understand', 'Act', 'Orchestrate'],
    problem:
      'Forms, referrals, claims and correspondence arrive as scans, photos and attachments in many different layouts. Staff open each one, read it, retype the fields into a system and file the original. Volume swings between quiet and overwhelming, and every transcription is a chance to introduce an error that only surfaces much later.',
    approach:
      'We build an intake pipeline that accepts documents from every channel, extracts the fields that matter, validates them against the organization\u2019s own rules, and writes them into the system of record with the original attached. Items that fail validation, or that fall below a confidence threshold, are routed to a person for review instead of being pushed through. Throughput stops being a staffing problem.',
    integrations: [
      'Scan, email and upload intake points',
      'Records or document management system',
      'Validation rules and reference data',
      'Downstream workflow or approval process',
    ],
    measures: [
      { metric: 'Extraction accuracy', detail: 'Field-level, measured against a human-checked sample.' },
      { metric: 'Review rate', detail: 'Share of documents a person still needs to touch.' },
      { metric: 'Turnaround time', detail: 'From receipt to filed record.' },
      { metric: 'Rework', detail: 'Corrections required after an automated entry.' },
    ],
    governance: [
      'Confidence thresholds and mandatory human review bands',
      'Data minimisation: only the fields the process actually needs',
      'Originals retained and linked to every extracted record',
      'Access controls aligned to the existing records policy',
    ],
  },
]

/** Every deployment pattern, regardless of how it was sourced. */
export type DeploymentPatternList = DeploymentPattern[]

export interface BlogPost {
  slug: string
  title: string
  category: string
  date: string
  image: string
  author: string
  role: string
  excerpt: string
  paragraphs: string[]
  /** Optional H2 section headings. Each heading introduces the following
   * paragraphs up to the next heading (or the end). Posts without subheads
   * render flat. Used for article outline / featured-snippet structure. */
  subheads?: { heading: string; paragraphs: string[] }[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'from-demo-to-production-why-ai-pilots-stall',
    title: 'From Demo to Production: Why AI Pilots Stall',
    category: 'AI Strategy',
    date: 'Sep 18, 2026',
    image: '/images/ai-strategy.webp',
    author: 'Marcus Elliot',
    role: 'AI Strategy Lead',
    excerpt:
      'The gap between an impressive AI demonstration and a system an organization can actually depend on is not a model problem. It is a deployment problem.',
    paragraphs: [
      'Most organizations can now get a convincing AI demonstration running in a week. Very few can put that same capability in front of real users, in a real workflow, and have it hold up. The distance between the two is not about which model you use. It is about everything around the model.',
      'A demonstration works because the conditions are perfect: a clean sample, a friendly question, a person watching who can smooth over a wrong answer. Production removes all three.',
    ],
    subheads: [
      {
        heading: 'Production asks questions a demo never does',
        paragraphs: [
          'What happens when the user asks something outside the scope? Who is allowed to see which information? Where does the audit trail live? What does the system do when the upstream API is slow, or when the document it needs has been edited since it was indexed? How do you know it got worse last Tuesday?',
          'These are not edge cases. They are the normal operating conditions of an organization, and each one needs a decision made deliberately rather than discovered later.',
        ],
      },
      {
        heading: 'Governance is engineering, not paperwork',
        paragraphs: [
          'It is tempting to treat governance as the documentation you write after the build. In practice, the controls that matter are structural: confidence thresholds that route uncertain cases to a person, permission boundaries that follow the role of who is asking, approval gates before anything with a financial or contractual effect, and an audit trail that answers "why did it do that" months later.',
          'Built in, these are ordinary engineering decisions. Bolted on afterwards, they are a rebuild.',
        ],
      },
      {
        heading: 'The measure has to exist before launch',
        paragraphs: [
          'You cannot tell whether a deployment worked if nobody agreed what "worked" meant beforehand. Completion rate, escalation accuracy, time to first response, groundedness against a source set, cost per completed task, pick the two or three that map to the outcome the sponsor actually cares about, and instrument them before the first user touches the system.',
          'A system with a baseline and a measure survives scrutiny. One without either becomes an argument about impressions.',
        ],
      },
      {
        heading: 'The point is completion',
        paragraphs: [
          'An answer is not a result. The step that separates a useful system from an interesting one is whether the work moves forward: the booking is made, the record is written, the request is routed, the person is notified. If the system stops at producing text, a human still has to do everything that matters.',
          'Start with the task that finishes, not the conversation that impresses.',
        ],
      },
    ],
  },
  {
    slug: 'getting-your-data-ai-ready-without-the-big-project',
    title: 'Getting Your Data AI-Ready, Without the Big Project',
    category: 'Guides',
    date: 'Jun 24, 2026',
    image: '/images/knowledge-and-data.webp',
    author: 'The Naivolabs team',
    role: 'Engineering',
    excerpt:
      "There's a myth that before you can use AI, you need a massive data cleanup, a new warehouse, and six months of engineering. For most teams, that's not true.",
    paragraphs: [
      "There's a myth that before you can use AI, you need a massive data cleanup, a new warehouse, and six months of engineering. For most teams, that's not true. You don't need perfect data everywhere. You need usable data in the specific places you're about to apply AI.",
      'That shift, from boiling the ocean to cleaning one bucket, is what makes the whole thing achievable.',
    ],
    subheads: [
      {
        heading: 'Start where the AI will actually look',
        paragraphs: [
          "You don't need every system tidy. You need the data that the automation or agent will touch. If you're routing requests, that's your request categories and routing rules. If you're answering questions, that's your help docs and past correspondence. Scope the data work to the project in front of you, and the task shrinks from overwhelming to manageable.",
        ],
      },
      {
        heading: 'Fix the three things that break AI',
        paragraphs: [
          'In practice, most data problems come down to three issues: duplicates, where the same customer exists three times under slightly different names; gaps, where key fields are empty; and inconsistency, where the same thing is written five different ways. Cleaning up these three in the data the AI will use solves the vast majority of "the AI gave a weird answer" problems before they happen.',
        ],
      },
      {
        heading: 'Make it stay clean',
        paragraphs: [
          "A one-time cleanup is worth little if the mess comes straight back. The lasting fix is to tidy the inputs: the form that creates the duplicate, the field that's allowed to stay empty, the dropdown that should replace the free-text box. Clean the data once, then close the door that let it get messy in the first place.",
        ],
      },
      {
        heading: 'Good enough is the goal',
        paragraphs: [
          "AI-ready doesn't mean flawless. It means clean and consistent enough, in the right place, for the job at hand. Aim for that, project by project, and you'll be using AI long before the company that's still planning its perfect data overhaul.",
        ],
      },
    ],
  },
  {
    slug: 'buy-build-or-wait-a-simpler-way-to-decide',
    title: 'Buy, Build, or Wait: A Simpler Way to Decide',
    category: 'AI Strategy',
    date: 'Jun 24, 2026',
    image: '/images/ai-strategy.webp',
    author: 'Lena Hoffmann',
    role: 'Automation Architect',
    excerpt:
      'Every AI decision eventually comes down to three options: buy something off the shelf, build something custom, or wait until the moment is right.',
    paragraphs: [
      'Every AI decision eventually comes down to three options: buy something off the shelf, build something custom, or wait until the moment is right. Teams get into trouble when they reach for "build" by default, because building feels serious and impressive. Often it\u2019s the slowest, most expensive way to solve a problem that already has a tool.',
      "Here's a cleaner way to choose.",
    ],
    subheads: [
      {
        heading: 'Buy when the problem is common',
        paragraphs: [
          "If your problem looks like a lot of other companies' problems, someone has probably already built a good solution for it. Standard support chat, scheduling, transcription, common integrations: these are solved categories. Buying gets you ninety percent of the value in days, not months, and someone else maintains it. The temptation to build a \"slightly better\" version of an existing tool almost never pays off.",
        ],
      },
      {
        heading: 'Build when the edge is yours',
        paragraphs: [
          'Building makes sense when the value comes from something only you have: your data, your specific workflow, your way of doing things. An agent built around your exact process, wired into your exact tools, is something no off-the-shelf product can match, because no off-the-shelf product knows your business. That\u2019s where a custom build earns its cost.',
          'The test is simple. If the advantage comes from your own data and process, build. If it comes from features anyone could buy, don\u2019t.',
        ],
      },
      {
        heading: 'Wait when the cost of being early is high',
        paragraphs: [
          "Sometimes the honest answer is \"not yet.\" If the data isn't ready, the workflow keeps changing, or the team can't yet support a new system, waiting a quarter is a strategy, not a failure. Building on an unstable foundation just means rebuilding later.",
          "Buy what's common, build what's yours, and wait when the timing is wrong. Most expensive AI mistakes come from picking the wrong one of those three, not from picking the wrong model.",
        ],
      },
    ],
  },
  {
    slug: 'your-tools-already-talk-you-don-t-have-to',
    title: 'Your Tools Already Talk. You Don\u2019t Have To.',
    category: 'Automation',
    date: 'Jun 24, 2026',
    image: '/images/integrations.webp',
    author: 'The Naivolabs team',
    role: 'Engineering',
    excerpt:
      'Your CRM, inbox, calendar, and billing system were built to connect. The only missing piece is the glue between them.',
    paragraphs: [
      'Your CRM, inbox, calendar, and billing system were built to connect. They ship with APIs, webhooks, and integrations designed for exactly this. The only missing piece is the glue between them \u2014 and that glue is integration work, not a new platform.',
      'Every time someone copies a row from one tool into another, a human is doing work a machine could do in milliseconds. Copy-paste is not a strategy; it is the most expensive manual process most companies still run.',
    ],
    subheads: [
      {
        heading: 'Start with the handoff',
        paragraphs: [
          'Look for the moment where information changes hands: a request moves from the form to the register, a case moves from service to operations, an invoice moves from the contract to the billing system. That handoff is where integration earns its keep.',
        ],
      },
      {
        heading: 'Automate the middle, not the judgment',
        paragraphs: [
          'Rules handle the predictable parts \u2014 routing, formatting, filing, notifying. Judgment stays with your team. The result is a system that does the boring work perfectly and surfaces the interesting work for people.',
        ],
      },
      {
        heading: 'One connected workflow beats ten disconnected tools',
        paragraphs: [
          "You don\u2019t need more software. You need the software you already pay for to stop being islands. If you're weighing whether to build or buy the glue, our guide to deciding helps you pick the cheaper, faster path.",
        ],
      },
    ],
  },
  {
    slug: 'start-with-the-task-everyone-hates',
    title: 'Start With the Task Everyone Hates',
    category: 'Automation',
    date: 'May 1, 2026',
    image: '',
    author: 'The Naivolabs team',
    role: 'Engineering',
    excerpt:
      'The best first deployment is never the impressive one. It\u2019s the tedious one the whole team dreads \u2014 because everyone will feel it working.',
    paragraphs: [
      'The best first deployment is never the impressive one. It\u2019s the tedious one the whole team dreads \u2014 the weekly report, the data entry, the reconciliation \u2014 because everyone will feel it working from day one.',
      'Ask the team what they hate doing. The answers are usually the same: copying data between systems, chasing approvals, formatting the same document differently for every client.',
    ],
    subheads: [
      {
        heading: 'Pick the task with a measurable cost',
        paragraphs: [
          'If you can name who does it, how long it takes, and how often it happens, you have a pilot with a built-in metric. The task needs a clear owner and a time cost you can actually measure before and after.',
        ],
      },
      {
        heading: 'A small win changes how the organization thinks about AI',
        paragraphs: [
          'One live deployment that saves an hour a week is worth more than a roadmap of impressive projects that never ship. Start there, and the next project gets easier \u2014 the team has seen it work, and the data to justify it already exists.',
        ],
      },
    ],
  },
]

// Contact details shown on the Contact page and footer. This is the static
// fallback when the CMS is unreachable; the live value syncs from the CMS
// `contact-info` global when VITE_CMS_URL is configured (see src/lib/cms.ts).
export const contactInfo = {
  email: 'hello@naivolabs.com',
  phone: '+254112292847',
  address: '51 Lenana Road, Nairobi, 00100, Kenya',
}

// FAQ accordion items (Contact page). Static fallback; the live value syncs
// from the CMS `faqs` global when VITE_CMS_URL is configured.
// Question text is stored WITHOUT the "01/" numbering prefix, the FAQ
// component renders the numbered prefix automatically so static and CMS
// content stay consistent.
export const faqs = [
  {
    q: 'What does Naivolabs actually do?',
    a: 'We are an applied AI systems company. We design, build and deploy intelligent systems that operate inside your existing environment: voice agents, knowledge systems, and the workflow automation around them. In production, with governance and measurement built in.',
  },
  {
    q: 'How is this different from buying an AI platform?',
    a: 'Platforms give you capability. We turn capability into a working system inside your organization: connected to your information, your channels and your systems of record, with the controls your risk and compliance stakeholders will ask about. The platform is a component. The system is the deliverable.',
  },
  {
    q: 'How do engagements start?',
    a: 'With a discovery call. We map how the work is actually done today and identify where an intelligent system would change an outcome you care about. If we do not think there is a case, we will say so, we would rather decline than deploy something that cannot be measured.',
  },
  {
    q: 'How long until something is live?',
    a: 'Most first deployments reach production in four to eight weeks, depending on how many systems we need to integrate with. We aim to have a working system in front of real users early, then improve it against measurement rather than polish it in private.',
  },
  {
    q: 'Who owns the system and the data?',
    a: 'You do. The system runs in your environment or on infrastructure you control, the code and configuration are documented and handed over, and your data stays yours. We do not build dependencies that lock you to us.',
  },
  {
    q: 'How do you handle governance and risk?',
    a: 'Governance is part of the build, not a document written afterwards: role-scoped access, confidence thresholds that route uncertain cases to a person, approval gates before any action with a financial or contractual effect, and an audit trail on every automated decision.',
  },
  {
    q: 'What happens if it does not work?',
    a: 'We build in stages and validate at each one. If a stage is not delivering a measurable improvement, we stop and say so rather than pressing on. Every deployment also produces reusable templates and evaluation suites, so even a discontinued path leaves you with something.',
  },
  {
    q: 'Do you work outside Kenya?',
    a: 'Yes. We build from Africa, where operating conditions are demanding. The problems we solve are not geographically limited. Organizations everywhere need better ways to serve people, use information and operate.',
  },
]

export const aboutValues = [
  { title: 'Evidence over hype', description: 'We say what we can prove, and say plainly when we cannot prove something yet.' },
  { title: 'Finish the work', description: 'An impressive demonstration is not the same as a useful system.' },
  { title: 'Earn trust', description: 'Trust is built through engineering, governance and behaviour, not positioning.' },
  { title: 'Build from reality', description: 'We design around how organizations actually operate, not how the org chart says they do.' },
  { title: 'Make every deployment count', description: 'Every engagement should leave behind reusable knowledge or technology.' },
  { title: 'Think beyond borders', description: 'Our origin is African. Our ambition is global.' },
]

export const team = [
  { name: 'John', role: 'Systems Architect' },
  { name: 'Samuel', role: 'Applied AI Lead' },
  { name: 'Kenei', role: 'Client Outcomes' },
  { name: 'Alphonce', role: 'Integration Engineer' },
  { name: 'Ndeke', role: 'Knowledge Systems Engineer' },
]

// Careers, reserved for future job advertisements. The section is currently
// hidden from the site (AboutPage no longer renders it); re-enable by adding
// the section back and mapping over this array.
export const careers = [
  { title: 'Applied AI Engineer', dept: 'Engineering', type: 'Nairobi / Remote', hours: 'Full-time' },
  { title: 'Integration Engineer', dept: 'Engineering', type: 'Nairobi / Remote', hours: 'Full-time' },
  { title: 'Solutions Architect', dept: 'Engineering', type: 'Nairobi', hours: 'Full-time' },
  { title: 'Deployment Lead', dept: 'Delivery', type: 'Nairobi / Remote', hours: 'Full-time' },
  { title: 'Evaluation & Governance Engineer', dept: 'Engineering', type: 'Nairobi / Remote', hours: 'Full-time' },
]
