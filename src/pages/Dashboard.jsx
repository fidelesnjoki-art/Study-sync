import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const snap = await getDocs(collection(db, "tasks"));

      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const userTasks = data.filter(
        (task) => task.userEmail === user.email
      );

      setTasks(userTasks);
    };

    fetchTasks();
  }, [user]);

  const completedTasks = tasks.filter(
    (task) => task.completed === true
  );

  const pendingTasks = tasks.filter(
    (task) => task.completed !== true
  );

  return (
    <div className="dashboard">
      <h1>📊 Your Dashboard</h1>

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
      </div>
    </div>
  );
}