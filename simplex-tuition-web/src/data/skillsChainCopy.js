// Every word on the maths skills chain page that is not the chain itself.
//
// The chain component deliberately sells nothing: no button, no pitch. The one call
// to action on the page is the form underneath it, and its words live here.
// OWNER: check `book` against what a diagnostic really is before this page goes live.
export const CHAIN_PATH = '/maths-skills-chain'

export const CHAIN_COPY = {
  title: 'Stuck in maths? See why.',
  lead: 'Maths is a chain. Tap the skill your child finds hard.',
  pathNote: 'A gap in any one of them causes trouble here. The hard part is knowing which one.',
}

export const CHAIN_BOOK = {
  heading: 'Find the weak link.',
  body: 'In a maths diagnostic, a Simplex tutor sits with your child and checks the skills in their chain, one at a time, so you know where the gap is.',
}

// What the lead form says on this page, in place of its free-lesson wording.
export const DIAGNOSTIC_OFFER = {
  id: 'diagnostic',
  title: 'Book a maths diagnostic',
  submit: 'Book a diagnostic',
  foot: '',
  subject: 'New maths diagnostic request',
}
