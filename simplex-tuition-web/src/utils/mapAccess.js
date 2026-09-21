// Who may open the maths skills map.
//
// The map is given in exchange for an email on /maths-map. This site has no accounts and
// no server, so "access" is a note in this browser: enough to make the exchange real for an
// ordinary parent, and honest about what it is. It is not security. Anyone determined can
// read the map's data; the things worth protecting (the diagnostic test statements) are
// never sent to the browser at all.
//
// A parent on a new phone simply enters their email again.
import { MAP_PASS } from '../data/skillsChainCopy'

const KEY = 'simplex_map_access_v1'

const store = () => {
  try { return window.localStorage } catch { return null } // private mode, or blocked storage
}

export function hasMapAccess() {
  try { return Boolean(JSON.parse(store()?.getItem(KEY) ?? 'null')?.at) } catch { return false }
}

// Pages read access with useMapAccess (src/hooks/useMapAccess.js), which needs to hear about changes:
// from this tab (granting below) and from another tab (the browser's own `storage` event).
const listeners = new Set()
export function subscribeMapAccess(listener) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => { listeners.delete(listener); window.removeEventListener('storage', listener) }
}

// how: 'email' (the landing page form) or 'pass' (a link from a tutor)
export function grantMapAccess(how) {
  try { store()?.setItem(KEY, JSON.stringify({ at: new Date().toISOString(), how })) } catch { /* nothing to do */ }
  listeners.forEach((l) => l())
}

// A tutor's link carries ?pass=family. Returns true if this address lets the visitor in.
export function passFromSearch(search) {
  return new URLSearchParams(search).get('pass') === MAP_PASS
}

// Where to send someone after the email step: back to the exact spot on the map they asked for.
// Only ever a fragment on the map page, so a crafted link cannot send a parent anywhere else.
export function safeNext(next) {
  return typeof next === 'string' && /^#(path|skill|year)=[\w-]+$/.test(next) ? next : ''
}
