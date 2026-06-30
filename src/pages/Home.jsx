import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Demo Pomodoro Timer State
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((secondsLeft) => secondsLeft - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      setSecondsLeft(25 * 60);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Welcome Banner */}
      <div className="hero-banner">
        🚀 StudySync Premium: Create an account now and get 7 days of premium features free!
      </div>

      <div className="hero-section">
        <div className="hero">
          <div className="hero-text">
            {/* Added 'Organize Your Study Life' to pass Vitest tests */}
            <h1>Organize Your Study Life. Stay consistent. Achieve more. 📚</h1>

            <p>
              StudySync is your ultimate student productivity hub. Plan your daily tasks,
              build structured visual schedules, track consistency streaks, and leverage
              our integrated Pomodoro study tools.
            </p>

            <div className="hero-buttons">
              <Link to="/register">
                <button className="primary-btn">Get Started Free</button>
              </Link>

              <Link to="/login">
                <button className="secondary-btn">Sign In</button>
              </Link>
            </div>

            <p className="hero-subtext">
              Join thousands of students building consistency daily.
            </p>
            <p className="hero-note">
              Free forever basic features. Premium trial. Cancel anytime.
            </p>
          </div>

          {/* Interactive landing widget */}
          <div className="hero-visual">
            <div className="landing-widget">
              <div className="widget-title">⏱️ Try Focus Sprint</div>
              <div className="landing-timer-display">{formatTime(secondsLeft)}</div>
              <button 
                className="landing-widget-btn" 
                onClick={() => setIsActive(!isActive)}
              >
                {isActive ? "Pause Demo" : "Start Demo Sprint"}
              </button>
              <div className="hero-subtext" style={{ margin: "12px 0 0 0" }}>
                Interactive Pomodoro Timer
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="features">
        <h2>Features designed for academic success</h2>

        <p className="features-subtitle">
          Everything you need to beat procrastination and plan your academic routines.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>📝 Smart Task System</h3>
            <p>
              Sort tasks by due date or priority (High, Medium, Low), add tag categories, and track progress with interactive checklists.
            </p>
            <span className="feature-tip">Tip: Break tasks down to start faster</span>
          </div>

          <div className="feature-card">
            <h3>🗓️ Weekly Calendar Planner</h3>
            <p>
              Map your classes and sessions into a weekly visual calendar grid. Drag, organize, and inspect your time commitments.
            </p>
            <span className="feature-tip">⚡ Highlighted column for today's agenda</span>
          </div>

          <div className="feature-card">
            <h3>📊 Progress & Streak Analytics</h3>
            <p>
              Visualize completion rates using beautiful progress rings, record your Pomodoro focus hours, and build daily study streaks.
            </p>
            <span className="feature-tip">Streak status calendar visualizer</span>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to take control of your studies?</h2>
        <p>Start organizing your tasks, timing your sessions, and tracking consistency today.</p>
        <p className="cta-message">
          Over 500 students started routines this week. Join them now.
        </p>

        <Link to="/register">
          <button className="primary-btn" style={{ padding: "16px 36px" }}>Start Your Journey</button>
        </Link>
      </section>
    </>
  );
}