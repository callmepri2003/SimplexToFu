// Suburb data for the /tutoring/[suburb] local SEO pages.
// Each entry carries genuinely local detail (real schools, travel context, a
// suburb-specific note and FAQ) so pages are locally useful, not name-swaps.
// Copy follows the avatar voice: plain, warm, local, no fear-mongering.

export const locations = [
  {
    slug: 'leppington',
    name: 'Leppington',
    postcode: '2179',
    lede: 'Leppington shares a postcode with our Austral space, so your tutor is close by. One-on-one maths and English, the same tutor every week, at our space or in your home.',
    schools: ['Leppington Public School', 'Austral Public School', 'the new Leppington high school'],
    localNote: "Leppington is growing fast, and so are its schools. Some families come to us when a report comment lands. Others come while things are going fine, to keep them that way.",
    faq: {
      q: 'Do you tutor students in Leppington?',
      a: 'Yes. Leppington is right next door to our Austral space, so we tutor many local families. Lessons are at our space or in your home in Leppington.',
    },
  },
  {
    slug: 'edmondson-park',
    name: 'Edmondson Park',
    postcode: '2174',
    lede: 'We tutor maths and English for Edmondson Park students from Kindergarten to Year 12. One tutor, one child, the same tutor every week, at our Austral space or in your home.',
    schools: ['Edmondson Park Public School', 'Edmondson Park High School'],
    localNote: "Lots of Edmondson Park families are new to the area. A move can leave small gaps in what a child has covered. We find them early, before they grow.",
    faq: {
      q: 'Can you do in-home tutoring in Edmondson Park?',
      a: 'Yes. A tutor can come to your home in Edmondson Park, or your child can come to our Austral space, whichever suits your family.',
    },
  },
  {
    slug: 'carnes-hill',
    name: 'Carnes Hill',
    postcode: '2171',
    lede: 'Carnes Hill is a short drive from our Austral space. We tutor local students one-on-one, from the early primary years to selective and HSC preparation.',
    schools: ['Carnes Hill Public School', 'Horningsea Park Public School'],
    localNote: 'Tutoring works best when someone keeps an eye on how your child is going week to week, without it turning into another fight at home.',
    faq: {
      q: 'How does tutoring work for Carnes Hill families?',
      a: 'We come to your home in Carnes Hill or you visit our Austral space. Every student starts with a free one-hour lesson, so you can see how your child responds before deciding anything.',
    },
  },
  {
    slug: 'hoxton-park',
    name: 'Hoxton Park',
    postcode: '2171',
    lede: 'We tutor maths and English for Hoxton Park students from Kindergarten to Year 12, including students at Hoxton Park Public and Hoxton Park High.',
    schools: ['Hoxton Park Public School', 'Hoxton Park High School'],
    localNote: "Hoxton Park has large local schools, where a teacher can't always slow down for one child. One-on-one, we can.",
    faq: {
      q: 'Do you tutor Hoxton Park High and primary students?',
      a: 'Yes. We work with students at every Hoxton Park school and year level. Lessons are in your home or at our Austral space, and the first lesson is free.',
    },
  },
  {
    slug: 'middleton-grange',
    name: 'Middleton Grange',
    postcode: '2171',
    lede: 'We tutor Middleton Grange students in maths and English, one-on-one, with the same tutor every week. Lessons are at our Austral space or in your home.',
    schools: ['Middleton Grange Public School', 'Thomas Hassall Anglican College'],
    localNote: 'Middleton Grange schools are new and growing quickly. One-on-one time makes sure your child is understood as a person, not just as one of a full class.',
    faq: {
      q: 'Is tutoring available in Middleton Grange?',
      a: 'Yes. A tutor can come to you in Middleton Grange, or your child can come to our nearby Austral space. It starts with a free one-hour lesson.',
    },
  },
  {
    slug: 'prestons',
    name: 'Prestons',
    postcode: '2170',
    lede: 'We tutor students across Prestons in maths and English, from local public schools to William Carey Christian School and Thomas Hassall Anglican College.',
    schools: ['Prestons Public School', 'William Carey Christian School', 'Thomas Hassall Anglican College'],
    localNote: 'Prestons has a real mix of public, Christian and independent schools, each with its own pace. We follow the NSW syllabus and your child’s actual schoolwork.',
    faq: {
      q: 'Do you cover both public and private school students in Prestons?',
      a: 'Yes. Whichever school your child attends in Prestons, we tutor to the NSW syllabus and to what they are working on in class. In your home or at our Austral space.',
    },
  },
  {
    slug: 'west-hoxton',
    name: 'West Hoxton',
    postcode: '2171',
    lede: 'West Hoxton is just minutes from our Austral space. We tutor local students in maths and English, one-on-one, from the early primary years to the HSC.',
    schools: ['West Hoxton Public School', 'Hinchinbrook Public School'],
    localNote: "Good tutoring goes back to the roots of a topic, rather than repeating what the classroom already covered. That's how we teach.",
    faq: {
      q: 'Can a tutor come to my home in West Hoxton?',
      a: 'Yes. West Hoxton is close by, so in-home tutoring is easy. You can also come to our Austral space. Every new student starts with a free one-hour lesson.',
    },
  },
  {
    slug: 'liverpool',
    name: 'Liverpool',
    postcode: '2170',
    lede: 'We tutor students from across the Liverpool area, from local primary schools to John Edmondson High and HSC students. One tutor, one child, every week.',
    schools: ['Liverpool West Public School', 'John Edmondson High School', 'All Saints Catholic College'],
    localNote: "Liverpool has some of the biggest schools in the region. In a class that size, a quiet student can go unnoticed. In a one-on-one lesson, they can't.",
    faq: {
      q: 'Do you tutor students from Liverpool?',
      a: 'Yes. Many of our students come from the wider Liverpool area. We can come to your home, or you can come to our Austral space just south of the centre.',
    },
  },
]

export const getLocation = (slug) => locations.find((l) => l.slug === slug)
