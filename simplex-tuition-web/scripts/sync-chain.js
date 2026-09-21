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
