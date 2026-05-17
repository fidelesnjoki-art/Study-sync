import { useEffect, useState } from "react";

import {collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, where} from "firebase/firestore";

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

    if (!task.trim()) return;

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

  const filteredTasks = tasks.filter(
    (task) =>
      task.task &&
      task.task
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (

    <div className="tasks-page">

      <div className="tasks-header">

        <h1>📚 My Tasks</h1>

        <p>
          Organize your study goals and stay productive.
        </p>

      </div>

      <form
        className="task-form"
        onSubmit={handleAddTask}
      >

        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) =>
            setTask(e.target.value)
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
        placeholder=" Search tasks..."
        className="search-bar"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="task-stats">

        <div className="mini-card">
          <h3>Total</h3>
          <p>{tasks.length}</p>
        </div>

        <div className="mini-card">
          <h3>Completed</h3>
          <p>
            {
              tasks.filter(
                (task) => task.completed
              ).length
            }
          </p>
        </div>

        <div className="mini-card">
          <h3>Pending</h3>
          <p>
            {
              tasks.filter(
                (task) => !task.completed
              ).length
            }
          </p>
        </div>

      </div>

      <div className="task-grid">

        {filteredTasks.length > 0 ? (

          filteredTasks.map((task) => (

            <div
              className="task-card"
              key={task.id}
            >

              <div className="task-top">

                <h3
                  className={
                    task.completed
                      ? "completed-task"
                      : ""
                  }
                >
                  {task.task}
                </h3>

                <span
                  className={
                    task.completed
                      ? "status completed"
                      : "status pending"
                  }
                >
                  {
                    task.completed
                      ? "Completed"
                      : "Pending"
                  }
                </span>

              </div>

              <div className="task-actions">

                <button
                  className="complete-btn"
                  onClick={() =>
                    toggleComplete(
                      task.id,
                      task.completed
                    )
                  }
                >
                  {
                    task.completed
                      ? "Undo"
                      : "Complete"
                  }
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    handleDelete(task.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))

        ) : (

          <div className="empty-state">

            <h2>No tasks found </h2>

            <p>
              Add a task and start being productive.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}