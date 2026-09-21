// Copies the parent-safe export of the maths skills chain into this repo.
//
//   npm run sync:chain
//
// The chain lives in the sibling repo simplexSkillsChain. Vercel cannot see a sibling
// repo, so the export is committed here. To update the chain on the site: run
// `npm run render` there, `npm run sync:chain` here, commit, deploy.
//
// ONLY parents.json may be copied. chain.json holds the diagnostic test statements
// and internal notes; src/data/skillsChain.test.js fails the build if they ever land here.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const candidates = [
  process.env.SIMPLEX_SKILLS_CHAIN && `${process.env.SIMPLEX_SKILLS_CHAIN}/rendered/parents.json`,
  fileURLToPath(new URL('../../../simplexSkillsChain/rendered/parents.json', import.meta.url)),
].filter(Boolean)

const source = candidates.find((file) => existsSync(file))
if (!source) {
  console.error(`Could not find parents.json. Looked in:\n  ${candidates.join('\n  ')}\nSet SIMPLEX_SKILLS_CHAIN to the simplexSkillsChain repo.`)
  process.exit(1)
}

const data = JSON.parse(readFileSync(source, 'utf8'))
const target = fileURLToPath(new URL('../src/data/skillsChain.json', import.meta.url))
// Minified: this ships to phones.
writeFileSync(target, `${JSON.stringify(data)}\n`)
console.log(`synced ${data.skills.length} skills in ${data.bands.length} stages from ${source}`)

// ── The landing page's preview ─────────────────────────────────────────────────
// /maths-map lets a parent tap a topic and see how far back it reaches, before they
// have the map. Every number it shows is worked out here from the real chain, so the
// page cannot drift from the map. It carries counts and a few skill names, nothing else.
const TOPICS = [ // chip label (a parent's word for it) -> the skill it stands for
  ['Times tables', 'M-34-07'],
  ['Fractions', 'M-56-09'],
  ['Percentages', 'M-78-04'],
  ['Algebra', 'M-78-08'],
  ['Equations', 'M-78-10'],
  ['Trigonometry', 'M-910-13'],
]
// The hero drawing: one real line of the chain. Each skill must directly depend on the one before.
const HERO_LINE = ['M-34-10', 'M-56-08', 'M-56-09', 'M-78-02', 'M-910-03']

const byId = new Map(data.skills.map((s) => [s.id, s]))
const need = (id) => { const s = byId.get(id); if (!s) throw new Error(`sync-chain: no skill ${id} in the chain any more; update TOPICS or HERO_LINE`); return s }
const stage = (s) => data.bands.find((b) => b.key === s.band).label

const topics = TOPICS.map(([chip, id]) => {
  const target = need(id)
  const below = new Set()
  const queue = [...target.needs]
  while (queue.length) { const cur = queue.pop(); if (below.has(cur)) continue; below.add(cur); queue.push(...need(cur).needs) }
  const stages = data.bands
    .map((b) => {
      const inStage = data.skills.filter((s) => s.band === b.key && below.has(s.id))
      // name the ones the skill rests on directly, then the spine; the rest stay covered until the map is open
      const shown = [...inStage].sort((x, y) => (target.needs.includes(y.id) - target.needs.includes(x.id)) || (y.spine - x.spine)).slice(0, 2)
      return { label: b.label, count: inStage.length, names: shown.map((s) => s.label) }
    })
    .filter((st) => st.count > 0)
  return { id, chip, topic: target.topic, label: target.label, stage: stage(target), count: below.size, stages }
})

HERO_LINE.slice(1).forEach((id, i) => {
  if (!need(id).needs.includes(HERO_LINE[i])) throw new Error(`sync-chain: ${id} no longer depends directly on ${HERO_LINE[i]}; pick a new HERO_LINE`)
})
const heroLine = HERO_LINE.map((id) => ({ label: need(id).label, stage: stage(need(id)) }))

const teaser = { skills: data.skills.length, stages: data.bands.length, topics, heroLine }
writeFileSync(fileURLToPath(new URL('../src/data/skillsMapTeaser.json', import.meta.url)), `${JSON.stringify(teaser, null, 1)}\n`)
console.log(`preview: ${topics.map((t) => `${t.chip} ${t.count}`).join(', ')}`)
