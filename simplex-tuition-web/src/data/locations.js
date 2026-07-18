// Suburb data for the /tutoring/[suburb] local SEO pages.
// Each entry carries genuinely local detail (real schools, travel context, a
// suburb-specific note and FAQ) so pages are locally useful, not name-swaps.

export const locations = [
  {
    slug: 'leppington',
    name: 'Leppington',
    postcode: '2179',
    lede: 'Leppington shares its postcode with Austral, so your tutor is quite literally around the corner. As the area grows, so does the pressure on local classrooms — and that\'s exactly where one-to-one tutoring makes the difference.',
    schools: ['Leppington Public School', 'Austral Public School', 'the new Leppington high school'],
    localNote: 'Leppington is one of the fastest-growing pockets of south-west Sydney, and big new schools mean big classes. A tutor who works around your child\'s specific gaps cuts through that.',
    faq: {
      q: 'Do you tutor students in Leppington?',
      a: 'Yes — Leppington is right next door to our Austral base, so we tutor plenty of local families. We can come to your home in Leppington or you can come to us, for the same price.',
    },
  },
  {
    slug: 'edmondson-park',
    name: 'Edmondson Park',
    postcode: '2174',
    lede: 'Edmondson Park has grown from paddocks to a train-line suburb full of young families in just a few years. We tutor students right across it, from Edmondson Park Public through to Edmondson Park High.',
    schools: ['Edmondson Park Public School', 'Edmondson Park High School'],
    localNote: 'With so many families new to the area, we often help students settle into a new school\'s pace — finding the gaps that got missed in the move and rebuilding confidence from there.',
    faq: {
      q: 'Can you do in-home tutoring in Edmondson Park?',
      a: 'Absolutely. A tutor will come to your home in Edmondson Park, or your child can come to our Austral space — whichever suits you, at the same flat rate.',
    },
  },
  {
    slug: 'carnes-hill',
    name: 'Carnes Hill',
    postcode: '2171',
    lede: 'Carnes Hill families are a short drive from our Austral base, and we work with students from the local primary schools right up to selective and HSC level.',
    schools: ['Carnes Hill Public School', 'Horningsea Park Public School'],
    localNote: 'Between Carnes Hill Marketplace and the local schools, it\'s an established family suburb — and one where parents increasingly want maths and English support that actually targets their child\'s weak spots.',
    faq: {
      q: 'How does tutoring work for Carnes Hill families?',
      a: 'We come to your home in Carnes Hill or you visit our Austral space — same price either way. Every student starts with a free trial lesson so we can find the exact gaps before committing to anything.',
    },
  },
  {
    slug: 'hoxton-park',
    name: 'Hoxton Park',
    postcode: '2171',
    lede: 'We tutor maths and English for Hoxton Park students from Kindergarten through to Year 12, including students at Hoxton Park Public and Hoxton Park High.',
    schools: ['Hoxton Park Public School', 'Hoxton Park High School'],
    localNote: 'Hoxton Park is a busy, established part of the Liverpool area with large local schools — the kind of setting where a bit of one-to-one attention goes a long way.',
    faq: {
      q: 'Do you tutor Hoxton Park High and primary students?',
      a: 'Yes — we work with students at every Hoxton Park school and year level. Lessons happen in your home or at our Austral space, and the first trial lesson is free.',
    },
  },
  {
    slug: 'middleton-grange',
    name: 'Middleton Grange',
    postcode: '2171',
    lede: 'Middleton Grange is one of the newer master-planned suburbs in the Liverpool area, full of families who want their kids to get ahead early. We build a plan around each child rather than handing out generic worksheets.',
    schools: ['Middleton Grange Public School', 'Thomas Hassall Anglican College'],
    localNote: 'Because Middleton Grange schools are new and growing fast, classes fill quickly. Targeted tutoring keeps your child from getting lost in the crowd.',
    faq: {
      q: 'Is tutoring available in Middleton Grange?',
      a: 'Yes. A tutor will come to you in Middleton Grange, or your child can come to our nearby Austral space — same flat rate, starting with a free trial lesson.',
    },
  },
  {
    slug: 'prestons',
    name: 'Prestons',
    postcode: '2170',
    lede: 'We tutor students across Prestons in both maths and English, from local public schools to William Carey Christian School and Thomas Hassall Anglican College.',
    schools: ['Prestons Public School', 'William Carey Christian School', 'Thomas Hassall Anglican College'],
    localNote: 'Prestons has a real mix of public, Christian and independent schools, each with its own pace. We match the tutoring to your child\'s actual syllabus and where they\'re stuck.',
    faq: {
      q: 'Do you cover both public and private school students in Prestons?',
      a: 'Yes — whichever school your child attends in Prestons, we tutor to the NSW (NESA) syllabus and their specific gaps. In-home or at our Austral space, same price.',
    },
  },
  {
    slug: 'west-hoxton',
    name: 'West Hoxton',
    postcode: '2171',
    lede: 'West Hoxton sits just minutes from our Austral base, and we tutor local students in maths and English from the early primary years right through to the HSC.',
    schools: ['West Hoxton Public School', 'Hinchinbrook Public School'],
    localNote: 'It\'s a quiet, family-heavy suburb where parents are increasingly looking for tutoring that does more than repeat what the classroom already covered.',
    faq: {
      q: 'Can a tutor come to my home in West Hoxton?',
      a: 'Yes — West Hoxton is close to us, so in-home tutoring is easy. You can also come to our Austral space for the same flat rate. Every new student gets a free trial lesson.',
    },
  },
  {
    slug: 'liverpool',
    name: 'Liverpool',
    postcode: '2170',
    lede: 'Liverpool is the regional hub just north of us, and we tutor students from right across it — from local primary schools to John Edmondson High and the selective and HSC cohorts.',
    schools: ['Liverpool West Public School', 'John Edmondson High School', 'All Saints Catholic College'],
    localNote: 'With some of the biggest schools in the region, Liverpool students can easily slip through the cracks in a crowded classroom. One-to-one tutoring gives them the attention a big cohort can\'t.',
    faq: {
      q: 'Do you tutor students from Liverpool?',
      a: 'Yes — plenty of our students come from the wider Liverpool area. We\'ll come to your home, or you can come to our Austral space just south of the centre, for the same price.',
    },
  },
]

export const getLocation = (slug) => locations.find((l) => l.slug === slug)
