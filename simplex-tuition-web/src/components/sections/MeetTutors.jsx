import { Cap, Clock, Users, Book, Star } from '../icons'

export default function MeetTutors() {
  return (
    <section className="block about" id="about">
      <div className="wrap about-grid">
        <div className="photo-slot about-photo">
          <img src="/tutors.jpg" alt="Simplex tutors working through a problem with a student" loading="lazy" />
        </div>
        <div>
          <span className="eyebrow">Meet the tutors</span>
          <h2>Tutors from the top few percent of the state</h2>
          <p className="lead">Every Simplex tutor scored a 95+ ATAR and has years of tutoring experience. We match your child with the right one, male or female, for how they actually learn, and stay on top of their progress every step.</p>
          <div className="cred-list">
            <div className="cred"><Cap /> Every tutor scored a 95+ ATAR</div>
            <div className="cred"><Clock /> Years of real tutoring experience</div>
            <div className="cred"><Users /> Male and female tutors, matched to your child</div>
            <div className="cred"><Book /> Aligned to the NSW (NESA) syllabus &amp; HSC</div>
            <div className="cred"><Star /> 5.0 rating across 13 Google reviews</div>
          </div>
        </div>
      </div>
    </section>
  )
}
