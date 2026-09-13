import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './styles/site.css'
import Home from './pages/Home'
import ThankYou from './pages/ThankYou'
import LocationsHub from './pages/LocationsHub'
import LocationPage from './pages/LocationPage'
import RouteTracker from './components/RouteTracker'
import { captureAttribution } from './utils/attribution'

captureAttribution()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tutoring" element={<LocationsHub />} />
        <Route path="/tutoring/:suburb" element={<LocationPage />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <RouteTracker />
    </BrowserRouter>
  </StrictMode>
)
