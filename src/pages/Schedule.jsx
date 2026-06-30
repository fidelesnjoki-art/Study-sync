import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, query, where, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../components/Toast";

export default function Schedule() {
  const { user } = useAuth();
  const toast = useToast();

  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({
    subject: "",
    day: "Monday",
    startTime: "",
    endTime: "",
  });

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Find what today is (Monday, Tuesday, etc.)
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const fetchSchedules = async () => {
    if (!user?.email) return;

    try {
      const q = query(
        collection(db, "schedules"),
        where("userEmail", "==", user.email)
      );

      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSchedules(data);
    } catch (e) {
      console.error("Error fetching schedules: ", e);
      toast.error("Fetch Error", "Could not load schedules.");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.day || !form.startTime || !form.endTime) {
      toast.warning("Incomplete Form", "Please fill in all schedule details.");
      return;
    }

    try {
      await addDoc(collection(db, "schedules"), {
        subject: form.subject,
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
        userEmail: user.email,
      });

      toast.success("Schedule Block Added", `Successfully scheduled ${form.subject} on ${form.day}.`);
      
      setForm({
        subject: "",
        day: "Monday",
        startTime: "",
        endTime: "",
      });

      fetchSchedules();
    } catch (err) {
      toast.error("Failed to Add Schedule", err.message);
    }
  };

  const handleDelete = async (id, subject) => {
    try {
      await deleteDoc(doc(db, "schedules", id));
      toast.success("Schedule Block Removed", `"${subject}" removed from agenda.`);
      fetchSchedules();
    } catch (err) {
      toast.error("Failed to Delete", err.message);
    }
  };

  // Helper to sort schedule blocks by start time
  const getSchedulesForDay = (dayName) => {
    return schedules
      .filter((s) => s.day === dayName)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  return (
    <div className="schedule-container">
      <h1>📅 Study Schedule Planner</h1>
      <p className="schedule-subtitle">
        Organize your lectures, group studies, and individual prep sessions in a visual calendar grid.
      </p>

      <form className="schedule-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Subject or Class Name"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />

        <select
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })}
        >
          {daysOfWeek.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>

        <input
          type="time"
          value={form.startTime}
          title="Start Time"
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          required
        />

        <input
          type="time"
          value={form.endTime}
          title="End Time"
          onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          required
        />

        <button type="submit">Add Block</button>
      </form>

      {/* Weekly Schedule Grid View */}
      <div className="weekly-schedule-grid">
        {daysOfWeek.map((day) => {
          const daySessions = getSchedulesForDay(day);
          const isToday = day === todayName;

          return (
            <div 
              key={day} 
              className={`schedule-day-column ${isToday ? "today-column" : ""}`}
            >
              <div className="schedule-day-header">
                <span className="day-label">{day.substring(0, 3)}</span>
                {isToday && <span className="today-indicator">Today</span>}
              </div>

              <div className="schedule-day-body">
                {daySessions.length > 0 ? (
                  daySessions.map((s) => (
                    <div className="schedule-item-card" key={s.id}>
                      <div>
                        <h4>{s.subject}</h4>
                        <div className="schedule-item-time">
                          ⏰ {s.startTime} - {s.endTime}
                        </div>
                      </div>
                      <button 
                        className="schedule-item-delete" 
                        onClick={() => handleDelete(s.id, s.subject)}
                        title="Remove study block"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="schedule-column-empty">
                    <span>Free</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}