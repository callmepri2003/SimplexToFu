// Every word on the two maths skills map pages: the landing page that asks for an email
// (/maths-map) and the map itself (/maths-map/open). Held to the same tests as content.js:
// no banned words, no dollar amounts.
//
// Voice is AVATAR_MASTER §8: plain, warm, concrete, unhurried. Both doors are spoken to:
// the parent whose child is slipping ("the roots of it") and the parent whose child is fine
// ("year by year", "what comes next"). Nothing here promises a result, and nothing describes
// what Simplex will do with an email beyond what is true today.
export const MAP_PATH = '/maths-map'
export const CHAIN_PATH = '/maths-map/open'

// A link a tutor can text to a family they already know: it opens the map without the email step.
//   /maths-map/open?pass=family#path=M-78-10
export const MAP_PASS = 'family'

export const MAP_LANDING = {
  eyebrow: 'Free · Kindergarten to Year 12 · NSW maths',
  // One highlighter swipe per page, in the h1, behind 2 to 4 words (WEBSITE_GUIDELINES §3).
  h1: ['What your child should know in maths, ', 'year by year.'],
  sub: 'Every maths skill from Kindergarten to Year 12 on one map, in plain words. Tap any skill to see the roots of it: the earlier skills it depends on.',
  form: {
    label: 'Your email',
    button: 'Show me the skills map',
    buttonFor: (count) => `Show me all ${count} skills`,
    foot: 'Free. It opens on your phone. Nothing to download.',
    privacy: 'We may email you now and then about maths. You can ask us to stop at any time.',
    returning: 'You already have the map.',
    open: 'Open the skills map',
  },
  proof: ['Made in Austral by Simplex Tuition', 'Follows the NSW syllabus'],

  try: {
    eyebrow: 'Try it',
    h2: 'Pick what they are working on.',
    sub: 'See how far back it goes.',
    result: (topic, count) => [`${topic} depends on `, `${count} earlier skills.`],
    hidden: (n) => `and ${n} more`,
    turn: 'Each one is a sentence you could check at the kitchen table. The map shows you all of them.',
  },

  report: {
    label: 'From the school report',
    quote: '“Do more work at home.”',
    h2: 'The report says what. It never says which work.',
    body: [
      'A report has room for one line. It cannot tell you that the trouble with Year 8 algebra began with Year 5 fractions.',
      'The map can. Every skill is joined to the ones it grows from, so you can see where to look.',
    ],
  },

  inside: {
    eyebrow: 'On the map',
    h2: 'The whole of school maths, on one page.',
    points: [
      { title: 'Every skill, in plain words.', body: (n) => `${n} skills from Kindergarten to Year 12. No maths language. Each one is a sentence, like “work out three quarters of twenty dollars in their head”.` },
      { title: 'The roots of each skill.', body: () => 'Tap a skill and the earlier skills it depends on light up, all the way back to Kindergarten.' },
      { title: 'What your child’s school teaches.', body: () => 'Built from the NSW syllabus, from Kindergarten through to Year 12 Extension 2.' },
    ],
    note: 'Year 9 algebra, resting on Year 3 fractions.',
  },

  proofSection: {
    eyebrow: 'From a local family',
    h2: 'Finding the gap is the hard part.',
  },

  faqTitle: 'Before you open it.',
  faqs: [
    { q: 'Is it really free?', a: 'Yes. There is nothing to pay and nothing to download. It opens in your phone’s browser.' },
    { q: 'My child is doing fine. Is this for me?', a: 'Yes. You can see what is coming next year, and check that the skills underneath it are solid.' },
    { q: 'Does it tell me where my child’s gaps are?', a: 'No. It shows every skill and what it depends on. Working out which ones your child has missed means sitting down with them, which is what a tutor does.' },
    { q: 'What do you do with my email?', a: 'It lets you into the map. We may email you now and then about maths, and you can ask us to stop at any time. We never pass it on.' },
  ],

  final: {
    h2: 'See the whole map.',
    body: 'Kindergarten to Year 12. Plain words. On your phone in under a minute.',
  },
}

// The map itself. The chain component sells nothing; see src/chain/ParentView.jsx.
export const CHAIN_COPY = {
  title: 'The maths skills map.',
  lead: 'Maths is a chain. Tap the skill your child is working on.',
  pathNote: 'Scroll up to see them. A gap in any one causes trouble here. The hard part is knowing which one.',
}

// OWNER: check this against what a diagnostic really is before the page goes live. A diagnostic
// is not yet on the list of claims in WEBSITE_GUIDELINES §9.
export const CHAIN_BOOK = {
  heading: 'Find the weak link.',
  body: 'In a maths diagnostic, a Simplex tutor sits with your child and checks the skills in their chain, one at a time, so you know where the gap is.',
}

// What the lead form says under the map, in place of its free-lesson wording.
export const DIAGNOSTIC_OFFER = {
  id: 'diagnostic',
  title: 'Book a maths diagnostic',
  submit: 'Book a diagnostic',
  foot: '',
  subject: 'New maths diagnostic request',
}
