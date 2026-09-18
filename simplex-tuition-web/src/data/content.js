// All homepage copy lives here so words can change without touching layout.
// Voice rules come from AVATAR_MASTER.md §8: plain, warm, concrete, unhurried.
// Only claims confirmed as true every time belong on the page: one tutor to one
// child, the same tutor every week, WWCC-checked tutors, lessons at the Austral
// space or in the family's home, free 1-hour first lesson.

export const PHONE = '+61452330300'
export const PHONE_DISPLAY = '0452 330 300'
export const REVIEW_COUNT = 13
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=Simplex+Tuition+Austral+reviews'

// Real students, published with written parental consent. Before adding more:
// strip EXIF/GPS, crop out school crests and street views, and only use shots
// that look one-on-one (never a room with several students).
export const LESSON_PHOTOS = [
  { src: '/photos/writing.jpg', alt: 'A primary student writing in his exercise book', caption: 'Week 2 writing task' },
  { src: '/photos/smile.jpg', alt: 'A smiling student ready to start his lesson', caption: 'Ready to go' },
  { src: '/photos/working-it-out.jpg', alt: 'A high school student with his maths workbook', caption: 'Working it out' },
  { src: '/photos/blocks.jpg', alt: 'A young student building with wooden blocks', caption: 'Hands-on for the little ones' },
]

export const YEAR_LEVELS = [
  'Kindergarten', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12',
]

// Optional one-tap answers on the form. They map to the triggers in the avatar
// document (§3), so every lead arrives already telling us which door they came in.
export const CONCERNS = [
  { id: 'school-said', label: 'The school said something' },
  { id: 'slipping', label: 'Marks are slipping a bit' },
  { id: 'protect', label: "They're fine, I want to keep it that way" },
  { id: 'cant-help', label: "I can't help them at home" },
  { id: 'hsc-selective', label: 'HSC or selective school' },
]

export const DOORS = [
  {
    tag: 'Something is slipping',
    title: 'A teacher said it. Or the report did.',
    body: 'Homework takes all night. A mark came home lower than last time. You want them back on the same level as their peers. We find where it started, go back to the roots of it, and build up from there, at their pace.',
  },
  {
    tag: 'Nothing is wrong yet',
    title: "They're doing fine. You'd like to keep it that way.",
    body: "The work gets harder every year. High school is coming. They're growing up fast. One steady hour a week with someone who keeps an eye on how they're going, so you don't have to hover.",
  },
]

export const COMPARISON = [
  { row: "Who's in the room", them: 'A class of students', us: 'Your child and one tutor' },
  { row: 'The pace', them: 'Moves when the class moves on', us: 'Not rushing. Moves on when your child understands' },
  { row: 'The teaching', them: 'Keep up with the worksheet', us: 'Goes back to the roots of it until it sticks' },
  { row: 'Who teaches', them: 'Whoever is taking the class', us: 'The same tutor, every week' },
]

// Public Google reviews only. Family members of the owner are never featured.
export const REVIEWS = [
  {
    quote: 'Helped me get from 37% to 76% in Advanced Maths. Highly recommended.',
    who: 'Google review',
    detail: 'Advanced Maths',
  },
  {
    quote: "My son has ADHD and really needs extra support. Ryan didn't want to go on the first day, but they made him feel comfortable and made learning fun. Now he looks forward to going every week.",
    who: 'Melissa B',
    detail: 'Parent · Google review',
  },
  {
    quote: 'I was really struggling with preliminary HSC Advanced Maths. Pri accurately found the gaps in my learning and the study habits I needed to fix. I ended up getting 93% in my most recent Advanced Maths exam.',
    who: "Hamoodi's Dad",
    detail: 'HSC Advanced Maths · Google review',
  },
]

export const TUTOR_POINTS = [
  { title: 'Every tutor scored a 95+ ATAR', body: 'They know the NSW syllabus inside out, and they know how to explain it simply.' },
  { title: 'Every tutor holds a Working With Children Check', body: 'No exceptions, whether lessons are at our space or in your home.' },
  { title: 'The same tutor, every week', body: "Your child isn't starting over with someone new. Their tutor knows what they found hard last week." },
  { title: 'Male and female tutors', body: "We match your child with the tutor who suits how they learn." },
]

export const STEPS = [
  { title: 'We call you back', body: "Within 24 hours. A real person, here in Austral. We'll ask about your child and find a time that works." },
  { title: 'A free one-hour lesson', body: 'At our Austral space or in your home. Your child meets their tutor, and you see how they respond. No cost.' },
  { title: 'Then, only if it feels right', body: 'The same tutor at the same time each week. No contracts, no joining fees, and you can pause any time.' },
]

export const FAQS = [
  {
    q: 'How much does it cost?',
    a: "It depends on your child's year level and how often they come, so we talk it through on the phone before you commit to anything. There are no joining fees and no contracts, and the first lesson is free.",
  },
  {
    q: 'Is it really one-on-one?',
    a: 'Yes. One tutor and one child for the whole lesson. No groups, no sharing the tutor with other students.',
  },
  {
    q: 'Where do lessons happen?',
    a: "At our tutoring space in Austral, or in your home. Your child has the same tutor either way.",
  },
  {
    q: 'Is the first lesson really free?',
    a: "Yes. A full one-hour lesson, at no cost, with no obligation to continue. It's the easiest way to see if your child likes it.",
  },
  {
    q: 'Will my child feel pushed?',
    a: "It isn't a forceful thing. If your child doesn't like coming, it isn't working. We go at their pace, and because it's one-on-one, nobody is comparing them to anyone.",
  },
  {
    q: 'My child is doing fine. Is tutoring still worth it?',
    a: "Many of our families come before anything goes wrong. They want someone keeping an eye on things while the work gets harder, so small gaps never grow into big ones.",
  },
  {
    q: 'What subjects and year levels do you teach?',
    a: 'Maths and English, from Kindergarten to Year 12, including selective school and HSC preparation. Everything is taught to the NSW syllabus.',
  },
  {
    q: 'Do you tutor online?',
    a: 'Not at the moment. All lessons are in person, at our Austral space or in your home.',
  },
  {
    q: 'Can we pause or stop?',
    a: "Yes, any time. No lock-in contracts. Pause for exams or holidays, or stop whenever you need to. Just let us know.",
  },
]

// A greeting, not a service claim: lessons are taught in English. Scripts are
// shown with their Latin reading so every parent can read the row, and no flags
// — flags label nationality, which misses second-generation families.
export const GREETINGS = [
  { lang: 'en', label: 'English', script: 'Welcome', latin: null },
  { lang: 'hi', label: 'Hindi', script: 'नमस्ते', latin: 'Namaste' },
  { lang: 'ur', label: 'Urdu', script: 'خوش آمدید', latin: 'Khush āmdeed', rtl: true },
  { lang: 'ar', label: 'Arabic', script: 'أهلاً وسهلاً', latin: 'Ahlan wa sahlan', rtl: true },
]
