// Everything heavy about the chain page: the component, its styles and its data. Loaded
// on that route only, after the page has painted, so no other page pays for it.
import ParentView from './ParentView'
import data from '../data/skillsChain.json'
import { CHAIN_COPY } from '../data/skillsChainCopy'
import './parent.css'
import './host.css'

export default function ChainIsland({ onEvent, onFocus }) {
  // brand: '' hides the component's own top bar; the site header is already there.
  return <ParentView data={data} onEvent={onEvent} onFocus={onFocus} copy={{ ...CHAIN_COPY, brand: '' }} />
}
