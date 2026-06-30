import React, { useState, useEffect, useRef } from "react";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

export default function Timer() {
  const { user } = useAuth();
  const toast = useToast();

  // Timer settings (in seconds)
  const modes = {
    focus: { label: "Focus Session", duration: 25 * 60, color: "#6366f1" },
    shortBreak: { label: "Short Break", duration: 5 * 60, color: "#10b981" },
    longBreak: { label: "Long Break", duration: 15 * 60, color: "#a855f7" }
  };

  const [activeMode, setActiveMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(modes.focus.duration);
  const [isActive, setIsActive] = useState(false);
  const [dailyFocusCount, setDailyFocusCount] = useState(0);

  const timerRef = useRef(null);

  // Sync timer display to browser tab title
  useEffect(() => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    document.title = `${timeStr} | ${modes[activeMode].label} | StudySync`;
    return () => {
      document.title = "StudySync";
    };
  }, [secondsLeft, activeMode]);

  // Fetch today's completed focus sessions
  const fetchTodaySessions = async () => {
    if (!user?.email) return;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, "focus_sessions"),
        where("userEmail", "==", user.email),
        where("createdAt", ">=", Timestamp.fromDate(today))
      );

      const snap = await getDocs(q);
      setDailyFocusCount(snap.docs.length);
    } catch (e) {
      console.error("Error fetching sessions: ", e);
    }
  };

  useEffect(() => {
    fetchTodaySessions();
  }, [user]);

  // Handle timer countdown
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, activeMode]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    playChime();

    if (activeMode === "focus") {
      toast.success("Focus Session Complete!", "Outstanding! You earned a well-deserved break.");
      
      // Save session to Firestore
      if (user?.email) {
        try {
          await addDoc(collection(db, "focus_sessions"), {
            userEmail: user.email,
            duration: 25, // 25 minutes
            createdAt: Timestamp.now()
          });
          fetchTodaySessions();
        } catch (error) {
          console.error("Failed to save focus session: ", error);
        }
      }

      // Automatically transition to short break
      switchMode("shortBreak");
    } else {
      toast.success("Break Finished!", "Time to sync back in and crush your goals.");
      switchMode("focus");
    }
  };

  const switchMode = (modeKey) => {
    setIsActive(false);
    setActiveMode(modeKey);
    setSecondsLeft(modes[modeKey].duration);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(modes[activeMode].duration);
  };

  // Web Audio API Synthesizer Chime
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
      // Play a lovely ascending major chord arpeggio
      playNote(523.25, ctx.currentTime, 0.4); // C5
      playNote(659.25, ctx.currentTime + 0.12, 0.4); // E5
      playNote(783.99, ctx.currentTime + 0.24, 0.4); // G5
      playNote(1046.50, ctx.currentTime + 0.36, 0.6); // C6
    } catch (e) {
      console.error("Web Audio API blocked or not supported: ", e);
    }
  };

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Circle progress math
  const totalDuration = modes[activeMode].duration;
  const progress = (secondsLeft / totalDuration);
  const strokeDasharray = 2 * Math.PI * 110; // radius is 110
  const strokeDashoffset = strokeDasharray * (1 - progress);

  return (
    <div className="timer-container">
      <div className="timer-box">
        {/* Navigation Tabs */}
        <div className="timer-tabs">
          <button 
            className={`timer-tab ${activeMode === "focus" ? "active" : ""}`}
            onClick={() => switchMode("focus")}
          >
            Focus Timer
          </button>
          <button 
            className={`timer-tab ${activeMode === "shortBreak" ? "active" : ""}`}
            onClick={() => switchMode("shortBreak")}
          >
            Short Break
          </button>
          <button 
            className={`timer-tab ${activeMode === "longBreak" ? "active" : ""}`}
            onClick={() => switchMode("longBreak")}
          >
            Long Break
          </button>
        </div>

        {/* Circular Countdown Progress */}
        <div className="timer-circle-visual">
          <svg className="timer-circle-svg">
            <circle className="timer-circle-bg" cx="125" cy="125" r="110" />
            <circle 
              className="timer-circle-progress" 
              cx="125" 
              cy="125" 
              r="110"
              style={{
                strokeDasharray: strokeDasharray,
                strokeDashoffset: strokeDashoffset,
                stroke: modes[activeMode].color
              }}
            />
          </svg>
          <div className="timer-time-display">{formatTime(secondsLeft)}</div>
        </div>

        <div className="timer-session-label">{modes[activeMode].label}</div>

        {/* Timer Control Buttons */}
        <div className="timer-controls">
          <button className="timer-btn-primary" onClick={toggleTimer}>
            {isActive ? "Pause" : "Start Session"}
          </button>
          <button className="timer-btn-secondary" onClick={resetTimer}>
            Reset
          </button>
        </div>

        {/* Session Stats Counter */}
        <div className="timer-stats-summary">
          <span>Today's Completed Sessions:</span>
          <span className="timer-stats-count">{dailyFocusCount}</span>
        </div>
      </div>
    </div>
  );
}
