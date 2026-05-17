import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      {/* Welcome Banner */}
      <div className="hero-banner">
        <p>New to StudySync? Create an account and get 7 days of premium features free.</p>
      </div>

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
            <p className="hero-note">
              No credit card required. Cancel anytime.
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
            <h3>Smart Task System</h3>
            <p>
              Break down your work, track progress, and actually finish what you start.
            </p>
            <span className="feature-tip">Tip: Use subtasks to beat procrastination</span>
          </div>

          <div className="feature-card">
            <h3>🗓 Study Planning</h3>
            <p>
              Build structured schedules that adapt to your goals and free time.
            </p>
            <span className="feature-tip">⚡ Auto-reschedule if you miss a session</span>
          </div>

          <div className="feature-card">
            <h3>Progress Insights</h3>
            <p>
              See what you’ve completed, what’s pending, and how consistent you are.
            </p>
            <span className="feature-tip">Get weekly streak reports</span>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to take control of your study life?</h2>
        <p>Start organizing your tasks and building consistency today.</p>
        <p className="cta-message">
          Over 500 students started this week. Your turn.
        </p>

        <Link to="/register">
          <button className="primary-btn">Start Now</button>
        </Link>
      </section>
    </>
  );
}