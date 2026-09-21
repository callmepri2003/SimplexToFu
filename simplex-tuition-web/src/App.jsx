import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ThankYou from './pages/ThankYou'
import LocationsHub from './pages/LocationsHub'
import LocationPage from './pages/LocationPage'
import SkillsChain from './pages/SkillsChain'
import NotFound from './pages/NotFound'
import { CHAIN_PATH } from './data/skillsChainCopy'
import RouteTracker from './components/RouteTracker'

// Router-agnostic so the browser (BrowserRouter, main.jsx) and the prerender
// (StaticRouter, entry-server.jsx) render exactly the same tree.
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutoring" element={<LocationsHub />} />
        <Route path="/tutoring/:suburb" element={<LocationPage />} />
        <Route path={CHAIN_PATH} element={<SkillsChain />} />
        <Route path="/thank-you" element={<ThankYou />} />
        {/* Retired page. vercel.json 308s it in production; this covers dev. */}
        <Route path="/diagnostic" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RouteTracker />
    </>
  )
}
