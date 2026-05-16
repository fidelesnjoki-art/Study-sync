

import { useEffect, useState } from "react";

import { collection,addDoc,getDocs,deleteDoc,doc,updateDoc,query,} from "firebase/firestore";

import { db } from "../firebase/firebase";
import { useAuth } from "../auth/AuthContext";

export default function Tasks() {
  const { user } = useAuth();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"));
    const snap = await getDocs(q);
    const data = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const userTasks = data.filter(
      (t) => t.userEmail === user.email
    );
    setTasks(userTasks);
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();

    if (!task) return;
    await addDoc(collection(db, "tasks"), {
      task,
      completed: false,
      userEmail: user.email,
    });

    setTask("");

    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));

    fetchTasks();
  };

  const toggleComplete = async (
    taskId,
    currentStatus
  ) => {
    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, {
      completed: !currentStatus,
    });
    fetchTasks();
  };

  return (
  <div className="container">
    <h1 style={{ marginBottom: "20px" }}>
    My Tasks
    </h1>

    <form onSubmit={handleAddTask}>
      <input
      type="text"
      placeholder="Enter a task..."
      value={task}
      onChange={(e) =>setTask(e.target.value)
      }
     />
       
     <button
      type="submit"
      className="primary-btn"
     >
          Add Task
        </button>
      </form>

      <input
        type="text"
        placeholder="Search tasks..."
        className="search-bar"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="task-grid">
        {tasks
        .filter((task) =>task.task && task.task
              .toLowerCase()
              .includes(search.toLowerCase())
          )
      .map((task) => (
       <div
          className="task-card"
          key={task.id}
         >
         <h3
          style={{
         textDecoration:
         task.completed
         ? "line-through"
          : "none",
           }}
     >
          {task.task}
       </h3>
       <p>Status:{" "} {task.completed ? "Completed "  : "Pending "} </p>
       <button className="primary-btn" onClick={() => toggleComplete(
        task.id, task.completed )}
     >
        {task.completed ? "Undo" : "Mark Complete"} </button>

        <button
          style={{ background: "crimson", color: "white", marginLeft: "10px", }}
          onClick={() => handleDelete(task.id)}
      > Delete
        </button>
      </div> ))}
      </div>
    </div>
  );
}