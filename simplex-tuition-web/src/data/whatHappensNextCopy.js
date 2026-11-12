// Every word on /what-happens-next: where a parent lands after the Meta instant form for the
// free maths diagnostic (the "See how it works" button on the form's thank-you screen).
//
// She has already given her number, so this page sells nothing and asks for nothing new. It
// does three things: says what happens next (Pri calls), shows what the hour is, and gives the
// keen parent a way to sort the time out now (WhatsApp). Held to the same tests as the other
// copy files: no banned words, no dollar amounts, h1 never a question, headings are sentences.
// Price is never on the page (decision 0003: it is said in the room).
import { GROUNDWORK } from './groundworkCopy'

export const WHAT_HAPPENS_NEXT_PATH = '/what-happens-next'

export const NEXT = {
  hero: {
    eyebrow: 'Free maths diagnostic',
    // One highlighter swipe per page, in the h1, behind 2–4 words.
    h1: ['Thanks. Here is ', 'what happens next.'],
    sub: 'Pri from Simplex will call you today to pick a day and time. If you would rather not wait, message us now and we will sort it out on WhatsApp.',
    whatsapp: 'Message us on WhatsApp',
    whatsappText: 'Hi Simplex, I just filled in the form for the free maths diagnostic.',
    callLabel: 'Or call',
  },

  why: {
    eyebrow: 'Why we start at Kindergarten',
    h2: 'The gap is usually years behind the problem.',
    body: [
      'A Year 6 child stuck on adding fractions usually cannot see that 6/8 is 3/4. That comes from times tables and division facts missed in Year 3 or 4.',
      'So the diagnostic walks every child through the whole map, from the first Kindergarten skill up. Green means they have it. Red means a gap. Then we know which skill to fix first.',
    ],
    videoLabel: 'The map from the ad: a Year 6 gap in fractions, traced back to times tables in Year 3 and 4',
    caption: 'One line of a real skills map. Every skill name is from the NSW syllabus.',
  },

  hour: {
    eyebrow: GROUNDWORK.hour.eyebrow,
    h2: GROUNDWORK.hour.h2,
    steps: GROUNDWORK.hour.steps,
  },

  faqTitle: 'Before we call.',
  faqs: GROUNDWORK.faqs,

  final: {
    h2: 'You can also sort it out now.',
    body: 'Message us on WhatsApp with the days that suit. Weekday afternoons, evenings and Saturdays.',
    readyTitle: 'On the day, have ready:',
    ready: [
      'Your child and one parent. You watch the results on your phone.',
      'The school report, if you have one.',
      'A quiet table. The tutor brings the tablet.',
    ],
    where: `Your home, or our space at ${GROUNDWORK.book.steps.when.centreCard.title}. We confirm this on the call.`,
  },
}
