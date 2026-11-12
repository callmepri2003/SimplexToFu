// Every word on /what-happens-next: the page a parent reaches from the Meta instant form's
// "See how it works" button, after she has already seen its thank-you screen.
//
// Its job is to explain the Groundwork program properly, not to get a call: she has given her
// number and Pri is calling her. So: why years hide the problem, the map, what the free
// diagnostic does step by step, what the lessons are if she joins, what happens between
// lessons, what she sees on her phone, what Groundwork is not, and her questions. One quiet
// WhatsApp line at the very end. Held to the same tests as the other copy files: no banned
// words, no dollar amounts (decision 0003: price is said in the room), h1 never a question,
// headings are sentences. Every skill named here is read from the real chain data.
import { GROUNDWORK } from './groundworkCopy'
import { MAP_PATH } from './skillsChainCopy'
import chain from './skillsChain.json'

export const WHAT_HAPPENS_NEXT_PATH = '/what-happens-next'

const K10_BANDS = new Set(['k-2', '3-4', '5-6', '7-8', '9-10'])
const BAND_LABEL = { 'k-2': 'Kindergarten to Year 2', '3-4': 'Years 3 and 4', '5-6': 'Years 5 and 6', '7-8': 'Years 7 and 8', '9-10': 'Years 9 and 10' }
const byId = Object.fromEntries(chain.skills.map((s) => [s.id, s]))
/** A real skill from the chain, in the words a parent reads: band, name, what the child can do, why it matters. */
export const skill = (id) => {
  const s = byId[id]
  return { id, band: BAND_LABEL[s.band] ?? s.band, name: s.label, can: `Can ${s.line.charAt(0).toLowerCase()}${s.line.slice(1)}`, why: s.why }
}
export const SKILL_COUNT = chain.skills.filter((s) => K10_BANDS.has(s.band)).length

// The fractions line from the ad: times tables → equivalence → adding fractions. All real.
export const CHAIN_IDS = ['M-34-07', 'M-56-08', 'M-56-09']
export const EXAMPLE_IDS = ['M-K2-10', 'M-34-07']

export const NEXT = {
  hero: {
    eyebrow: 'How Groundwork works',
    // One highlighter swipe per page, in the h1, behind 2–4 words.
    h1: ['Maths is not built in years. It is ', 'built in skills.'],
    sub: 'Groundwork is our maths program for children in Years 1 to 10 who have fallen behind. This page explains the whole of it: the map it runs on, what the free diagnostic does, and what the lessons look like if you join.',
    note: 'Pri will call you to pick a time for the diagnostic. Nothing on this page needs a reply.',
  },

  years: {
    eyebrow: 'Why years hide the problem',
    h2: 'School moves on every year. A missing skill does not.',
    body: [
      'Schools sort maths into years because thirty children need one plan. But maths itself is a chain: every skill rests on earlier ones. When a skill is missed, school still moves on, and everything built on top of it wobbles.',
      'A Year 6 child who cannot add fractions usually cannot see that 6/8 is 3/4, which is a Year 5 skill. That usually comes from times tables and division facts, which are Year 3 and 4. Extra practice on Year 6 fractions is practice on the wrong thing.',
    ],
    chainTitle: 'The three skills, as they sit on the map.',
    videoLabel: 'The map from the ad: a Year 6 gap in adding fractions, traced back to times tables in Years 3 and 4',
    caption: 'One line of the real map, as the ad showed it.',
  },

  map: {
    eyebrow: 'The map',
    h2: 'Every maths skill from Kindergarten to Year 10, and what each one rests on.',
    body: [
      `We went through the NSW maths syllabus and wrote it down as ${SKILL_COUNT} skills across number, algebra, measurement, geometry and statistics. Each skill is one plain sentence: what your child can do when they have it. Each one also records the earlier skills it depends on.`,
      'That is the map. It is the one the tutor works from, the one you watch during the diagnostic, and the one you see on your phone every week after that.',
    ],
    exampleTitle: 'Two skills, the way they are written on the map.',
    whyLabel: 'Why it matters',
    link: { label: 'See the whole map', to: MAP_PATH },
  },

  diagnostic: {
    eyebrow: 'The free diagnostic',
    h2: 'One hour that finds the first skill that broke.',
    steps: [
      { title: 'Where and when', body: `In your home, or at our space at ${GROUNDWORK.book.steps.when.centreCard.title}. Weekday afternoons, evenings and Saturdays. Your child and one parent need to be there.` },
      { title: 'On a tablet, with the tutor beside them', body: 'The questions come from the map, two per skill. Your child answers on the tablet. The tutor sits next to them and keeps it calm.' },
      { title: 'It follows the arrows down', body: 'When your child proves a skill, nothing underneath it is asked. When a skill is missing, we ask about the skills it rests on, and keep going down until we find the first one that broke. Skills that sit on top of a missing one are not asked at all.' },
      { title: 'No time limit, no score', body: 'It is not a test your child can fail, and nothing on the screen says so. The hour ends when the hour ends. Anything not reached stays marked as not checked, because the map never guesses.' },
      { title: 'You watch it live', body: 'On your phone, the map fills in as they go. Green is a skill they have proven. Red is a gap. Dashed is not checked yet.' },
      { title: 'You leave with the map', body: 'We print it and hand it to you, and tell you which skill to fix first: the lowest red. The results stay in the app on your phone for seven days. Then we explain the program and what it costs. You do not have to decide on the day.' },
    ],
  },

  program: {
    eyebrow: 'If you join',
    h2: 'One skill at a time, four parts each, until it is proven.',
    intro: 'Groundwork runs a term at a time: one hour a week with the same tutor, in your home or at our space in Austral. The first skill is the lowest red on the map. Every skill goes through the same four parts.',
    parts: [
      { title: 'Pre-test', body: 'Short, marked automatically, with the tutor there. It shows exactly which pieces of the skill are missing, and it is the starting point growth is measured from.' },
      { title: 'The lessons', body: 'The skill is split into its subtopics. Each gets an in-class lesson with the tutor and a homework in the app. The tutor marks the subtopics off as they are taught.' },
      { title: 'The run-through', body: 'Before the final test, your child works through the whole question bank for that skill. A wrong answer goes to the back of the queue, with no penalty, until every question has been answered correctly.' },
      { title: 'The final test', body: 'No hints and no feedback until the end. Passing signs the skill off: it turns green on the map, a medal goes into the collection, and growth shows the pre-test and the final test side by side.' },
    ],
    after: 'If the final test is not passed, the run-through reopens and the test waits until it is complete again. Nobody is told they failed; the app does not use the word. Then the tutor picks the next skill from the map, and it starts with its own pre-test.',
  },

  between: {
    eyebrow: 'Between lessons',
    h2: 'Homework, and about thirty minutes of revision a week.',
    items: [
      { title: 'Homework', body: 'One per subtopic, in the app, marked as your child goes. The tutor sees the marks before the next lesson.' },
      { title: 'Weekly revision', body: 'Flashcard style, about thirty minutes a week. A card comes up, your child answers, then taps got it or show me again. Skills they know come back less and less often. Ones that slip come back sooner.' },
      { title: 'The order', body: 'Homework first, then the revision, then the run-through and the final test when the tutor opens them.' },
    ],
  },

  parent: {
    eyebrow: 'What you see on your phone',
    h2: 'The same map, every week.',
    items: [
      'The map, with each skill green, red or not yet checked.',
      'The current skill, exactly as the tutor left it after the last lesson.',
      'Homework and its marks.',
      'A note from every lesson, newest first.',
      'Growth: the pre-test beside the final test, skill by skill.',
      'The medal collection. Skills proven in the diagnostic earn the same medal as skills earned in lessons.',
    ],
  },

  not: {
    eyebrow: 'What Groundwork is not',
    h2: 'Four things it is not.',
    items: [
      { title: 'Not a classroom.', body: 'One tutor, one child, the same tutor every week.' },
      { title: 'Not this year’s worksheets again.', body: 'The work starts at the lowest gap on the map, whatever year that skill belongs to.' },
      { title: 'Not a test your child can fail.', body: 'Nothing in the diagnostic or the app says fail. A final test that is not passed simply reopens the run-through.' },
      { title: 'Not for everything.', body: 'Groundwork is maths, Years 1 to 10. Simplex also tutors English, and Years 11 and 12, as ordinary one-on-one lessons outside this program.' },
    ],
  },

  faqTitle: 'The questions parents ask.',
  faqs: [
    ...GROUNDWORK.faqs,
    { q: 'My child is in Year 9. Does it really go back that far?', a: 'The questions follow the map, not the year. If a Year 9 skill is proven, nothing under it is asked. If it is missing, we go down the arrows until we find the first broken skill, wherever that is.' },
    { q: 'How long before we see a change?', a: 'You see it on the map the day a skill is signed off, so there is no waiting for a report. How many skills a term covers depends on how many gaps there are and how far down the first one sits.' },
    { q: 'Does the same tutor come every week?', a: 'Yes. Every Simplex tutor has a Working With Children Check, and you get their name before the first visit.' },
    { q: 'Who sets the homework and the revision?', a: 'The app does, from the skill the tutor has open. The tutor sees the marks before the next lesson.' },
  ],

  final: {
    h2: 'That is Groundwork.',
    body: 'Pri will call you to pick a time for the diagnostic. If a question came up while you read, send it on WhatsApp and we will answer it before the call.',
    whatsapp: 'Ask on WhatsApp',
    whatsappText: 'Hi Simplex, I read the Groundwork page and have a question.',
    callLabel: 'Or call',
  },
}
