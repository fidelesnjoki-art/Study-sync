import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {if (!user?.email) return;
    const fetchTasks = async () => {setLoading(true);

    const q = query(collection(db, "tasks"),
    where("userEmail", "==", user.email) );

    const snap = await getDocs(q);

    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data(), }));
    setTasks(data); setLoading(false);
    };

    fetchTasks();
  }, [user]);
  const completedTasks = tasks.filter((t) => t.completed);
  const pendingTasks = tasks.filter((t) => !t.completed);

  const completionRate = tasks.length === 0 ? 0
  : Math.round((completedTasks.length / tasks.length) * 100);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Your Dashboard</h1>
        <p>Welcome back, let’s get things done today.</p>
      </div>

      {loading ? (
        <p>Loading your tasks...</p>
      ) : (
        <>
          <div className="stats">
            <div className="card">
              <h2>Total Tasks</h2>
              <p>{tasks.length}</p>
            </div>

            <div className="card">
              <h2>Completed</h2>
              <p>{completedTasks.length}</p>
            </div>

            <div className="card">
              <h2>Pending</h2>
              <p>{pendingTasks.length}</p>
            </div>

            <div className="card highlight">
              <h2>Completion Rate</h2>
              <p>{completionRate}%</p>
            </div>
          </div>

          {tasks.length === 0 && (
            <div className="empty-state">
              <h3>No tasks yet </h3>
              <p>Create your first task to start tracking progress.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}