
// import { Link } from "react-router-dom";

// export default function Home() {
//   return (
//     <>
//     <div className="hero-section">
//     <div className="hero">
//     <div className="hero-text">
//       <h1>Organize Your Study Life Like a Pro 📚 </h1>
//      <p>StudySync helps students manage tasks, schedules, productivity,
//         and study goals all in one place.</p>

//     <div className="hero-buttons">

//     <Link to="/register">
//       <button className="primary-btn">Get Started</button>
//     </Link>
//     <Link to="/login">
//       <button className="secondary-btn">Login</button>
//     </Link>

//     </div>
//     </div>

//     </div>
//     </div>

//     <section className="features">
//       <h2>Why Choose StudySync?</h2>

//     <div className="feature-grid">
//     <div className="feature-card">
//       <h3>Smart Tasks</h3>
//       <p>Organize and complete your study tasks efficiently with progress tracking.</p>
//     </div>

//     <div className="feature-card">
//       <h3>Study Schedules</h3>
//       <p>Plan your study sessions with personalized schedules and better time management.</p>
//     </div>

//     <div className="feature-card">
//       <h3>Productivity Dashboard</h3>
//       <p>Monitor completed and pending tasks using real-time analytics and insights.</p>
//     </div>

//     </div>
//     </section>
//     </>
//   );
// }

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <div className="hero-section">
        <div className="hero">
          <div className="hero-text">
            <h1>Study smarter. Stay consistent. Achieve more 📚</h1>

            <p>
              StudySync is your all-in-one student productivity hub—plan tasks,
              organize schedules, track progress, and build better study habits
              without the chaos.
            </p>

            <div className="hero-buttons">
              <Link to="/register">
                <button className="primary-btn">Get Started Free</button>
              </Link>

              <Link to="/login">
                <button className="secondary-btn">Login</button>
              </Link>
            </div>

            <p className="hero-subtext">
              Join students building better study routines every day.
            </p>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features">
        <h2>Everything you need to stay on track</h2>

        <p className="features-subtitle">
          Simple tools designed to help you focus, plan, and improve your study flow.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📌 Smart Task System</h3>
            <p>
              Break down your work, track progress, and actually finish what you start.
            </p>
          </div>

          <div className="feature-card">
            <h3>🗓 Study Planning</h3>
            <p>
              Build structured schedules that adapt to your goals and free time.
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Progress Insights</h3>
            <p>
              See what you’ve completed, what’s pending, and how consistent you are.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta">
        <h2>Ready to take control of your study life?</h2>
        <p>Start organizing your tasks and building consistency today.</p>

        <Link to="/register">
          <button className="primary-btn">Start Now</button>
        </Link>
      </section>
    </>
  );
}