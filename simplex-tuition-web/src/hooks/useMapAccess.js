import { useSyncExternalStore } from 'react'
import { hasMapAccess, subscribeMapAccess } from '../utils/mapAccess'

// Whether this browser may open the maths skills map. Access is a note in localStorage, which
// does not exist while the page is being prerendered, so the server's answer is always "no" and
// the browser corrects it after hydration without a mismatch.
export function useMapAccess() {
  return useSyncExternalStore(subscribeMapAccess, hasMapAccess, () => false)
}
