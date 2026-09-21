import { describe, it, expect } from 'vitest'
import chain from '../data/skillsChain.json'
import { layoutVertical, lineage } from './verticalLayout'

const overlaps = (nodes) => {
  let n = 0
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j]
      if (a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h) n++
    }
  }
  return n
}

// The widths are the real ones: a 320px phone, common phones, a tablet, a laptop.
describe.each([320, 360, 390, 700, 960])('the chain laid out at %ipx', (width) => {
  const layout = layoutVertical(chain, width)
  const byId = new Map(layout.nodes.map((n) => [n.id, n]))

  it('places every skill, with no two cards overlapping', () => {
    expect(layout.nodes).toHaveLength(chain.skills.length)
    expect(overlaps(layout.nodes)).toBe(0)
  })

  it('keeps every card on the screen', () => {
    layout.nodes.forEach((n) => {
      expect(n.x).toBeGreaterThanOrEqual(0)
      expect(n.x + n.w).toBeLessThanOrEqual(width)
    })
  })

  it('only ever draws a link downward, from an earlier skill to a later one', () => {
    layout.edges.forEach((e) => expect(byId.get(e.from).y + byId.get(e.from).h).toBeLessThanOrEqual(byId.get(e.to).y))
  })

  it('stacks the stages in order, Kindergarten first', () => {
    expect(layout.bands.map((b) => b.key)).toEqual(chain.bands.map((b) => b.key))
    layout.bands.slice(1).forEach((b, i) => expect(b.top).toBeGreaterThan(layout.bands[i].top))
  })
})

describe('a skill\'s path', () => {
  const equations = chain.skills.find((s) => s.topic === 'Solving equations')
  const { below } = lineage(chain, equations.id)

  it('reaches back across stages to Kindergarten', () => {
    const stages = new Set([...below].map((id) => chain.skills.find((s) => s.id === id).band))
    expect(below.size).toBeGreaterThan(20)
    expect(stages.has('k-2')).toBe(true)
  })

  it('lays out only that skill and what it depends on', () => {
    const only = new Set([...below, equations.id])
    const layout = layoutVertical(chain, 390, { only })
    expect(layout.nodes).toHaveLength(only.size)
    expect(overlaps(layout.nodes)).toBe(0)
    expect(layout.height).toBeLessThan(layoutVertical(chain, 390).height)
  })

  it('grows the cards when the reader has enlarged their text', () => {
    expect(layoutVertical(chain, 390, { scale: 1.5 }).nodes[0].h).toBeGreaterThan(layoutVertical(chain, 390).nodes[0].h)
  })
})
