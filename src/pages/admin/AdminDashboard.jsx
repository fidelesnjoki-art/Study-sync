import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);

      const snap = await getDocs(collection(db, "tasks"));

      const allTasks = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setTasks(allTasks);
      setLoading(false);
    };

    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const totalUsers = new Set(tasks.map((t) => t.userEmail)).size;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage all user tasks and platform activity</p>
      </div>

      <div className="admin-stats">
        <div className="admin-card">
          <h3>Total Tasks</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="admin-card">
          <h3>Total Users</h3>
          <p>{totalUsers}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div className="task-list">
          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <div>
                  <p><b>Task:</b> {task.title || task.task}</p>
                  <p><b>User:</b> {task.userEmail || "unknown"}</p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )};