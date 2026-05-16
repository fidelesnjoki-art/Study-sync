
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
    <div className="hero-section">
    <div className="hero">
    <div className="hero-text">
      <h1>Organize Your Study Life Like a Pro 📚 </h1>
     <p>StudySync helps students manage tasks, schedules, productivity,
        and study goals all in one place.</p>

    <div className="hero-buttons">

    <Link to="/register">
      <button className="primary-btn">Get Started</button>
    </Link>
    <Link to="/login">
      <button className="secondary-btn">Login</button>
    </Link>

    </div>
    </div>

    </div>
    </div>

    <section className="features">
      <h2>Why Choose StudySync?</h2>

    <div className="feature-grid">
    <div className="feature-card">
      <h3>Smart Tasks</h3>
      <p>Organize and complete your study tasks efficiently with progress tracking.</p>
    </div>

    <div className="feature-card">
      <h3>Study Schedules</h3>
      <p>Plan your study sessions with personalized schedules and better time management.</p>
    </div>

    <div className="feature-card">
      <h3>Productivity Dashboard</h3>
      <p>Monitor completed and pending tasks using real-time analytics and insights.</p>
    </div>

    </div>
    </section>
    </>
  );
}