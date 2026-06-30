import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc, Timestamp, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mini Timer State
  const [miniTimerSeconds, setMiniTimerSeconds] = useState(25 * 60);
  const [miniTimerActive, setMiniTimerActive] = useState(false);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    if (!user?.email) return;
    setLoading(true);

    try {
      // 1. Fetch tasks
      const qTasks = query(collection(db, "tasks"), where("userEmail", "==", user.email));
      const snapTasks = await getDocs(qTasks);
      const taskData = snapTasks.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTasks(taskData);

      // 2. Fetch focus sessions
      const qFocus = query(collection(db, "focus_sessions"), where("userEmail", "==", user.email));
      const snapFocus = await getDocs(qFocus);
      const focusData = snapFocus.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setFocusSessions(focusData);
    } catch (e) {
      console.error("Dashboard data load error: ", e);
      toast.error("Dashboard Load Error", "Failed to retrieve study insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Handle mini timer ticking
  useEffect(() => {
    let interval = null;
    if (miniTimerActive && miniTimerSeconds > 0) {
      interval = setInterval(() => {
        setMiniTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (miniTimerSeconds === 0) {
      clearInterval(interval);
      setMiniTimerActive(false);
      handleMiniTimerComplete();
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [miniTimerActive, miniTimerSeconds]);

  const handleMiniTimerComplete = async () => {
    playChime();
    toast.success("Dashboard Focus Block Finished!", "Awesome work! Focus session saved.");
    setMiniTimerSeconds(25 * 60);
    
    // Save to Firestore
    if (user?.email) {
      try {
        await addDoc(collection(db, "focus_sessions"), {
          userEmail: user.email,
          duration: 25,
          createdAt: Timestamp.now()
        });
        fetchDashboardData();
      } catch (err) {
        console.error("Error saving mini timer session:", err);
      }
    }
  };

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const playNote = (freq, time, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + duration);
      };
      playNote(523.25, ctx.currentTime, 0.4); // C5
      playNote(659.25, ctx.currentTime + 0.15, 0.4); // E5
      playNote(783.99, ctx.currentTime + 0.3, 0.6); // G5
    } catch (e) {
      console.error(e);
    }
  };

  // Quick complete task from dashboard
  const handleQuickComplete = async (taskId, currentStatus, name) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, {
        completed: !currentStatus
      });
      toast.success("Task Complete!", `"${name}" finished.`);
      fetchDashboardData();
    } catch (err) {
      toast.error("Error updating status", err.message);
    }
  };

  // Calculations
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completionRate = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);

  // Streak Analysis & Calendar Setup
  // Map last 7 days including today
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // 6 days ago up to today
    return d;
  });

  const getLocalDateString = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // Build a set of active dates (focus session date or task completion date)
  const activeDatesSet = new Set();
  focusSessions.forEach((session) => {
    if (session.createdAt) {
      const date = session.createdAt.toDate ? session.createdAt.toDate() : new Date(session.createdAt);
      activeDatesSet.add(getLocalDateString(date));
    }
  });
  completedTasks.forEach((task) => {
    if (task.dueDate) {
      activeDatesSet.add(task.dueDate);
    }
  });

  // Calculate Streak
  let streak = 0;
  let checkDate = new Date();
  
  // If today isn't active, check yesterday to see if the streak is still alive
  const todayStr = getLocalDateString(checkDate);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  let startCalculating = false;
  if (activeDatesSet.has(todayStr)) {
    startCalculating = true;
  } else if (activeDatesSet.has(yesterdayStr)) {
    startCalculating = true;
    checkDate = yesterday;
  }

  if (startCalculating) {
    while (true) {
      const dateStr = getLocalDateString(checkDate);
      if (activeDatesSet.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1); // Go back one day
      } else {
        break;
      }
    }
  }

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circular progress loader logic
  const radius = 28;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray * (1 - completionRate / 100);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Your Dashboard</h1>
          <p>Welcome back, <b>{user.email.split("@")[0]}</b>! Let's conquer today's study sprints.</p>
        </div>
        <div className="hero-note" style={{ fontSize: "14px" }}>
          📅 Today is {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#9ca3af", padding: "50px" }}>Compiling your insights...</p>
      ) : (
        <div className="dashboard-grid">
          {/* Main Content Pane */}
          <div className="dashboard-main">
            {/* Stats Dashboard */}
            <div className="stats">
              <div className="card">
                <h2>Total Tasks</h2>
                <p className="stat-number">{tasks.length}</p>
                <div className="card-icon">📁</div>
              </div>

              <div className="card">
                <h2>Completed Tasks</h2>
                <p className="stat-number">{completedTasks.length}</p>
                <div className="card-icon">✅</div>
              </div>

              <div className="card highlight">
                <div className="card-completion">
                  <div>
                    <h2>Task Progress</h2>
                    <p className="stat-number">{completionRate}%</p>
                  </div>
                  {/* Circular visual ring */}
                  <div className="progress-circle-container">
                    <svg style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                      <circle className="progress-circle-bg" cx="35" cy="35" r={radius} />
                      <circle
                        className="progress-circle-bar"
                        cx="35"
                        cy="35"
                        r={radius}
                        style={{
                          strokeDasharray: strokeDasharray,
                          strokeDashoffset: strokeDashoffset,
                          stroke: "var(--accent-primary)"
                        }}
                      />
                    </svg>
                    <div className="progress-text">{completionRate}%</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2>Focus Time</h2>
                <p className="stat-number">{totalFocusMinutes}m</p>
                <div className="card-icon">⏱️</div>
              </div>
            </div>

            {/* Consistency Streaks Panel */}
            <div className="dashboard-panel">
              <h3 className="dashboard-card-title">🔥 Daily Consistency Streak</h3>
              <div className="streak-tracker">
                <div className="streak-flame">
                  <span>{streak}</span>
                  <span className="streak-flame-label">{streak === 1 ? "DAY" : "DAYS"}</span>
                </div>
                
                <div className="streak-days-grid">
                  {last7Days.map((day) => {
                    const dateStr = getLocalDateString(day);
                    const isActive = activeDatesSet.has(dateStr);
                    const isToday = dateStr === getLocalDateString(new Date());

                    return (
                      <div 
                        key={dateStr} 
                        className={`streak-day-cell ${isActive ? "active" : ""}`}
                        title={day.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      >
                        <span>{day.toLocaleDateString("en-US", { weekday: "narrow" })}</span>
                        <span>{day.getDate()}</span>
                        {isActive && <span className="streak-day-dot"></span>}
                        {isToday && <span style={{ position: "absolute", top: "-4px", fontSize: "7px", background: "var(--accent-primary)", color: "white", padding: "1px 3px", borderRadius: "3px" }}>NOW</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Pending Tasks Panel */}
            <div className="dashboard-panel">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                <h3 className="dashboard-card-title" style={{ marginBottom: 0 }}>📝 Upcoming Agenda Items</h3>
                <Link to="/tasks" style={{ fontSize: "12px", color: "var(--accent-primary)", fontWeight: "600", textDecoration: "none" }}>
                  View All Tasks →
                </Link>
              </div>

              <div className="recent-tasks-list">
                {pendingTasks.length > 0 ? (
                  pendingTasks.slice(0, 3).map((task) => (
                    <div className="recent-task-item" key={task.id}>
                      <div className="recent-task-info">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          style={{ cursor: "pointer" }}
                          onChange={() => handleQuickComplete(task.id, task.completed, task.task)}
                        />
                        <span className="recent-task-text">{task.task}</span>
                      </div>
                      <span className={`task-badge badge-priority-${task.priority}`} style={{ fontSize: "9px" }}>
                        {task.priority}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="dashboard-empty-state">
                    🎉 Excellent! All scheduled tasks completed.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar widget Pane */}
          <div className="dashboard-sidebar">
            {/* Quick dashboard focus timer */}
            <div className="mini-timer-card">
              <div className="widget-title">⏱️ Fast Focus Sprint</div>
              <div className="mini-timer-clock">{formatTime(miniTimerSeconds)}</div>
              <div className="mini-timer-controls">
                <button 
                  className="primary-btn mini-timer-btn"
                  onClick={() => setMiniTimerActive(!miniTimerActive)}
                >
                  {miniTimerActive ? "Pause" : "Start"}
                </button>
                <button 
                  className="secondary-btn mini-timer-btn"
                  onClick={() => {
                    setMiniTimerActive(false);
                    setMiniTimerSeconds(25 * 60);
                  }}
                >
                  Reset
                </button>
              </div>
              <p className="hero-subtext" style={{ fontSize: "11px", marginTop: "16px" }}>
                Log 25 focus minutes directly to study streak analytics.
              </p>
            </div>

            {/* Quick Tips Box */}
            <div className="dashboard-panel" style={{ padding: "20px" }}>
              <h3 style={{ fontSize: "14px", marginBottom: "10px", color: "white" }}>💡 Study Science Tip</h3>
              <p style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.6" }}>
                Using Pomodoro sprints prevents cognitive overload. The brain can maintain deep focus for roughly 25-30 minutes before losing speed. Breaks restore vital neurochemicals!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}