export interface CaseStudy {
  slug: string
  name: string
  category: string
  image: string
  tagline: string
  year: string
  timeframe: string
  challenge: string
  build: string
  outcome: { value: string; label: string }[]
  review: { quote: string; name: string; role: string }
  metric: { value: string; label: string }
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'etery',
    name: 'Etery',
    category: 'E-commerce',
    image: '/images/M5MY3Wk4Y4dsOCa2vifZ9R6pI.webp',
    tagline: 'Automating customer support and inventory ops for a high-volume e-commerce brand.',
    year: '2025',
    timeframe: '7 Weeks',
    challenge:
      "Etery's support team was drowning in repetitive tickets, with customers waiting hours for answers to simple order questions. Inventory counts drifted out of sync across sales channels, causing oversells and refunds. Every spike in orders forced a choice between slower replies and expensive temporary hires.",
    build:
      "We deployed an AI support assistant trained on Etery's catalog and policies that resolves common questions instantly and routes the rest to the right agent with full context. Alongside it, an automation keeps inventory synced across every channel in real time and flags discrepancies before they turn into oversells.",
    outcome: [
      { value: '60%', label: 'Tickets reduced' },
      { value: '99.8%', label: 'Inventory accuracy' },
      { value: 'Under 30s', label: 'First response time' },
    ],
    review: {
      quote:
        'They showed us where AI actually fit our workflow, not just where it sounded impressive. Clear, practical, worth every cent.',
      name: 'Olivia Reed',
      role: 'Marketing Director',
    },
    metric: { value: '60%', label: 'Tickets reduced' },
  },
  {
    slug: 'genesy',
    name: 'Genesy',
    category: 'Fintech',
    image: '/images/J7KZFcCw0ZrENLKo0wuCy6nASg.webp',
    tagline: 'Scaling content operations for an AI tools company without scaling the team.',
    year: '2026',
    timeframe: '6 Weeks',
    challenge:
      "Genesy's sales team was spending the majority of their prospecting time on leads that were never going to convert. Qualification was entirely manual and inconsistent between team members, and the cost of a wasted discovery call was significant given their senior-level involvement in every conversation.",
    build:
      "We built an automated qualification pipeline that scores inbound leads against Genesy's ideal client profile, enriches each record with company data, and routes high-fit prospects straight to calendar booking while placing lower-fit leads into a nurture sequence. The sales team now only speaks to pre-qualified opportunities.",
    outcome: [
      { value: '4×', label: 'Output Increase' },
      { value: '67%', label: 'Production Time Cut' },
      { value: 'Unchanged', label: 'Team Size' },
    ],
    review: {
      quote:
        'We had a roadmap in weeks, not months of meetings. Finally an AI partner that thinks in outcomes.',
      name: 'Michael Torres',
      role: 'Head of Operations',
    },
    metric: { value: '4×', label: 'Output Increase' },
  },
  {
    slug: 'zenon',
    name: 'Zenon',
    category: 'SaaS',
    image: '/images/Tf9L4582eDStTX4KSFaUOoUP5Ys.webp',
    tagline: 'Automating lead routing and deal workflows for a fast-growing SaaS company.',
    year: '2026',
    timeframe: '8 Weeks',
    challenge:
      'Zenon was losing deals to slow follow-up, with inbound leads sitting unassigned for hours. Reps spent more time on CRM admin than selling, and handoffs between marketing and sales were inconsistent. The pipeline data was never quite up to date when leadership needed it.',
    build:
      'We built an automated lead-routing system that scores and assigns inbound leads to the right rep instantly, with AI drafting the first follow-up. Routine CRM updates and meeting notes are now captured automatically, so reps stay focused on conversations and the pipeline stays accurate in real time.',
    outcome: [
      { value: '14h', label: 'Hours Saved Weekly' },
      { value: '38%', label: 'Faster Deal Closing' },
      { value: '-90%', label: 'Lead response time' },
    ],
    review: {
      quote:
        "Logitech Consultants killed two of our pet projects and saved us a fortune. Honest advice we couldn't get internally.",
      name: 'Lucas Bennett',
      role: 'CEO & Founder',
    },
    metric: { value: '14h', label: 'Hours Saved Weekly' },
  },
]


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
    slug: 'getting-your-data-ai-ready-without-the-big-project',
    title: 'Getting Your Data AI-Ready, Without the Big Project',
    category: 'Guides',
    date: 'Jun 24, 2026',
    image: '/images/vl5w99JCKqkuvW49lyswomsyhnY.webp',
    author: 'Sara Vance',
    role: 'Client Success Lead',
    excerpt:
      "There's a myth that before you can use AI, you need a massive data cleanup, a new warehouse, and six months of engineering. For most teams, that's not true.",
    paragraphs: [
      "There's a myth that before you can use AI, you need a massive data cleanup, a new warehouse, and six months of engineering. For most teams, that's not true. You don't need perfect data everywhere. You need usable data in the specific places you're about to apply AI.",
      "That shift, from boiling the ocean to cleaning one bucket, is what makes the whole thing achievable.",
    ],
    subheads: [
      {
        heading: 'Start where the AI will actually look',
        paragraphs: [
          "You don't need every system tidy. You need the data that the automation or agent will touch. If you're qualifying leads, that's your lead records. If you're answering support questions, that's your help docs and past tickets. Scope the data work to the project in front of you, and the task shrinks from overwhelming to manageable.",
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
    image: '/images/WZnkJ0N8GjD8YGH73bVRdcc9tvI.webp',
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
    image: '/images/Eu8lb04bFCoyCpFuitulq7gxSfM.webp',
    author: 'Marcus Elliot',
    role: 'AI Strategy Lead',
    excerpt:
      'Your CRM, inbox, calendar, and billing system were built to connect. The only missing piece is the glue between them.',
    paragraphs: [
      'Your CRM, inbox, calendar, and billing system were built to connect. They ship with APIs, webhooks, and integrations designed for exactly this. The only missing piece is the glue between them \u2014 and that glue is automation.',
      'Every time someone copies a row from one tool into another, a human is doing work a machine could do in milliseconds. Copy-paste is not a strategy; it is the most expensive manual process most companies still run.',
    ],
    subheads: [
      {
        heading: 'Start with the handoff',
        paragraphs: [
          'Look for the moment where information changes hands: a lead moves from the form to the CRM, a ticket moves from support to engineering, an invoice moves from the contract to the billing system. That handoff is where automation earns its keep.',
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
    author: 'Sara Vance',
    role: 'Client Success Lead',
    excerpt:
      'The best first automation is never the impressive one. It\u2019s the tedious one the whole team dreads \u2014 because everyone will feel it working.',
    paragraphs: [
      'The best first automation is never the impressive one. It\u2019s the tedious one the whole team dreads \u2014 the weekly report, the data entry, the reconciliation \u2014 because everyone will feel it working from day one.',
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
        heading: 'A small win changes how the company thinks about AI',
        paragraphs: [
          'One live automation that saves an hour a week is worth more than a roadmap of impressive projects that never ship. Start there, and the next project gets easier \u2014 the team has seen it work, and the data to justify it already exists.',
        ],
      },
    ],
  },
]

// Contact details shown on the Contact page and footer. This is the static
// fallback when the CMS is unreachable; the live value syncs from the CMS
// `contact-info` global when VITE_CMS_URL is configured (see src/lib/cms.ts).
export const contactInfo = {
  email: 'hello@logitechconsultants.com',
  phone: '+254112292847',
  address: '51 Lenana Road Nairobi, Nairobi, 00100 Kenya',
}

// FAQ accordion items (Contact page). Static fallback; the live value syncs
// from the CMS `faqs` global when VITE_CMS_URL is configured.
// Question text is stored WITHOUT the "01/" numbering prefix — the FAQ
// component renders the numbered prefix automatically so static and CMS
// content stay consistent.
export const faqs = [
  {
    q: 'What does Logitech Consultants actually do?',
    a: "We're a full-service AI agency. We find where AI creates value, build the automations, agents, and tools to capture it, then train your team to run them.",
  },
  {
    q: 'How do I get started?',
    a: 'Book a free discovery call. We\u2019ll discuss your goals, identify where AI can make an impact, and outline a plan\u2014no commitment required.',
  },
  {
    q: 'How long until we see results?',
    a: 'Most clients see their first automation live within 2 weeks. Our pilot program is designed to deliver a measurable win in 2\u20134 weeks.',
  },
  {
    q: 'What if a pilot doesn\u2019t work out?',
    a: "We build in stages and validate at each step. If a pilot isn't delivering value, we stop and find a better approach. Your investment is focused on what works.",
  },
  {
    q: 'Do we need technical staff on our side?',
    a: 'No. We handle the technical build. Your team just needs to know their workflows, and we train them to run the systems we build.',
  },
  {
    q: 'Who owns the systems and data?',
    a: 'You own everything. Our builds are fully documented, run on your infrastructure, and never lock you into proprietary tools.',
  },
  {
    q: 'What tools and models do you work with?',
    a: 'We work across all major AI platforms, LLMs, and automation tools. We choose the right stack for your specific use case, not a one-size-fits-all solution.',
  },
]

export const aboutValues = [
  { title: 'Results Over Hype', description: 'Outcomes you can measure, not vague AI promises.' },
  { title: 'Built to Last', description: 'Systems that keep working long after we hand off.' },
  { title: 'Radical Clarity', description: 'You always know what we\u2019re doing, why, and what\u2019s next.' },
  { title: 'Your Stack, Your Rules', description: 'We work inside your tools, never around or against them.' },
  { title: 'Speed With Judgment', description: 'Fast delivery, without cutting the corners that matter.' },
  { title: 'Partners, Not Vendors', description: 'Invested in your long-term growth, not just the project.' },
]

export const team = [
  { name: 'John', role: 'Automation Architect' },
  { name: 'Samuel', role: 'AI Strategy Lead' },
  { name: 'Kenei', role: 'Client Success Lead' },
  { name: 'Emmanuel', role: 'Implementation Engineer' },
]

// Careers — reserved for future job advertisements. The section is currently
// hidden from the site (AboutPage no longer renders it); re-enable by adding
// the section back and mapping over this array.
export const careers = [
  { title: 'Growth Strategist', dept: 'Strategy', type: 'Remote', hours: 'Part-time' },
  { title: 'Client Success Manager', dept: 'Operations', type: 'Remote', hours: 'Full-time' },
  { title: 'Solutions Architect', dept: 'Engineering', type: 'Remote', hours: 'Part-time' },
  { title: 'AI Workflow Specialist', dept: 'Operations', type: 'Remote', hours: 'Full-time' },
  { title: 'Automation Engineer', dept: 'Engineering', type: 'Remote', hours: 'Full-time' },
]


