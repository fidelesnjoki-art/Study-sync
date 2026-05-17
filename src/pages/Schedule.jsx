import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";

export default function Schedule() {
  const { user } = useAuth();

  const [schedules, setSchedules] = useState([]);

  const [form, setForm] = useState({
    subject: "",
    day: "",
    time: "",
  });

  const fetchSchedules = async () => {

  if (!user?.email) return;

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
};

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.subject || !form.day || !form.time) return;

    await addDoc(collection(db, "schedules"), {
      subject: form.subject,
      day: form.day,
      time: form.time,
      userEmail: user.email,
    });

    setForm({ subject: "", day: "", time: "" });
    fetchSchedules();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "schedules", id));
    fetchSchedules();
  };

  return (
    <div className="schedule-container">
      <h1>📅 Study Schedule</h1>

      <form className="schedule-form" onSubmit={handleAdd}>
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />

        <input
          placeholder="Day"
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })}
        />

        <input
          placeholder="Time "
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
        />

        <button type="submit">Add Schedule</button>
      </form>

      <div className="schedule-grid">
        {schedules.map((s) => (
          <div className="schedule-card" key={s.id}>
            <h3>{s.subject}</h3>
            <p> {s.day}</p>
            <p> {s.time}</p>

            <button onClick={() => handleDelete(s.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}