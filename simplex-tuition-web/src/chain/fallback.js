// Build-time only (imported by entry-server.jsx): the chain as plain HTML.
// One heading per stage, its introduction, and each skill as a sentence a parent would
// search for. No ids, no codes: the data is already the parent-safe export.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function chainFallbackHtml(data) {
  return data.bands.map((band) => {
    const skills = data.skills.filter((s) => s.band === band.key)
    const items = skills.map((s) => `<li><strong>${esc(s.topic)}.</strong> ${esc(s.line)}</li>`).join('')
    return `<section><h2>${esc(band.label)}</h2><p>${esc(band.intro)}</p><p>By this stage, your child should be able to:</p><ul>${items}</ul></section>`
  }).join('')
}
