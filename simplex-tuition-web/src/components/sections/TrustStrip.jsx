import { BarChart, Clock, Users, Star } from '../icons'

export default function TrustStrip() {
  return (
    <div className="strip">
      <div className="strip-inner">
        <span className="strip-item"><BarChart /> Personalised plan per student</span>
        <span className="sep"></span>
        <span className="strip-item"><Clock /> Callback within 24 hours</span>
        <span className="sep"></span>
        <span className="strip-item"><Users /> One-to-one, never a class</span>
        <span className="sep"></span>
        <span className="strip-item"><Star /> 5.0 on Google &middot; 13 reviews</span>
      </div>
    </div>
  )
}
