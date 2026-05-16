import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const snap = await getDocs(collection(db, "tasks"));

      const allTasks = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTasks(allTasks);
    };

    fetchTasks();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="Admin-container">
      <h1>Admin Dashboard</h1>

      <h3>Total Tasks: {tasks.length}</h3>
      <div className="admin-card">

      <div className="Admin-stats">
        
          <h2>All Tasks</h2>
        </div>
        <div className="task-list">
        {tasks.map((task) => ( <div className="task-card" key={task.id}
         >
        <p><b>Task:</b> {task.title || task.task}</p>
        <p><b>User:</b> {task.userEmail || "unknown"}</p>
        <button className="button" onClick={() => handleDelete(task.id)}>
         Delete </button>
      </div>
     ))}
      </div>
    </div>
    </div>
    
  );
}