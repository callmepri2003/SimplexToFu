import { describe, it, expect } from 'vitest'
import { paths, defaultPath } from './pathContent'

const REQUIRED_KEYS = [
  'id', 'heroHeadline', 'heroSub', 'heroCTA',
  'howItWorksIntro', 'callbackHeadline', 'callbackSub',
]
const EXPECTED_PATH_IDS = ['struggling', 'assessment', 'selective', 'ahead', 'student']

describe('pathContent', () => {
  it('exports all expected path ids', () => {
    EXPECTED_PATH_IDS.forEach((id) => {
      expect(paths).toHaveProperty(id)
    })
  })

  EXPECTED_PATH_IDS.forEach((id) => {
    it(`path "${id}" has all required copy keys`, () => {
      REQUIRED_KEYS.forEach((key) => {
        expect(paths[id]).toHaveProperty(key)
        expect(paths[id][key]).toBeTruthy()
      })
    })

    it(`path "${id}" id property matches its key`, () => {
      expect(paths[id].id).toBe(id)
    })
  })

  it('defaultPath is the struggling path', () => {
    expect(defaultPath.id).toBe('struggling')
  })

  it('no two paths share the same heroHeadline', () => {
    const headlines = EXPECTED_PATH_IDS.map((id) => paths[id].heroHeadline)
    expect(new Set(headlines).size).toBe(headlines.length)
  })
})
