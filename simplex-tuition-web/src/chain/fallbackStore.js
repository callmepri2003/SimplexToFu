// The prerender puts a plain, readable version of the whole chain into the page's HTML, for
// search engines and for anyone whose JavaScript has not arrived yet. Only the build ever
// sets it (entry-server.jsx), so the chain's data never has to ship in the main bundle just
// to reproduce that HTML in the browser.
let html = ''
export const setChainFallback = (value) => { html = value }
export const getChainFallback = () => html
