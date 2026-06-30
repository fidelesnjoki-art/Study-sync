import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useToast } from "../../components/Toast";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "tasks"));
      const allTasks = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setTasks(allTasks);
    } catch (e) {
      console.error(e);
      toast.error("Fetch Failed", "Could not load administrative stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id, name) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      toast.success("Task Removed", `Task "${name}" deleted by administrator.`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Deletion Failed", error.message);
    }
  };

  const totalUsers = new Set(tasks.map((t) => t.userEmail)).size;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Console</h1>
        <p>Monitor user tasks, manage database metrics, and review system activities.</p>
      </div>

      <div className="admin-stats">
        <div className="admin-card">
          <h3>Total Database Tasks</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="admin-card">
          <h3>Active Platform Users</h3>
          <p>{totalUsers}</p>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#9ca3af", padding: "40px" }}>Loading console datasets...</p>
      ) : (
        <div className="task-list">
          {tasks.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No tasks found on the server.</p>
          ) : (
            tasks.map((task) => (
              <div className="task-card" key={task.id}>
                <div style={{ marginBottom: "15px" }}>
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", marginBottom: "8px" }}>
                    📚 {task.title || task.task || "Unnamed Task"}
                  </p>
                  <p>
                    <b>User:</b> {task.userEmail || "unknown"}
                  </p>
                  <p>
                    <b>Priority:</b> <span className={`task-badge badge-priority-${task.priority || "medium"}`}>{task.priority || "medium"}</span>
                  </p>
                  <p>
                    <b>Due Date:</b> {task.dueDate || "N/A"}
                  </p>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(task.id, task.title || task.task)}
                >
                  Delete Task
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}