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
    image: '/images/M5MY3Wk4Y4dsOCa2vifZ9R6pI.png',
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
    image: '/images/J7KZFcCw0ZrENLKo0wuCy6nASg.png',
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
    image: '/images/Tf9L4582eDStTX4KSFaUOoUP5Ys.png',
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
        "AIthor killed two of our pet projects and saved us a fortune. Honest advice we couldn't get internally.",
      name: 'Lucas Bennett',
      role: 'CEO & Founder',
    },
    metric: { value: '14h', label: 'Hours Saved Weekly' },
  },
  {
    slug: 'formix',
    name: 'Formix',
    category: 'Services',
    image: '',
    tagline: 'Automating data entry and reporting workflows for a professional services firm.',
    year: '2026',
    timeframe: '5 Weeks',
    challenge:
      "Formix's back-office team was buried in manual data entry across client spreadsheets, invoices, and internal systems. Errors crept into reports, and month-end close took days of re-checking the same numbers by hand.",
    build:
      'We built a document pipeline that reads incoming files, extracts the fields that matter, and writes them straight into the right systems with validation at every step. Reports assemble themselves from live data, and anomalies are flagged before they reach a client.',
    outcome: [
      { value: '20h', label: 'Weekly Hours Saved' },
      { value: '-94%', label: 'Data Entry Errors' },
    ],
    review: {
      quote:
        'The month-end close that used to take days now takes an afternoon. The numbers are just right the first time.',
      name: 'James Okafor',
      role: 'Implementation Engineer',
    },
    metric: { value: '20h', label: 'Weekly Hours Saved' },
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
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'getting-your-data-ai-ready-without-the-big-project',
    title: 'Getting Your Data AI-Ready, Without the Big Project',
    category: 'Guides',
    date: 'Jun 24, 2026',
    image: '/images/vl5w99JCKqkuvW49lyswomsyhnY.png',
    author: 'Sara Vance',
    role: 'Client Success Lead',
    excerpt:
      "There's a myth that before you can use AI, you need a massive data cleanup, a new warehouse, and six months of engineering. For most teams, that's not true.",
    paragraphs: [
      "There's a myth that before you can use AI, you need a massive data cleanup, a new warehouse, and six months of engineering. For most teams, that's not true. You don't need perfect data everywhere. You need usable data in the specific places you're about to apply AI.",
      "That shift, from boiling the ocean to cleaning one bucket, is what makes the whole thing achievable.",
      'Start where the AI will actually look. You don\u2019t need every system tidy. You need the data that the automation or agent will touch. If you\u2019re qualifying leads, that\u2019s your lead records. If you\u2019re answering support questions, that\u2019s your help docs and past tickets. Scope the data work to the project in front of you, and the task shrinks from overwhelming to manageable.',
      'Fix the three things that break AI. In practice, most data problems come down to three issues: duplicates, where the same customer exists three times under slightly different names; gaps, where key fields are empty; and inconsistency, where the same thing is written five different ways. Cleaning up these three in the data the AI will use solves the vast majority of "the AI gave a weird answer" problems before they happen.',
      'Make it stay clean. A one-time cleanup is worth little if the mess comes straight back. The lasting fix is to tidy the inputs: the form that creates the duplicate, the field that\u2019s allowed to stay empty, the dropdown that should replace the free-text box. Clean the data once, then close the door that let it get messy in the first place.',
      "Good enough is the goal. AI-ready doesn't mean flawless. It means clean and consistent enough, in the right place, for the job at hand. Aim for that, project by project, and you'll be using AI long before the company that's still planning its perfect data overhaul.",
    ],
  },
  {
    slug: 'buy-build-or-wait-a-simpler-way-to-decide',
    title: 'Buy, Build, or Wait: A Simpler Way to Decide',
    category: 'AI Strategy',
    date: 'Jun 24, 2026',
    image: '/images/WZnkJ0N8GjD8YGH73bVRdcc9tvI.png',
    author: 'Lena Hoffmann',
    role: 'Automation Architect',
    excerpt:
      'Every AI decision eventually comes down to three options: buy something off the shelf, build something custom, or wait until the moment is right.',
    paragraphs: [
      'Every AI decision eventually comes down to three options: buy something off the shelf, build something custom, or wait until the moment is right. Teams get into trouble when they reach for "build" by default, because building feels serious and impressive. Often it\u2019s the slowest, most expensive way to solve a problem that already has a tool.',
      "Here's a cleaner way to choose.",
      'Buy when the problem is common. If your problem looks like a lot of other companies\u2019 problems, someone has probably already built a good solution for it. Standard support chat, scheduling, transcription, common integrations: these are solved categories. Buying gets you ninety percent of the value in days, not months, and someone else maintains it. The temptation to build a "slightly better" version of an existing tool almost never pays off.',
      'Build when the edge is yours. Building makes sense when the value comes from something only you have: your data, your specific workflow, your way of doing things. An agent built around your exact process, wired into your exact tools, is something no off-the-shelf product can match, because no off-the-shelf product knows your business. That\u2019s where a custom build earns its cost.',
      'The test is simple. If the advantage comes from your own data and process, build. If it comes from features anyone could buy, don\u2019t.',
      'Wait when the cost of being early is high. Sometimes the honest answer is "not yet." If the data isn\u2019t ready, the workflow keeps changing, or the team can\u2019t yet support a new system, waiting a quarter is a strategy, not a failure. Building on an unstable foundation just means rebuilding later.',
      "Buy what's common, build what's yours, and wait when the timing is wrong. Most expensive AI mistakes come from picking the wrong one of those three, not from picking the wrong model.",
    ],
  },
  {
    slug: 'your-tools-already-talk-you-don-t-have-to',
    title: 'Your Tools Already Talk. You Don\u2019t Have To.',
    category: 'Automation',
    date: 'Jun 24, 2026',
    image: '/images/Eu8lb04bFCoyCpFuitulq7gxSfM.png',
    author: 'Marcus Elliot',
    role: 'AI Strategy Lead',
    excerpt:
      'Your CRM, inbox, calendar, and billing system were built to connect. The only missing piece is the glue between them.',
    paragraphs: [
      'Your CRM, inbox, calendar, and billing system were built to connect. They ship with APIs, webhooks, and integrations designed for exactly this. The only missing piece is the glue between them \u2014 and that glue is automation.',
      'Every time someone copies a row from one tool into another, a human is doing work a machine could do in milliseconds. Copy-paste is not a strategy; it is the most expensive manual process most companies still run.',
      'Start with the handoff. Look for the moment where information changes hands: a lead moves from the form to the CRM, a ticket moves from support to engineering, an invoice moves from the contract to the billing system. That handoff is where automation earns its keep.',
      'Automate the middle, not the judgment. Rules handle the predictable parts \u2014 routing, formatting, filing, notifying. Judgment stays with your team. The result is a system that does the boring work perfectly and surfaces the interesting work for people.',
      'One connected workflow beats ten disconnected tools. You don\u2019t need more software. You need the software you already pay for to stop being islands.',
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
      'Pick the task with a measurable time cost and a clear owner. If you can name who does it, how long it takes, and how often it happens, you have a pilot with a built-in metric.',
      'A small win changes how the whole company thinks about AI. One live automation that saves an hour a week is worth more than a roadmap of impressive projects that never ship.',
    ],
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
  { name: 'Lena Hoffmann', role: 'Automation Architect' },
  { name: 'Marcus Elliot', role: 'AI Strategy Lead' },
  { name: 'Sara Vance', role: 'Client Success Lead' },
  { name: 'James Okafor', role: 'Implementation Engineer' },
]

export const careers = [
  { title: 'Growth Strategist', dept: 'Strategy', type: 'Remote', hours: 'Part-time' },
  { title: 'Client Success Manager', dept: 'Operations', type: 'Remote', hours: 'Full-time' },
  { title: 'Solutions Architect', dept: 'Engineering', type: 'Remote', hours: 'Part-time' },
  { title: 'AI Workflow Specialist', dept: 'Operations', type: 'Remote', hours: 'Full-time' },
  { title: 'Automation Engineer', dept: 'Engineering', type: 'Remote', hours: 'Full-time' },
]

export const buyTemplateUrl =
  'https://buy.polar.sh/polar_cl_nr5ULzxyEoO9oJcPXT0o7Vt9uB5JAFfpZAdI32zPzUt'
