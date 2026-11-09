// Every word on the Groundwork landing page (/groundwork): where the direct-offer ad lands.
// Held to the same tests as content.js: no banned words, no dollar amounts, h1 never a question,
// every section heading a sentence with a full stop.
//
// Voice: AVATAR_MASTER §8, with one extra rule for this page. Many readers are not first-language
// English, so sentences are short, words are plain, and contractions are mostly avoided. Fix door
// only: this page speaks to the parent whose child is behind. The protect parent has the home page.
//
// Price is never on the page. It is said in the room, at the end of the hour (decision 0003).
export const GROUNDWORK_PATH = '/groundwork'

export const GROUNDWORK = {
  nav: { cta: 'Book the free diagnostic' },

  hero: {
    eyebrow: 'Free · 1 hour · Austral and nearby',
    // One highlighter swipe per page, in the h1, behind 2–4 words. The headline is the belief the
    // page exists to give her: it is not the child, it is old gaps nobody checked (Pri, 26 Oct).
    h1: ['Your child is not bad at maths. They have gaps from younger years that ', 'no one looked at.', ''],
    // Two lines on a phone. The detail (tablet, Kindergarten, your phone) lives in the three steps below.
    sub: 'A free one-hour diagnostic finds them, in your home or at our space in Austral. You keep the results, even if you do not book us.',
    cta: 'Book the free diagnostic',
    ctaNote: 'Pick your own day and time. No contract.',
    // The hero visual: a parent's view of a diagnostic, with the play button for the 90-second video.
    video: {
      title: 'See how it works',
      note: '90 seconds',
      caption: 'A Year 6 student’s map, after one hour',
      rows: [
        { band: 'Kindy', skills: ['ok', 'ok', 'ok', 'ok'] },
        { band: 'Year 2', skills: ['ok', 'gap', 'ok', 'ok'] },
        { band: 'Year 3', skills: ['ok', 'gap', 'ok'] },
        { band: 'Year 4', skills: ['ok', 'gap', 'ok', 'ok'] },
        { band: 'Year 6', skills: ['ok', 'gap', 'off', 'off'] },
      ],
    },
  },

  hour: {
    eyebrow: 'What happens in the hour',
    h2: 'Three steps. Then you know.',
    steps: [
      { title: 'Your child does the diagnostic', body: 'On a tablet, with the tutor next to them. It starts with Kindergarten maths, so the first ten minutes are easy. No time limit. No score.' },
      { title: 'You watch on your phone', body: 'You see every skill as they go. Green means they have it. Red means there is a gap.' },
      { title: 'We tell you what to fix first', body: 'The first skill that broke, not the one the teacher noticed. If you book us, we start there in week one. If you do not, the results are still yours.' },
    ],
    ctaNote: 'Weekday afternoons, evenings and Saturdays.',
  },

  story: {
    noteLabel: 'From a Year 6 report',
    quote: '“Needs to work on his fractions.”',
    h2: 'The report said fractions. The real gap was in Year 2.',
    body: 'Jaden’s parents tried worksheets. Then a tutor who taught him fractions. It did not work, because fractions was not the real problem. In Year 2, he never learned halves and quarters properly. Every skill built on that was shaky. We fixed that one skill. After that, fractions was easy.',
    // Real skill names from the maths skills chain (src/data/skillsChain.json), on the fractions path.
    chain: [
      { band: 'Kindy to Year 2', label: 'Count, add and share', state: 'ok' },
      { band: 'Kindy to Year 2 · the gap', label: 'Halves, quarters and eighths', state: 'gap' },
      { band: 'Year 3 to 4', label: 'Fractions on a number line', state: 'gap' },
      { band: 'Year 3 to 4', label: 'Equivalent fractions', state: 'gap' },
      { band: 'Year 5 to 6', label: 'Comparing fractions', state: 'gap' },
      { band: 'Year 5 to 6 · what the teacher saw', label: 'Adding and subtracting fractions', state: 'gap' },
    ],
    marginNote: 'Fix the first gap. The rest get easier.',
    cta: 'Find my child’s gaps, free',
  },

  proof: {
    eyebrow: 'Local families · Google reviews',
    h2: 'Finding the gap is the hard part.',
    ctaNote: (count) => `5.0 from ${count} Google reviews · every tutor has a Working With Children Check`,
  },

  faqTitle: 'Before you book.',
  faqs: [
    { q: 'Is it really free?', a: 'Yes. The hour is free and the results are free. We do this hoping you will book us to fix the gaps. If you do not, that is okay.' },
    { q: 'Is it a test?', a: 'It does not feel like one. There is no time limit and no score. It starts with Kindergarten maths, so your child gets a lot right at the start. Most kids want to keep going.' },
    { q: 'Who comes to our home?', a: 'A Simplex tutor. Every tutor has a Working With Children Check. We send you their name before the day. If you prefer, you can come to our space in Austral instead.' },
    { q: 'Who needs to be there?', a: 'Your child and one parent. You will watch the results on your phone.' },
    { q: 'What does it cost after?', a: 'We tell you at the end of the hour, after you have seen the results. You do not have to decide on the day. The results stay on your phone for 7 days.' },
  ],

  book: {
    h2: 'Book the free diagnostic.',
    sub: 'Four quick questions, then pick your day and time. About one minute.',
    steps: {
      year: { q: 'What year is your child in?' },
      child: { q: 'What is your child’s first name?', note: 'It goes on their results.', label: 'Child’s first name' },
      parent: { q: 'What is your name?', label: 'Your first name' },
      contact: { q: 'How do we confirm your booking?', phone: 'Mobile number', email: 'Email', optional: '(optional)' },
      when: {
        q: 'Where should the diagnostic happen?',
        home: { title: 'The tutor comes to us', note: 'Your home, anywhere nearby' },
        centre: { title: 'We come to Simplex', note: 'Our space in Austral' },
        // Shown when the tutor comes to them.
        address: { label: 'Your address', placeholder: 'Street, suburb' },
        // Shown when they come to us (Pri, 26 Oct: show the address, do not hide it).
        centreCard: { title: '27 Carnamah Rd, Austral NSW 2179', note: 'Our space in Austral.' },
        // The parent books her own day and time. Nothing is confirmed by phone or text after this.
        dayQ: 'Pick a day.',
        timeQ: (child, dayLabel) => `Pick a time on ${dayLabel} for ${child}’s diagnostic.`,
        timeNote: 'The diagnostic takes one hour. Your booking is confirmed as soon as you book.',
      },
    },
    notes: { 1: 'about one minute', 2: 'nearly there', 3: 'halfway', 4: 'last question', 5: 'pick a day and time' },
    next: 'Next',
    back: 'Back',
    submit: 'Pick a time to book',
    submitFor: (when) => `Book ${when}`,
    submitting: 'Booking…',
    foot: 'Prefer to message? WhatsApp us.',
    privacy: 'Free. No contract. We only use your details to book and confirm the diagnostic.',
    error: 'Sorry, that did not send. Please try again, or WhatsApp us.',
    slotTaken: 'Sorry, someone just took that time. Please pick another.',
  },

  years: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],

  whatsapp: 'Hi Simplex, I would like to book the free maths diagnostic for my child.',
}
